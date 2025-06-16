import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, InteractionManager } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Chip, ActivityIndicator, Card, Title } from "react-native-paper";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile, Region } from "react-native-maps";
import { fetchHealthFacilities } from "../../redux/slices/healthFacilitiesSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import { theme } from "../../theme";
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const facilityTypes = [
  { label: "Todos", value: "" },
  { label: "Hospitales", value: "hospital" },
  { label: "Clínicas", value: "clinic" },
  { label: "Farmacias", value: "pharmacy" },
  { label: "Laboratorios", value: "laboratory" },
  { label: "Dentistas", value: "dentist" },
];

const typeMeta = {
  hospital: { icon: 'hospital-building', color: '#10B981' },
  clinic: { icon: 'medical-bag', color: '#3B82F6' },
  pharmacy: { icon: 'pill', color: '#F59E0B' },
  laboratory: { icon: 'flask', color: '#8B5CF6' },
  dentist: { icon: 'tooth', color: '#EC4899' },
  default: { icon: 'map-marker', color: theme.colors.primary },
};

interface HealthFacility {
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

// Distance cache
const distanceCache = new Map<string, number>();
const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const key = `${lat1.toFixed(6)},${lon1.toFixed(6)},${lat2.toFixed(6)},${lon2.toFixed(6)}`;
  if (distanceCache.has(key)) return distanceCache.get(key)!;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  if (distanceCache.size > 1000) distanceCache.clear();
  distanceCache.set(key, distance);
  return distance;
};

const FacilityCard = React.memo(({ item, userLocation, onPress }: {
  item: HealthFacility;
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
          <Text style={styles.cardType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.city}</Text>
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

const FacilityMarker = React.memo(({ facility, onPress }: {
  facility: HealthFacility;
  onPress: () => void;
}) => (
  <Marker
    key={facility._id}
    coordinate={{ latitude: facility.location.lat, longitude: facility.location.lng }}
    title={facility.name}
    description={facility.type}
    onPress={onPress}
  />
));

export default function HealthMapScreen({ navigation }: any) {
  const dispatch: AppDispatch = useDispatch();
  const { items: facilities, status } = useSelector((state: RootState) => state.healthFacilities);
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

  // Optimized filtered facilities
  const filteredFacilities = useMemo(() => {
    if (!facilities.length) return [];
    const typeFilter = selectedType ? (facility: HealthFacility) => facility.type === selectedType : () => true;
    const searchFilter = search
      ? (facility: HealthFacility) => facility.name.toLowerCase().includes(search.toLowerCase())
      : () => true;
    return facilities.filter(facility => typeFilter(facility) && searchFilter(facility));
  }, [facilities, selectedType, search]);

  // Optimized visible markers calculation
  const visibleMarkers = useMemo(() => {
    if (!mapRegion || !isMapReady) return [];
    const buffer = 0.001;
    return filteredFacilities.filter(facility => {
      const isVisible =
        facility.location.lat >= mapRegion.latitude - mapRegion.latitudeDelta - buffer &&
        facility.location.lat <= mapRegion.latitude + mapRegion.latitudeDelta + buffer &&
        facility.location.lng >= mapRegion.longitude - mapRegion.longitudeDelta - buffer &&
        facility.location.lng <= mapRegion.longitude + mapRegion.longitudeDelta + buffer;
      return isVisible;
    });
  }, [filteredFacilities, mapRegion, isMapReady]);

  // Memoized initial region
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

  // Location permission and get location
  const requestLocationPermission = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
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
  React.useEffect(() => {
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

  // Fetch facilities when filters change
  useEffect(() => {
    dispatch(fetchHealthFacilities({ type: selectedType, search }));
  }, [dispatch, selectedType, search]);

  // Debounced search
  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      dispatch(fetchHealthFacilities({ type: selectedType, search: text }));
    }, 300);
  }, [dispatch, selectedType]);

  const handleRegionChange = useCallback((region: Region) => {
    setMapRegion(region);
  }, []);

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const handleFacilityPress = useCallback((facilityId: string) => {
    navigation.navigate("HealthFacilityDetail", { id: facilityId });
  }, [navigation]);

  const renderMarkers = useCallback(() => {
    return visibleMarkers.map(facility => (
      <FacilityMarker
        key={facility._id}
        facility={facility}
        onPress={() => handleFacilityPress(facility._id)}
      />
    ));
  }, [visibleMarkers, handleFacilityPress]);

  const renderFacilityCard = useCallback(({ item }: { item: HealthFacility }) => (
    <FacilityCard
      item={item}
      userLocation={userLocation}
      onPress={() => handleFacilityPress(item._id)}
    />
  ), [userLocation, handleFacilityPress]);

  const keyExtractor = useCallback((item: HealthFacility) => item._id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 120,
    offset: 120 * index,
    index,
  }), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mapa de Salud</Title>
        <Text style={styles.subtitle}>Encuentra hospitales, clínicas y farmacias</Text>
      </View>
      <View style={styles.filtersRow}>
        <FlatList
          data={facilityTypes}
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
        placeholder="Buscar establecimiento..."
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
      </View>
      {filteredFacilities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="hospital" size={64} color={theme.colors.placeholder} />
          <Text style={styles.emptyText}>No se encontraron establecimientos</Text>
          <Text style={styles.emptySubtext}>
            {search ? 'Intenta con otros términos de búsqueda' : 'Ajusta los filtros para ver más resultados'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFacilities}
          keyExtractor={keyExtractor}
          renderItem={renderFacilityCard}
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
}); 