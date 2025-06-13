// screens/professional/ProfessionalSearchScreen.tsx
"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, FlatList } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { Searchbar, Chip, SegmentedButtons, FAB, Text, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootState } from "../../redux/store"
import { setSearchResults, setFilters } from "../../redux/slices/professionalsSlice"
import { theme } from "../../theme"
import ProfessionalCard from "../../components/ProfessionalCard"

type RootStackParamList = {
  CreateProfessionalProfile: undefined;
  ProfessionalDetail: { professionalId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Utilidad para normalizar texto (ignora tildes y mayúsculas)
const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function ProfessionalSearchScreen() {
  const navigation = useNavigation<NavigationProp>()
  const dispatch = useDispatch()
  const { items: professionals, searchResults, filters } = useSelector((state: RootState) => state.professionals)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  const professions = [
    "Soldador", "Medico", "Albanil", "Electricista", 
    "Plomero", "Programador", "Disenador", "Mecanico"
  ]

  useEffect(() => {
    searchProfessionals()
  }, [searchQuery, filters.profession, availabilityFilter])

  const searchProfessionals = () => {
    let filtered = professionals;

    // Filtro por disponibilidad
    if (availabilityFilter !== "all") {
      filtered = filtered.filter(
        professional => professional.availability.type === availabilityFilter
      );
    }

    // Filtro por texto (prioridad)
    if (searchQuery) {
      const query = normalize(searchQuery);
      filtered = filtered.filter(professional =>
        normalize(professional.user.name).includes(query) ||
        normalize(professional.profession).includes(query) ||
        professional.specialties.some(specialty => normalize(specialty).includes(query))
      );
      // Si hay filtro de profesión, lo aplicamos también pero de forma tolerante
      if (filters.profession) {
        const profFilter = normalize(filters.profession);
        filtered = filtered.filter(
          professional => normalize(professional.profession) === profFilter
        );
      }
    } else if (filters.profession) {
      // Si no hay búsqueda por texto, pero sí filtro de profesión
      const profFilter = normalize(filters.profession);
      filtered = filtered.filter(
        professional => normalize(professional.profession) === profFilter
      );
    }

    filtered.sort((a, b) => b.rating - a.rating);

    dispatch(setSearchResults(filtered));
  };

  const handleProfessionSelect = (profession: string) => {
    const newProfession = filters.profession === profession ? "" : profession
    dispatch(setFilters({ profession: newProfession }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Buscar Profesionales</Title>
        <Text style={styles.headerSubtitle}>
          {searchResults.length} profesionales disponibles
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar profesionales..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Profesiones:</Text>
        <FlatList
          data={professions}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.professionsContainer}
          renderItem={({ item }) => (
            <Chip
              selected={filters.profession === item}
              style={[
                styles.professionChip,
                filters.profession === item && { backgroundColor: theme.colors.primary }
              ]}
              textStyle={filters.profession === item ? { color: "#fff" } : undefined}
              onPress={() => handleProfessionSelect(item)}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      <View style={styles.availabilityContainer}>
        <SegmentedButtons
          value={availabilityFilter}
          onValueChange={setAvailabilityFilter}
          buttons={[
            { value: "all", label: "Todos" },
            { value: "full-time", label: "Tiempo completo" },
            { value: "freelance", label: "Freelance" },
            { value: "part-time", label: "Medio tiempo" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProfessionalCard professional={item} />
        )}
        contentContainerStyle={styles.professionalsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No se encontraron profesionales</Text>
            <Text style={styles.emptyText}>Intenta ajustar los filtros de busqueda</Text>
          </View>
        }
      />

      <FAB
        icon="account-plus"
        style={styles.fab}
        onPress={() => navigation.navigate("CreateProfessionalProfile")} 
        label="Crear perfil profesional"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchbar: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: theme.colors.text,
  },
  professionsContainer: {
    paddingRight: 16,
  },
  professionChip: {
    marginRight: 8,
    backgroundColor: theme.colors.surface,
  },
  availabilityContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.surface,
  },
  professionalsList: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
})