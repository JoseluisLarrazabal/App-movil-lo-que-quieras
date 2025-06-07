"use client"

import { useState } from "react"
import { StyleSheet, View, ScrollView, Dimensions } from "react-native"
import { Text, Card, Title, Button, Avatar, List, Divider } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { LineChart } from "react-native-chart-kit"
import { theme } from "../../theme"

const screenWidth = Dimensions.get("window").width

export default function ProviderDashboardScreen() {
  const [stats] = useState({
    totalEarnings: 12500,
    completedJobs: 48,
    averageRating: 4.8,
    pendingRequests: 3,
  })

  const [recentBookings] = useState([
    {
      id: "1",
      customer: {
        name: "María García",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      service: "Limpieza de hogar",
      date: "25 Jun, 2024",
      time: "14:00 - 16:00",
      status: "completed",
      amount: 850,
    },
    {
      id: "2",
      customer: {
        name: "Juan Pérez",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      service: "Limpieza de hogar",
      date: "27 Jun, 2024",
      time: "10:00 - 12:00",
      status: "upcoming",
      amount: 850,
    },
  ])

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }

  const earningsData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [1200, 1900, 3000, 2800, 4200, 5000],
        color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Ganancias Mensuales"],
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Panel de Control</Title>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Ganancias totales</Text>
              <Text style={styles.statValue}>${stats.totalEarnings}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Trabajos completados</Text>
              <Text style={styles.statValue}>{stats.completedJobs}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Calificación</Text>
              <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Solicitudes</Text>
              <Text style={styles.statValue}>{stats.pendingRequests}</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Earnings Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Ganancias mensuales</Title>
            <LineChart
              data={earningsData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Recent Bookings */}
        <Card style={styles.bookingsCard}>
          <Card.Content>
            <View style={styles.bookingsHeader}>
              <Title>Reservas recientes</Title>
              <Button mode="text">Ver todas</Button>
            </View>

            {recentBookings.map((booking) => (
              <View key={booking.id}>
                <List.Item
                  title={booking.customer.name}
                  description={`${booking.service} • ${booking.date} • ${booking.time}`}
                  left={() => <Avatar.Image size={40} source={{ uri: booking.customer.avatar }} />}
                  right={() => (
                    <View style={styles.bookingRight}>
                      <Text style={styles.bookingAmount}>${booking.amount}</Text>
                      <Text
                        style={[
                          styles.bookingStatus,
                          booking.status === "completed" ? styles.completedStatus : styles.upcomingStatus,
                        ]}
                      >
                        {booking.status === "completed" ? "Completado" : "Próximo"}
                      </Text>
                    </View>
                  )}
                  style={styles.bookingItem}
                />
                <Divider />
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.actionsTitle}>Acciones rápidas</Title>
            <View style={styles.actionsContainer}>
              <Button mode="contained" style={styles.actionButton}>
                Agregar servicio
              </Button>
              <Button mode="outlined" style={styles.actionButton}>
                Ver solicitudes
              </Button>
            </View>
          </Card.Content>
        </Card>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    marginBottom: 8,
    marginRight: "2%",
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  bookingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  bookingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookingItem: {
    paddingVertical: 8,
  },
  bookingRight: {
    alignItems: "flex-end",
  },
  bookingAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  bookingStatus: {
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedStatus: {
    backgroundColor: theme.colors.success,
    color: "white",
  },
  upcomingStatus: {
    backgroundColor: theme.colors.primary,
    color: "white",
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
})
