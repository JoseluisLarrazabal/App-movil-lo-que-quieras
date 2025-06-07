"use client"

import { useState } from "react"
import { StyleSheet, View, FlatList, Alert } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { useNavigation } from "@react-navigation/native"
import { Text, Card, Button, FAB, Searchbar, Menu, IconButton, Chip, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState } from "../../redux/store"
import { deleteService } from "../../redux/slices/servicesSlice"
import { theme } from "../../theme"

export default function ProviderServicesScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { items: services } = useSelector((state: RootState) => state.services)

  const [searchQuery, setSearchQuery] = useState("")
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null)

  // Filter services for current provider (mock)
  const providerServices = services.filter((service) => service.provider.id === "1")

  const filteredServices = providerServices.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddService = () => {
    navigation.navigate("AddService" as never)
  }

  const handleEditService = (serviceId: string) => {
    navigation.navigate("AddService" as never, { serviceId, mode: "edit" } as never)
    setVisibleMenu(null)
  }

  const handleDeleteService = (serviceId: string) => {
    Alert.alert("Eliminar servicio", "¿Estás seguro que deseas eliminar este servicio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          dispatch(deleteService(serviceId))
          setVisibleMenu(null)
        },
      },
    ])
  }

  const handleToggleStatus = (serviceId: string) => {
    // Toggle service active/inactive status
    setVisibleMenu(null)
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? theme.colors.success : theme.colors.disabled
  }

  const renderServiceItem = ({ item }: { item: any }) => (
    <Card style={styles.serviceCard}>
      <Card.Cover source={{ uri: item.image }} style={styles.serviceImage} />
      <Card.Content style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceTitleContainer}>
            <Title style={styles.serviceTitle} numberOfLines={2}>
              {item.title}
            </Title>
            <View style={styles.serviceChips}>
              <Chip style={styles.categoryChip} textStyle={styles.chipText}>
                {item.category.name}
              </Chip>
              <Chip
                style={[styles.statusChip, { backgroundColor: getStatusColor(true) }]}
                textStyle={styles.statusChipText}
              >
                Activo
              </Chip>
            </View>
          </View>

          <Menu
            visible={visibleMenu === item.id}
            onDismiss={() => setVisibleMenu(null)}
            anchor={<IconButton icon="dots-vertical" onPress={() => setVisibleMenu(item.id)} />}
          >
            <Menu.Item onPress={() => handleEditService(item.id)} title="Editar" leadingIcon="pencil" />
            <Menu.Item onPress={() => handleToggleStatus(item.id)} title="Pausar" leadingIcon="pause" />
            <Menu.Item onPress={() => handleDeleteService(item.id)} title="Eliminar" leadingIcon="delete" />
          </Menu>
        </View>

        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.serviceFooter}>
          <Text style={styles.servicePrice}>${item.price}</Text>
          <View style={styles.serviceStats}>
            <Text style={styles.statText}>★ {item.rating}</Text>
            <Text style={styles.statText}>• 12 reservas</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Mis Servicios</Title>
        <Text style={styles.headerSubtitle}>{filteredServices.length} servicios</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar mis servicios..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={renderServiceItem}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No tienes servicios aún</Text>
            <Text style={styles.emptyText}>Agrega tu primer servicio para comenzar a recibir solicitudes</Text>
            <Button mode="contained" style={styles.emptyButton} onPress={handleAddService}>
              Agregar servicio
            </Button>
          </View>
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={handleAddService} label="Agregar servicio" />
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
  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  serviceCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  serviceImage: {
    height: 120,
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  serviceTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  serviceChips: {
    flexDirection: "row",
    gap: 8,
  },
  categoryChip: {
    backgroundColor: theme.colors.primary,
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: "white",
  },
  statusChipText: {
    fontSize: 10,
    color: "white",
  },
  serviceDescription: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  serviceStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 12,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
})
