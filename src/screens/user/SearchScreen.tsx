"use client"

import { useState } from "react"
import { StyleSheet, View, FlatList } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { Searchbar, Text, Chip, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState } from "../../redux/store"
import { addSearch } from "../../redux/slices/searchHistorySlice"
import { theme } from "../../theme"
import ServiceCard from "../../components/ServiceCard"

export default function SearchScreen() {
  const dispatch = useDispatch()
  const { items: services } = useSelector((state: RootState) => state.services)
  const { items: categories } = useSelector((state: RootState) => state.categories)
  const { recentSearches } = useSelector((state: RootState) => state.searchHistory)

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredServices, setFilteredServices] = useState(services)

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
          <View style={styles.chipsContainer}>
            {categories.slice(0, 6).map((category) => (
              <Chip key={category.id} style={styles.chip} onPress={() => handleRecentSearch(category.name)}>
                {category.icon} {category.name}
              </Chip>
            ))}
          </View>
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
})
