import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, FlatList, TextInput, Dimensions, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Chip, ActivityIndicator, Card, Title } from "react-native-paper";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
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

export default function CommerceMapScreen({ navigation }: any) {
  const dispatch: AppDispatch = useDispatch()
  // 2. Tipar los items correctamente
  const { items: stores, status, error } = useSelector((state: RootState) => state.localStores) as { items: LocalStore[]; status: string; error?: string };
  const [selectedType, setSelectedType] = useState("")
  const [search, setSearch] = useState("")
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    dispatch(getLocalStores({ type: selectedType, search }))
  }, [dispatch, selectedType, search])

  useEffect(() => {
    (async () => {
      setLocationLoading(true)
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          setLocationError('Permiso de ubicación denegado')
          setLocationLoading(false)
          return
        }
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low })
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
      } catch (e) {
        setLocationError('No se pudo obtener la ubicación')
      } finally {
        setLocationLoading(false)
      }
    })()
  }, [])

  // 3. Validar datos antes de renderizar marcadores
  const filteredStores = stores.filter(store => {
    if (!store || !store.location || typeof store.location.lat !== 'number' || typeof store.location.lng !== 'number') return false;
    const matchesType = !selectedType || store.type === selectedType
    const matchesSearch = !search || store.name.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  // 4. Validar initialRegion para evitar NaN
  const initialRegion = (userLocation && !isNaN(userLocation.latitude) && !isNaN(userLocation.longitude))
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : {
        latitude: -17.3895, // Cochabamba
        longitude: -66.1568,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }

  const showFitButton = filteredStores.length > 1;
  const handleFitToMarkers = () => {
    if (filteredStores.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        filteredStores.map(f => ({
          latitude: f.location.lat,
          longitude: f.location.lng,
        })),
        {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        }
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mapa de Comercios</Title>
        <Text style={styles.subtitle}>Encuentra tiendas de barrio y supermercados</Text>
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
        onChangeText={setSearch}
      />
      <View style={styles.mapContainer}>
        {(status === "loading" || locationLoading) ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" />
        ) : error ? (
          <View style={styles.emptyContainer}><Text style={styles.emptyText}>Error: {error}</Text></View>
        ) : locationError ? (
          <View style={styles.emptyContainer}><Text style={styles.emptyText}>{locationError}</Text></View>
        ) : (
          <>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_DEFAULT}
              initialRegion={initialRegion}
              region={initialRegion}
              mapType="none"
              showsUserLocation={!!userLocation}
              showsMyLocationButton={true}
              minZoomLevel={2}
              maxZoomLevel={18}
            >
              <UrlTile
                urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />
              {filteredStores.map(store => {
                // Validar datos antes de renderizar el marcador
                if (!store.location || typeof store.location.lat !== 'number' || typeof store.location.lng !== 'number') return null;
                const meta = (store.type in typeMeta)
                  ? typeMeta[store.type as keyof typeof typeMeta]
                  : typeMeta.default;
                return (
                  <Marker
                    key={store._id}
                    coordinate={{ latitude: store.location.lat, longitude: store.location.lng }}
                    title={store.name}
                    description={store.type}
                    onPress={() => navigation.navigate("CommerceDetail", { id: store._id })}
                  >
                    <MaterialCommunityIcons name={meta.icon as any} size={32} color={meta.color} />
                  </Marker>
                )
              })}
            </MapView>
            {showFitButton && (
              <TouchableOpacity style={styles.fitButton} onPress={handleFitToMarkers}>
                <MaterialCommunityIcons name="map-search" size={28} color="white" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      {filteredStores.length === 0 && !locationLoading && !error && !locationError ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron comercios</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStores}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            if (!item) return null;
            const meta = (item.type in typeMeta)
              ? typeMeta[item.type as keyof typeof typeMeta]
              : typeMeta.default;
            return (
              <Card style={styles.card} onPress={() => navigation.navigate("CommerceDetail", { id: item._id })}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.iconCol}>
                    <MaterialCommunityIcons name={meta.icon as any} size={32} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Title style={styles.cardTitle}>{item.name}</Title>
                    <Text style={styles.cardType}>{item.type?.charAt(0).toUpperCase() + item.type?.slice(1)} • {item.city}</Text>
                    <Text style={styles.cardAddress}>{item.address}</Text>
                    <Text style={styles.cardHours}>{item.openingHours}</Text>
                  </View>
                </Card.Content>
              </Card>
            )
          }}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 120 }}
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
}) 