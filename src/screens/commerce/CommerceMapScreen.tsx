import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, InteractionManager } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Chip, ActivityIndicator, Card, Title } from "react-native-paper";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile, Region } from "react-native-maps";
import { getLocalStores } from "../../redux/slices/localStoresSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import { theme } from "../../theme";
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const storeTypes = [
  { label: "Todos", value: "" },
  { label: "Barrio", value: "barrio" },
  { label: "Supermercados", value: "supermercado" },
  { label: "Minimarkets", value: "minimarket" },
  { label: "Mercados", value: "mercado" },
];

const typeMeta = {
  barrio: { icon: 'storefront', color: '#10B981' },
  supermercado: { icon: 'cart', color: '#3B82F6' },
  minimarket: { icon: 'shopping-outline', color: '#F59E0B' },
  mercado: { icon: 'basket', color: '#8B5CF6' },
  otro: { icon: 'store', color: theme.colors.primary },
  default: { icon: 'map-marker', color: theme.colors.primary },
};

interface LocalStore {
  _id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  location: { lat: number; lng: number };
  contact?: { phone?: string; whatsapp?: string; website?: string };
  openingHours?: string;
  services?: string[];
  isActive?: boolean;
  featured?: boolean;
  images?: string[];
  description?: string;
}

// Optimized distance calculation with caching
const distanceCache = new Map<string, number>();

const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const key = `${lat1.toFixed(6)},${lon1.toFixed(6)},${lat2.toFixed(6)},${lon2.toFixed(6)}`;
  
  if (distanceCache.has(key)) {
    return distanceCache.get(key)!;
  }
  
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Cache the result (limit cache size to prevent memory issues)
  if (distanceCache.size > 1000) {
    distanceCache.clear();
  }
  distanceCache.set(key, distance);
  
  return distance;
};

