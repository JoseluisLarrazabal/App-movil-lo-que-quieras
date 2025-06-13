import { useState } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Card, Title, Button, Chip, Text, SegmentedButtons } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"

interface Booking {
  id: string
  clientName: string
  serviceName: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  price: number
}

export default function ProviderBookingsScreen() {
  const [selectedStatus, setSelectedStatus] = useState("pending")

  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      clientName: "María García",
      serviceName: "Corte de cabello",
      date: "2024-03-20",
      time: "14:30",
      status: "pending",
      price: 25,
    },
    {
      id: "2",
      clientName: "Juan Pérez",
      serviceName: "Manicure",
      date: "2024-03-20",
      time: "16:00",
      status: "confirmed",
      price: 35,
    },
    {
      id: "3",
      clientName: "Ana López",
      serviceName: "Corte de cabello",
      date: "2024-03-19",
      time: "10:00",
      status: "completed",
      price: 25,
    },
  ])

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return theme.colors.warning
      case "confirmed":
        return theme.colors.primary
      case "completed":
        return theme.colors.success
      case "cancelled":
        return theme.colors.error
      default:
        return theme.colors.placeholder
    }
  }

  const getStatusText = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "confirmed":
        return "Confirmada"
      case "completed":
        return "Completada"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  const handleConfirmBooking = (id: string) => {
    Alert.alert("Confirmar reserva", "¿Deseas confirmar esta reserva?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: () => {
          // Aquí iría la lógica para confirmar la reserva
          Alert.alert("Éxito", "Reserva confirmada correctamente")
        },
      },
    ])
  }

  const handleCancelBooking = (id: string) => {
    Alert.alert("Cancelar reserva", "¿Estás seguro que deseas cancelar esta reserva?", [
      { text: "No", style: "cancel" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: () => {
          // Aquí iría la lógica para cancelar la reserva
          Alert.alert("Éxito", "Reserva cancelada correctamente")
        },
      },
    ])
  }

  const filteredBookings = bookings.filter(booking => booking.status === selectedStatus)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mis Reservas</Title>
        <Text style={styles.subtitle}>Gestiona tus reservas pendientes y confirmadas</Text>
      </View>

      <SegmentedButtons
        value={selectedStatus}
        onValueChange={setSelectedStatus}
        buttons={[
          { value: "pending", label: "Pendientes" },
          { value: "confirmed", label: "Confirmadas" },
          { value: "completed", label: "Completadas" },
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView style={styles.scrollView}>
        {filteredBookings.map(booking => (
          <Card key={booking.id} style={styles.bookingCard}>
            <Card.Content>
              <View style={styles.bookingHeader}>
                <Title style={styles.clientName}>{booking.clientName}</Title>
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(booking.status) }]}
                  textStyle={styles.statusChipText}
                >
                  {getStatusText(booking.status)}
                </Chip>
              </View>

              <Text style={styles.serviceName}>{booking.serviceName}</Text>

              <View style={styles.bookingDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Fecha</Text>
                  <Text style={styles.detailValue}>{booking.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Hora</Text>
                  <Text style={styles.detailValue}>{booking.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Precio</Text>
                  <Text style={styles.detailValue}>${booking.price}</Text>
                </View>
              </View>
            </Card.Content>

            {booking.status === "pending" && (
              <Card.Actions>
                <Button onPress={() => handleConfirmBooking(booking.id)}>Confirmar</Button>
                <Button onPress={() => handleCancelBooking(booking.id)} textColor={theme.colors.error}>
                  Cancelar
                </Button>
              </Card.Actions>
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  segmentedButtons: {
    margin: 16,
  },
  scrollView: {
    flex: 1,
  },
  bookingCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusChip: {
    height: 24,
  },
  statusChipText: {
    fontSize: 12,
    color: "white",
  },
  serviceName: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  bookingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
}) 