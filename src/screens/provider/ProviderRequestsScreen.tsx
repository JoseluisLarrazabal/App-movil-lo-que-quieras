"use client"

import { useState } from "react"
import { StyleSheet, View, FlatList } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { Text, Card, Avatar, Button, Chip, SegmentedButtons, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState } from "../../redux/store"
import { updateBookingStatus } from "../../redux/slices/bookingsSlice"
import { theme } from "../../theme"

export default function ProviderRequestsScreen() {
  const dispatch = useDispatch()
  const { providerBookings } = useSelector((state: RootState) => state.bookings)
  const [selectedTab, setSelectedTab] = useState("pending")

  // Mock requests data
  const [requests] = useState([
    {
      id: "1",
      customer: {
        name: "María García",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 4.8,
      },
      service: {
        title: "Limpieza profunda de hogar",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      },
      date: "2024-01-15",
      time: "14:00",
      status: "pending",
      price: 850,
      notes: "Apartamento de 2 habitaciones, necesito limpieza profunda",
      location: "Palermo, Buenos Aires",
      requestedAt: "Hace 2 horas",
    },
    {
      id: "2",
      customer: {
        name: "Juan Pérez",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4.6,
      },
      service: {
        title: "Limpieza profunda de hogar",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      },
      date: "2024-01-18",
      time: "10:00",
      status: "confirmed",
      price: 850,
      notes: "Casa de 3 habitaciones",
      location: "Villa Crespo, Buenos Aires",
      requestedAt: "Hace 1 día",
    },
  ])

  const filteredRequests = requests.filter((request) => {
    if (selectedTab === "all") return true
    return request.status === selectedTab
  })

  const handleAcceptRequest = (requestId: string) => {
    dispatch(updateBookingStatus({ id: requestId, status: "confirmed" }))
    // Update local state or refetch data
  }

  const handleRejectRequest = (requestId: string) => {
    dispatch(updateBookingStatus({ id: requestId, status: "cancelled" }))
    // Update local state or refetch data
  }

  const handleCompleteService = (requestId: string) => {
    dispatch(updateBookingStatus({ id: requestId, status: "completed" }))
    // Update local state or refetch data
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return theme.colors.warning
      case "confirmed":
        return theme.colors.success
      case "completed":
        return theme.colors.primary
      case "cancelled":
        return theme.colors.error
      default:
        return theme.colors.placeholder
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "confirmed":
        return "Confirmado"
      case "completed":
        return "Completado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const renderRequestItem = ({ item }: { item: any }) => (
    <Card style={styles.requestCard}>
      <Card.Content>
        <View style={styles.requestHeader}>
          <Avatar.Image size={50} source={{ uri: item.customer.avatar }} />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customer.name}</Text>
            <Text style={styles.customerRating}>
              ★ {item.customer.rating} • {item.requestedAt}
            </Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.statusText}
          >
            {getStatusText(item.status)}
          </Chip>
        </View>

        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{item.service.title}</Text>
          <Text style={styles.serviceDate}>
            {item.date} • {item.time}
          </Text>
          <Text style={styles.servicePrice}>${item.price}</Text>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notas del cliente:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        <View style={styles.requestActions}>
          {item.status === "pending" && (
            <>
              <Button
                mode="outlined"
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleRejectRequest(item.id)}
              >
                Rechazar
              </Button>
              <Button mode="contained" style={styles.actionButton} onPress={() => handleAcceptRequest(item.id)}>
                Aceptar
              </Button>
            </>
          )}

          {item.status === "confirmed" && (
            <>
              <Button mode="outlined" style={styles.actionButton} onPress={() => {}}>
                Contactar
              </Button>
              <Button mode="contained" style={styles.actionButton} onPress={() => handleCompleteService(item.id)}>
                Marcar completado
              </Button>
            </>
          )}

          {item.status === "completed" && (
            <Button mode="text" style={styles.actionButton} onPress={() => {}}>
              Ver detalles
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Solicitudes</Title>
        <Text style={styles.headerSubtitle}>{filteredRequests.length} solicitudes</Text>
      </View>

      <View style={styles.tabsContainer}>
        <SegmentedButtons
          value={selectedTab}
          onValueChange={setSelectedTab}
          buttons={[
            { value: "all", label: "Todas" },
            { value: "pending", label: "Pendientes" },
            { value: "confirmed", label: "Confirmadas" },
            { value: "completed", label: "Completadas" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
        contentContainerStyle={styles.requestsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No hay solicitudes</Text>
            <Text style={styles.emptyText}>Las nuevas solicitudes aparecerán aquí</Text>
          </View>
        }
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
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.surface,
  },
  requestsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  requestCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  customerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  customerRating: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  serviceInfo: {
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  serviceDate: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  notesContainer: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    lineHeight: 20,
  },
  requestActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
  rejectButton: {
    borderColor: theme.colors.error,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
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
})
