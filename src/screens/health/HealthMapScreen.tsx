import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, TextInput, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Chip, ActivityIndicator, Card, Title } from "react-native-paper";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
import { fetchHealthFacilities } from "../../redux/slices/healthFacilitiesSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import { theme } from "../../theme";

const facilityTypes = [
  { label: "Todos", value: "" },
  { label: "Hospitales", value: "hospital" },
  { label: "Clínicas", value: "clinic" },
  { label: "Farmacias", value: "pharmacy" },
  { label: "Laboratorios", value: "laboratory" },
  { label: "Dentistas", value: "dentist" },
]

export default function HealthMapScreen({ navigation }: any) {
  const dispatch: AppDispatch = useDispatch()
  const { items: facilities, status } = useSelector((state: RootState) => state.healthFacilities)
  const [selectedType, setSelectedType] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    dispatch(fetchHealthFacilities({ type: selectedType, search }))
  }, [dispatch, selectedType, search])

  const filteredFacilities = facilities.filter(facility => {
    const matchesType = !selectedType || facility.type === selectedType
    const matchesSearch = !search || facility.name.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  // Centrar el mapa en Cochabamba
  const initialRegion = {
    latitude: -17.3895,
    longitude: -66.1568,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
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
        {status === "loading" ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : (
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={initialRegion}
            mapType="none"
            showsUserLocation={true}
            showsMyLocationButton={true}
            minZoomLevel={11}
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
      <FlatList
        data={filteredFacilities}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate("HealthFacilityDetail", { id: item._id })}>
            <Card.Content>
              <Title>{item.name}</Title>
              <Text>{item.type} • {item.address}</Text>
              <Text>{item.openingHours}</Text>
            </Card.Content>
          </Card>
        )}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
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
}) 