import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { StyleSheet, View, FlatList, TextInput, Dimensions, TouchableOpacity } from "react-native";
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
]

const typeMeta = {
  barrio: { icon: 'storefront', color: '#10B981' },
  supermercado: { icon: 'cart', color: '#3B82F6' },
  minimarket: { icon: 'shopping-outline', color: '#F59E0B' },
  mercado: { icon: 'basket', color: '#8B5CF6' },
  otro: { icon: 'store', color: theme.colors.primary },
  default: { icon: 'map-marker', color: theme.colors.primary },
};

// 1. Definir el tipo de comercio local
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

// Función auxiliar para calcular distancia
const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radio de la tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function CommerceMapScreen({ navigation }: any) {
  const dispatch: AppDispatch = useDispatch()
  const { items: stores, status } = useSelector((state: RootState) => state.localStores)
  const [selectedType, setSelectedType] = useState("")
  const [search, setSearch] = useState("")
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [mapRegion, setMapRegion] = useState<Region | null>(null)
  const mapRef = useRef<MapView>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Memoize filtered stores
  const filteredStores = useMemo(() => 
    stores.filter(store => {
      const matchesType = !selectedType || store.type === selectedType
      const matchesSearch = !search || store.name.toLowerCase().includes(search.toLowerCase())
      return matchesType && matchesSearch
    }), [stores, selectedType, search])

  // Memoize initial region
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
        }, [userLocation])

  useEffect(() => {
    dispatch(getLocalStores({ type: selectedType, search }))
  }, [dispatch, selectedType, search])

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) return;
      setLocationLoading(true)
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          setLocationError('Permiso de ubicación denegado')
          return
        }
        let loc = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10
        })
        if (isMounted) {
          setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
        }
      } catch (e) {
        if (isMounted) {
          setLocationError('No se pudo obtener la ubicación')
        }
      } finally {
        if (isMounted) {
          setLocationLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false;
    }
  }, [])

  const handleRegionChange = useCallback((region: Region) => {
    setMapRegion(region)
  }, [])

  const handleFitToMarkers = useCallback(() => {
    if (filteredStores.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        filteredStores.map(s => ({
          latitude: s.location.lat,
          longitude: s.location.lng,
        })),
        {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        }
      )
    }
  }, [filteredStores])

  const renderMarkers = useCallback(() => {
    if (!mapRegion) return null;

    return filteredStores
      .filter(store => {
        // Solo renderizar marcadores visibles en la región actual
        const isVisible = 
          store.location.lat >= mapRegion.latitude - mapRegion.latitudeDelta &&
          store.location.lat <= mapRegion.latitude + mapRegion.latitudeDelta &&
          store.location.lng >= mapRegion.longitude - mapRegion.longitudeDelta &&
          store.location.lng <= mapRegion.longitude + mapRegion.longitudeDelta;
        
        return isVisible;
      })
      .map(store => (
        <Marker
          key={store._id}
          coordinate={{ latitude: store.location.lat, longitude: store.location.lng }}
          title={store.name}
          description={store.type}
          onPress={() => navigation.navigate("LocalStoreDetail", { id: store._id })}
        />
      ));
  }, [filteredStores, mapRegion, navigation]);

  // Debounce para el input de búsqueda
  const handleSearchChange = (text: string) => {
    setSearch(text)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      dispatch(getLocalStores({ type: selectedType, search: text }))
    }, 400)
  }

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
        />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar comercio..."
        value={search}
        onChangeText={handleSearchChange}
      />
      <View style={styles.mapContainer}>
        {(status === "loading" || locationLoading) ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" />
        ) : locationError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{locationError}</Text>
            <Text style={styles.errorText}>Activa los permisos de ubicación para ver el mapa.</Text>
          </View>
        ) : !initialRegion || isNaN(initialRegion.latitude) || isNaN(initialRegion.longitude) ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudo determinar la ubicación inicial del mapa.</Text>
          </View>
        ) : (
          <>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_DEFAULT}
              initialRegion={initialRegion}
              onRegionChangeComplete={handleRegionChange}
              mapType="none"
              showsUserLocation={!!userLocation}
              showsMyLocationButton={true}
              minZoomLevel={2}
              maxZoomLevel={18}
              moveOnMarkerPress={false}
              loadingEnabled={true}
              loadingIndicatorColor={theme.colors.primary}
              loadingBackgroundColor={theme.colors.background}
              removeClippedSubviews={true}
              zoomEnabled={true}
              rotateEnabled={true}
              scrollEnabled={true}
              pitchEnabled={true}
              toolbarEnabled={true}
              showsCompass={true}
              showsScale={true}
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
            {filteredStores.length > 1 && (
              <TouchableOpacity style={styles.fitButton} onPress={handleFitToMarkers}>
                <MaterialCommunityIcons name="map-search" size={28} color="white" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      {filteredStores.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron comercios</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStores}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            let distance = null
            if (userLocation) {
              distance = getDistanceKm(userLocation.latitude, userLocation.longitude, item.location.lat, item.location.lng)
            }
            const meta = (item.type in typeMeta)
              ? typeMeta[item.type as keyof typeof typeMeta]
              : typeMeta.default;
            const is24h = (item.openingHours || '').includes('24')
            return (
              <Card style={styles.card} onPress={() => navigation.navigate("LocalStoreDetail", { id: item._id })}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.iconCol}>
                    <MaterialCommunityIcons name={meta.icon as any} size={32} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Title style={styles.cardTitle}>{item.name}</Title>
                    <Text style={styles.cardType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.city}</Text>
                    <Text style={styles.cardAddress}>{item.address}</Text>
                    <Text style={styles.cardHours}>{item.openingHours}</Text>
                    {is24h && <Text style={styles.badge24h}>24h</Text>}
                    {distance !== null && (
                      <Text style={styles.distance}>{distance.toFixed(2)} km</Text>
                    )}
                  </View>
                </Card.Content>
              </Card>
            )
          }}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 120 }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={5}
          updateCellsBatchingPeriod={50}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: theme.colors.placeholder, marginBottom: 8 },
  filtersRow: { flexDirection: "row", paddingHorizontal: 8, marginBottom: 8 },
  chip: { marginRight: 8, borderRadius: 16 },
  searchInput: { marginHorizontal: 16, marginBottom: 8, borderRadius: 8, backgroundColor: theme.colors.surface, padding: 8 },
  mapContainer: { height: 280, marginHorizontal: 16, borderRadius: 16, overflow: "hidden", marginBottom: 8 },
  map: { flex: 1, height: 280, borderRadius: 16 },
  list: { flex: 1, marginTop: 8 },
  card: { marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
  cardContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  iconCol: { marginRight: 16, alignItems: 'center', justifyContent: 'center', width: 40 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  cardType: { fontSize: 13, color: theme.colors.primary, marginBottom: 2 },
  cardAddress: { fontSize: 12, color: theme.colors.placeholder, marginBottom: 2 },
  cardHours: { fontSize: 12, color: theme.colors.text, marginBottom: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 32 },
  emptyText: { fontSize: 16, color: theme.colors.placeholder, textAlign: 'center' },
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  badge24h: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.primary,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  distance: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
}) 