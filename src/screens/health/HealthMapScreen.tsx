import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, TextInput, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Chip, ActivityIndicator, Card, Title } from "react-native-paper";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
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
]

// Helper para íconos y colores por tipo
const typeMeta = {
  hospital: { icon: 'hospital-building', color: '#10B981' },
  clinic: { icon: 'medical-bag', color: '#3B82F6' },
  pharmacy: { icon: 'pharmacy', color: '#F59E0B' },
  laboratory: { icon: 'flask', color: '#8B5CF6' },
  dentist: { icon: 'tooth', color: '#EC4899' },
  default: { icon: 'map-marker', color: theme.colors.primary },
};

export default function HealthMapScreen({ navigation }: any) {
  const dispatch: AppDispatch = useDispatch()
  const { items: facilities, status } = useSelector((state: RootState) => state.healthFacilities)
  const [selectedType, setSelectedType] = useState("")
  const [search, setSearch] = useState("")
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchHealthFacilities({ type: selectedType, search }))
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

  const filteredFacilities = facilities.filter(facility => {
    const matchesType = !selectedType || facility.type === selectedType
    const matchesSearch = !search || facility.name.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  // Centrar el mapa en Cochabamba o en la ubicación del usuario
  const initialRegion = userLocation
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
      }

  // Calcular distancia en km entre dos puntos
  function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371 // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

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
        />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar establecimiento..."
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.mapContainer}>
        {(status === "loading" || locationLoading) ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" />
        ) : (
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={initialRegion}
            region={userLocation ? { ...initialRegion } : undefined}
            mapType="none"
            showsUserLocation={!!userLocation}
            showsMyLocationButton={true}
            minZoomLevel={2}
            maxZoomLevel={18}
          >
            {/* OpenStreetMap tiles */}
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />
            {filteredFacilities.map(facility => (
              <Marker
                key={facility._id}
                coordinate={{ latitude: facility.location.lat, longitude: facility.location.lng }}
                title={facility.name}
                description={facility.type}
                onPress={() => navigation.navigate("HealthFacilityDetail", { id: facility._id })}
              />
            ))}
          </MapView>
        )}
      </View>
      {filteredFacilities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron establecimientos</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFacilities}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            let distance = null
            if (userLocation) {
              distance = getDistanceKm(userLocation.latitude, userLocation.longitude, item.location.lat, item.location.lng)
            }
            // Type guard para íconos por tipo
            const meta = (item.type in typeMeta)
              ? typeMeta[item.type as keyof typeof typeMeta]
              : typeMeta.default;
            const is24h = (item.openingHours || '').includes('24')
            return (
              <Card style={styles.card} onPress={() => navigation.navigate("HealthFacilityDetail", { id: item._id })}>
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
  badge24h: { backgroundColor: '#10B981', color: 'white', fontSize: 10, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 2, marginBottom: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 32 },
  emptyText: { fontSize: 16, color: theme.colors.placeholder, textAlign: 'center' },
  distance: { fontSize: 12, color: theme.colors.primary, marginTop: 4 },
}) 