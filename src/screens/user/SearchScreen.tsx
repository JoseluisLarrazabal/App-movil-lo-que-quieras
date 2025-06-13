"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, FlatList } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { Searchbar, Text, Chip, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { RootState, AppDispatch } from "../../redux/store"
import { fetchCategories, setSelectedCategory } from "../../redux/slices/categoriesSlice"
import { addSearch } from "../../redux/slices/searchHistorySlice"
import { theme } from "../../theme"
import ServiceCard from "../../components/ServiceCard"
import CategoryButton from "../../components/CategoryButton"

export default function SearchScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch<AppDispatch>()
  const { items: services } = useSelector((state: RootState) => state.services)
  const { items: categories, status: categoriesStatus } = useSelector((state: RootState) => state.categories)
  const { recentSearches } = useSelector((state: RootState) => state.searchHistory)

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredServices, setFilteredServices] = useState(services)

  // Cargar categorías al montar el componente
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories())
    }
  }, [dispatch, categoriesStatus])

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.trim()) {
      dispatch(addSearch(query))
      const filtered = services.filter(
        (service) =>
          service.title.toLowerCase().includes(query.toLowerCase()) ||
          service.description.toLowerCase().includes(query.toLowerCase()) ||
          service.category.name.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredServices(filtered)
    } else {
      setFilteredServices(services)
    }
  }

  const handleRecentSearch = (search: string) => {
    setSearchQuery(search)
    handleSearch(search)
  }

  const handleCategoryPress = (category: any) => {
    dispatch(setSelectedCategory(category))
    handleSearch(category.name)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar servicios..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {!searchQuery && (
        <View style={styles.suggestionsContainer}>
          <Title style={styles.suggestionsTitle}>Búsquedas recientes</Title>
          <View style={styles.chipsContainer}>
            {recentSearches.map((search, index) => (
              <Chip key={index} style={styles.chip} onPress={() => handleRecentSearch(search)}>
                {search}
              </Chip>
            ))}
          </View>

          <Title style={styles.suggestionsTitle}>Categorías populares</Title>
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            renderItem={({ item }) => (
              <CategoryButton
                key={item._id}
                category={item}
                onPress={() => handleCategoryPress(item)}
              />
            )}
          />
        </View>
      )}

      {searchQuery && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredServices.length} resultados para "{searchQuery}"
          </Text>
          <FlatList
            data={filteredServices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.serviceItem}>
                <ServiceCard service={item} onPress={() => {}} />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
          />
        </View>
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
    paddingVertical: 16,
  },
  searchbar: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 16,
  },
  servicesList: {
    paddingBottom: 20,
  },
  serviceItem: {
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
})
