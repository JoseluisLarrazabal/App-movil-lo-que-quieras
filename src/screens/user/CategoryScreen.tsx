"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native"
import { useDispatch } from "react-redux"
import { useRoute, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Text, Searchbar, SegmentedButtons, Appbar } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { AppDispatch } from "../../redux/store"
import type { Service } from "../../redux/slices/servicesSlice"
import { theme } from "../../theme"
import ServiceCard from "../../components/ServiceCard"
import { fetchServicesByCategory } from "../../redux/slices/servicesSlice"

type RootStackParamList = {
  // otras screens ...
  ServiceDetail: { serviceId: string }
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ServiceDetail'>;

export default function CategoryScreen() {
  const route = useRoute()
  const navigation = useNavigation<NavigationProp>()
  const dispatch = useDispatch<AppDispatch>()
  const { categoryId, categoryName } = route.params as { categoryId: string; categoryName: string }

  const [categoryServices, setCategoryServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")

  useEffect(() => {
    setLoading(true)
    setError(null)
    dispatch(fetchServicesByCategory({ categoryId }))
      .unwrap()
      .then(setCategoryServices)
      .catch((err) => setError(err?.message || "Error al cargar servicios"))
      .finally(() => setLoading(false))
  }, [dispatch, categoryId])

  const filteredServices = categoryServices
    .filter((service) => {
      if (!searchQuery) return true
      return (
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "popular":
        default:
          return b.rating - a.rating
      }
    })

  const navigateToServiceDetail = (serviceId: string) => {
    navigation.navigate("ServiceDetail", { serviceId })
  }

  const renderServiceItem = ({ item }: { item: any }) => (
    <View style={styles.serviceItem}>
      <ServiceCard service={item} onPress={() => navigateToServiceDetail(item.id)} />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={categoryName} />
        <Appbar.Action icon="filter-variant" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={`Buscar en ${categoryName}...`}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filtersContainer}>
        <SegmentedButtons
          value={sortBy}
          onValueChange={setSortBy}
          buttons={[
            { value: "popular", label: "Popular" },
            { value: "rating", label: "Mejor valorado" },
            { value: "price-low", label: "Precio ↑" },
            { value: "price-high", label: "Precio ↓" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <View style={styles.resultsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : (
          <Text style={styles.resultsText}>{filteredServices.length} servicios encontrados</Text>
        )}
      </View>

      {!loading && !error && (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.serviceItem}>
              <ServiceCard service={item} onPress={() => navigateToServiceDetail(item.id)} />
            </View>
          )}
          contentContainerStyle={styles.servicesList}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron servicios en esta categoría</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchbar: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.surface,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  serviceItem: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: "center",
  },
})
