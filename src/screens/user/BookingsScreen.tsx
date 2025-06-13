"use client"

import React from "react"
import { useState } from "react"
import { StyleSheet, View, FlatList } from "react-native"
import { useSelector } from "react-redux"
import { Text, Card, Avatar, Button, Chip, SegmentedButtons, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState } from "../../redux/store"
import { theme } from "../../theme"

export default function BookingsScreen() {
  const { userBookings } = useSelector((state: RootState) => state.bookings)
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredBookings = userBookings.filter((booking) => {
    if (selectedTab === "all") return true
    return booking.status === selectedTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return theme.colors.success
      case "pending":
        return theme.colors.warning
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
      case "confirmed":
        return "Confirmado"
      case "pending":
        return "Pendiente"
      case "completed":
        return "Completado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const renderBookingItem = ({ item }: { item: any }) => (
    <Card style={styles.bookingCard}>
      <Card.Content>
        <View style={styles.bookingHeader}>
          <Avatar.Image size={50} source={{ uri: item.provider.avatar }} />
          <View style={styles.bookingInfo}>
            <Text style={styles.serviceTitle}>{item.service.title}</Text>
            <Text style={styles.providerName}>{item.provider.name}</Text>
            <Text style={styles.bookingDate}>
              {item.date} • {item.time}
            </Text>
          </View>
          <View style={styles.bookingRight}>
            <Text style={styles.bookingPrice}>${item.price}</Text>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={styles.statusText}
            >
              {getStatusText(item.status)}
            </Chip>
          </View>
        </View>

        {item.notes && <Text style={styles.bookingNotes}>Notas: {item.notes}</Text>}

        <View style={styles.bookingActions}>
          {item.status === "confirmed" && (
            <>
              <Button mode="outlined" style={styles.actionButton}>
                Contactar
              </Button>
              <Button mode="contained" style={styles.actionButton}>
                Ver detalles
              </Button>
            </>
          )}
          {item.status === "completed" && (
            <Button mode="contained" style={styles.actionButton}>
              Calificar
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Mis Reservas</Title>
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
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.bookingsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes reservas en esta categoría</Text>
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
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.surface,
  },
  bookingsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bookingCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  bookingHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  bookingRight: {
    alignItems: "flex-end",
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 8,
  },
  statusChip: {
    height: 24,
  },
  statusText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  bookingNotes: {
    fontSize: 12,
    color: theme.colors.placeholder,
    fontStyle: "italic",
    marginBottom: 12,
  },
  bookingActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
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