// Memoized store card component for better performance
const StoreCard = React.memo(({ item, userLocation, onPress }: {
  item: LocalStore;
  userLocation: { latitude: number; longitude: number } | null;
  onPress: () => void;
}) => {
  const distance = useMemo(() => {
    if (!userLocation) return null;
    return getDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      item.location.lat,
      item.location.lng
    );
  }, [userLocation, item.location]);

  const meta = useMemo(() => 
    (item.type in typeMeta)
      ? typeMeta[item.type as keyof typeof typeMeta]
      : typeMeta.default
  , [item.type]);

  const is24h = useMemo(() => 
    (item.openingHours || '').includes('24')
  , [item.openingHours]);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconCol}>
          <MaterialCommunityIcons name={meta.icon as any} size={32} color={meta.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Title style={styles.cardTitle}>{item.name}</Title>
          <Text style={styles.cardType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.city}
          </Text>
          <Text style={styles.cardAddress}>{item.address}</Text>
          {item.openingHours && (
            <Text style={styles.cardHours}>{item.openingHours}</Text>
          )}
          {is24h && <Text style={styles.badge24h}>24h</Text>}
          {distance !== null && (
            <Text style={styles.distance}>{distance.toFixed(2)} km</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
});

// Memoized marker component
const StoreMarker = React.memo(({ store, onPress }: {
  store: LocalStore;
  onPress: () => void;
}) => (
  <Marker
    key={store._id}
    coordinate={{ latitude: store.location.lat, longitude: store.location.lng }}
    title={store.name}
    description={store.type}
    onPress={onPress}
  />
));

export default function CommerceMapScreen({ navigation }: any) {
  const dispatch: AppDispatch = useDispatch();
  const { items: stores, status } = useSelector((state: RootState) => state.localStores);
  const [selectedType, setSelectedType] = useState("");
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [hasAnimatedToUser, setHasAnimatedToUser] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  
  const mapRef = useRef<MapView>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationWatchId = useRef<Location.LocationSubscription | null>(null);

  // Optimized filtered stores with better memoization
  const filteredStores = useMemo(() => {
    if (!stores.length) return [];
    
    const typeFilter = selectedType ? (store: LocalStore) => store.type === selectedType : () => true;
    const searchFilter = search 
      ? (store: LocalStore) => store.name.toLowerCase().includes(search.toLowerCase())
      : () => true;
    
    return stores.filter(store => typeFilter(store) && searchFilter(store));
  }, [stores, selectedType, search]);

  // Optimized visible markers calculation
  const visibleMarkers = useMemo(() => {
    if (!mapRegion || !isMapReady) return [];
    
    const buffer = 0.001; // Small buffer to prevent markers from disappearing at edges
    return filteredStores.filter(store => {
      const isVisible = 
        store.location.lat >= mapRegion.latitude - mapRegion.latitudeDelta - buffer &&
        store.location.lat <= mapRegion.latitude + mapRegion.latitudeDelta + buffer &&
        store.location.lng >= mapRegion.longitude - mapRegion.longitudeDelta - buffer &&
        store.location.lng <= mapRegion.longitude + mapRegion.longitudeDelta + buffer;
      
      return isVisible;
    });
  }, [filteredStores, mapRegion, isMapReady]);

  // Optimized initial region
  const initialRegion = useMemo(() => 
    userLocation
      ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }
      : {
          latitude: -17.3895,
          longitude: -66.1568,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }, [userLocation]);

  // Optimized location handling with better error handling and retry logic
  const requestLocationPermission = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // Try to request again if denied
      const result = await Location.requestForegroundPermissionsAsync();
      return result.status === 'granted';
    }
    return true;
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      const location = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 50
      });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      console.warn('Error getting location:', error);
      throw error;
    }
  }, []);

  const initializeLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLocationError('Permiso de ubicación denegado');
        return;
      }

      const location = await getCurrentLocation();
      setUserLocation(location);
      setHasAnimatedToUser(false);
    } catch (error) {
      setLocationError('No se pudo obtener la ubicación');
    } finally {
      setLocationLoading(false);
    }
  }, [requestLocationPermission, getCurrentLocation]);

  // Initial location setup
  useEffect(() => {
    // Use InteractionManager to delay location request until after initial render
    const interaction = InteractionManager.runAfterInteractions(() => {
      initializeLocation();
    });

    return () => {
      interaction.cancel();
      if (locationWatchId.current) {
        locationWatchId.current.remove();
      }
    };
  }, [initializeLocation]);

  // Animate to user location when available
  useEffect(() => {
    if (userLocation && mapRef.current && !hasAnimatedToUser && isMapReady) {
      const timeout = setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }, 1000);
        setHasAnimatedToUser(true);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [userLocation, hasAnimatedToUser, isMapReady]);

  // Fetch stores when filters change
  useEffect(() => {
    dispatch(getLocalStores({ type: selectedType, search }));
  }, [dispatch, selectedType, search]);

  // Optimized search with better debouncing
  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      dispatch(getLocalStores({ type: selectedType, search: text }));
    }, 300);
  }, [dispatch, selectedType]);

  const handleRegionChange = useCallback((region: Region) => {
    setMapRegion(region);
  }, []);

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const handleFitToMarkers = useCallback(() => {
    if (filteredStores.length > 0 && mapRef.current && isMapReady) {
      const coordinates = filteredStores.map(s => ({
        latitude: s.location.lat,
        longitude: s.location.lng,
      }));
      
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  }, [filteredStores, isMapReady]);

  const handleStorePress = useCallback((storeId: string) => {
    navigation.navigate("CommerceDetailScreen", { id: storeId });
  }, [navigation]);

  const renderMarkers = useCallback(() => {
    return visibleMarkers.map(store => (
      <StoreMarker
        key={store._id}
        store={store}
        onPress={() => handleStorePress(store._id)}
      />
    ));
  }, [visibleMarkers, handleStorePress]);

  const renderStoreCard = useCallback(({ item }: { item: LocalStore }) => (
    <StoreCard
      item={item}
      userLocation={userLocation}
      onPress={() => handleStorePress(item._id)}
    />
  ), [userLocation, handleStorePress]);

  const keyExtractor = useCallback((item: LocalStore) => item._id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 120, // Approximate height of each card
    offset: 120 * index,
    index,
  }), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mapa de Comercios</Title>
        <Text style={styles.subtitle}>Encuentra supermercados y tiendas locales</Text>
      </View>
      
      <View style={styles.filtersRow}>
        <FlatList
          data={storeTypes}
          keyExtractor={item => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              style={styles.chip}
              selected={selectedType === item.value}
              onPress={() => setSelectedType(item.value)}
            >
              {item.label}
            </Chip>
          )}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={3}
        />
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar comercio..."
        value={search}
        onChangeText={handleSearchChange}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={initialRegion}
          onRegionChangeComplete={handleRegionChange}
          onMapReady={handleMapReady}
          mapType="none"
          showsUserLocation={!!userLocation}
          showsMyLocationButton={false}
          minZoomLevel={8}
          maxZoomLevel={18}
          moveOnMarkerPress={false}
          loadingEnabled={true}
          loadingIndicatorColor={theme.colors.primary}
          loadingBackgroundColor={theme.colors.background}
          removeClippedSubviews={true}
          zoomEnabled={true}
          rotateEnabled={false}
          scrollEnabled={true}
          pitchEnabled={false}
          toolbarEnabled={false}
          showsCompass={false}
          showsScale={false}
          showsTraffic={false}
          showsBuildings={false}
          showsIndoors={false}
          showsPointsOfInterest={false}
        >
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
            zIndex={-1}
          />
          {renderMarkers()}
        </MapView>
        
        {locationLoading && (
          <View style={styles.loaderOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
          </View>
        )}
        
        {locationError && !locationLoading && (
          <View style={styles.locationError}>
            <MaterialCommunityIcons name="map-marker-off" size={48} color={theme.colors.error} />
            <Text style={styles.errorText}>{locationError}</Text>
            <Text style={styles.errorSubtext}>Puedes navegar el mapa manualmente</Text>
            <TouchableOpacity onPress={initializeLocation} style={styles.retryButton}>
              <MaterialCommunityIcons name="refresh" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {filteredStores.length > 1 && (
          <TouchableOpacity style={styles.fitButton} onPress={handleFitToMarkers}>
            <MaterialCommunityIcons name="map-search" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      
      {filteredStores.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="store-off" size={64} color={theme.colors.placeholder} />
          <Text style={styles.emptyText}>No se encontraron comercios</Text>
          <Text style={styles.emptySubtext}>
            {search ? 'Intenta con otros términos de búsqueda' : 'Ajusta los filtros para ver más resultados'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStores}
          keyExtractor={keyExtractor}
          renderItem={renderStoreCard}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={5}
          initialNumToRender={6}
          updateCellsBatchingPeriod={100}
          onEndReachedThreshold={0.3}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  header: { 
    padding: 16,
    paddingBottom: 8
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold",
    marginBottom: 4
  },
  subtitle: { 
    fontSize: 14, 
    color: theme.colors.placeholder 
  },
  filtersRow: { 
    flexDirection: "row", 
    paddingHorizontal: 8, 
    marginBottom: 12,
    paddingVertical: 4
  },
  chip: { 
    marginRight: 8, 
    borderRadius: 20,
    marginVertical: 2
  },
  searchInput: { 
    marginHorizontal: 16, 
    marginBottom: 12, 
    borderRadius: 12, 
    backgroundColor: theme.colors.surface, 
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.outline
  },
  mapContainer: { 
    height: 300, 
    marginHorizontal: 16, 
    borderRadius: 16, 
    overflow: "hidden", 
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: { 
    flex: 1 
  },
  list: { 
    flex: 1 
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 8
  },
  card: { 
    marginHorizontal: 16, 
    marginBottom: 12, 
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16
  },
  iconCol: { 
    marginRight: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 4,
    lineHeight: 22
  },
  cardType: { 
    fontSize: 14, 
    color: theme.colors.primary, 
    marginBottom: 4,
    fontWeight: '500'
  },
  cardAddress: { 
    fontSize: 13, 
    color: theme.colors.placeholder, 
    marginBottom: 4,
    lineHeight: 16
  },
  cardHours: { 
    fontSize: 13, 
    color: theme.colors.text,
    fontWeight: '500'
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1, 
    paddingHorizontal: 32,
    paddingTop: 40
  },
  emptyText: { 
    fontSize: 18, 
    color: theme.colors.placeholder, 
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: 'center',
    opacity: 0.7
  },
  fitButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  badge24h: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.primary,
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 'bold',
    overflow: 'hidden'
  },
  distance: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden'
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '500'
  },
  locationError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8
  },
  errorSubtext: {
    color: theme.colors.placeholder,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
});