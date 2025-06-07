"use client"

import { useState } from "react"
import { StyleSheet, View, ScrollView, Dimensions } from "react-native"
import { Text, Card, Title, Button, List, Divider } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { LineChart, PieChart, BarChart } from "react-native-chart-kit"
import { theme } from "../../theme"

const screenWidth = Dimensions.get("window").width

export default function AdminDashboardScreen() {
  const [stats] = useState({
    totalUsers: 1247,
    totalProviders: 89,
    totalServices: 342,
    totalBookings: 1856,
    monthlyRevenue: 45600,
    activeUsers: 892,
  })

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }

  const userGrowthData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [120, 180, 250, 320, 410, 480],
        color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Nuevos usuarios"],
  }

  const categoryData = [
    {
      name: "Limpieza",
      population: 35,
      color: "rgba(124, 58, 237, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Plomería",
      population: 25,
      color: "rgba(147, 51, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Electricidad",
      population: 20,
      color: "rgba(168, 85, 247, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Otros",
      population: 20,
      color: "rgba(196, 181, 253, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ]

  const revenueData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [12000, 19000, 30000, 28000, 42000, 45600],
      },
    ],
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Panel de Administración</Title>
          <Text style={styles.headerSubtitle}>Resumen general de la plataforma</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Total Usuarios</Text>
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statChange}>+12% este mes</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Proveedores</Text>
              <Text style={styles.statValue}>{stats.totalProviders}</Text>
              <Text style={styles.statChange}>+8% este mes</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Servicios</Text>
              <Text style={styles.statValue}>{stats.totalServices}</Text>
              <Text style={styles.statChange}>+15% este mes</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Reservas</Text>
              <Text style={styles.statValue}>{stats.totalBookings}</Text>
              <Text style={styles.statChange}>+22% este mes</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Revenue Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Ingresos mensuales</Title>
            <Text style={styles.chartSubtitle}>Comisiones de la plataforma</Text>
            <BarChart
              data={revenueData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel="$"
              yAxisSuffix=""
            />
          </Card.Content>
        </Card>

        {/* User Growth Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Crecimiento de usuarios</Title>
            <LineChart
              data={userGrowthData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Category Distribution */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Distribución por categorías</Title>
            <PieChart
              data={categoryData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <Title style={styles.activityTitle}>Actividad reciente</Title>

            <List.Item
              title="Nuevo proveedor registrado"
              description="Juan Pérez se registró como electricista"
              left={(props) => <List.Icon {...props} icon="account-plus" color={theme.colors.success} />}
              right={() => <Text style={styles.activityTime}>Hace 2 horas</Text>}
            />
            <Divider />

            <List.Item
              title="Servicio reportado"
              description="Reporte de calidad en servicio #1234"
              left={(props) => <List.Icon {...props} icon="alert-circle" color={theme.colors.warning} />}
              right={() => <Text style={styles.activityTime}>Hace 4 horas</Text>}
            />
            <Divider />

            <List.Item
              title="Nueva categoría agregada"
              description="Categoría 'Jardinería' fue creada"
              left={(props) => <List.Icon {...props} icon="plus-circle" color={theme.colors.primary} />}
              right={() => <Text style={styles.activityTime}>Hace 1 día</Text>}
            />
            <Divider />

            <List.Item
              title="Pago procesado"
              description="Comisión de $125 procesada"
              left={(props) => <List.Icon {...props} icon="cash" color={theme.colors.success} />}
              right={() => <Text style={styles.activityTime}>Hace 2 días</Text>}
            />

            <Button mode="text" style={styles.seeAllActivity}>
              Ver toda la actividad
            </Button>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.actionsTitle}>Acciones rápidas</Title>
            <View style={styles.actionsContainer}>
              <Button mode="contained" style={styles.actionButton} icon="account-plus">
                Agregar admin
              </Button>
              <Button mode="outlined" style={styles.actionButton} icon="file-export">
                Exportar datos
              </Button>
            </View>
            <View style={styles.actionsContainer}>
              <Button mode="outlined" style={styles.actionButton} icon="cog">
                Configuración
              </Button>
              <Button mode="outlined" style={styles.actionButton} icon="backup-restore">
                Respaldo
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
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 4,
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
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  statChange: {
    fontSize: 10,
    color: theme.colors.success,
    fontWeight: "600",
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  chartSubtitle: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  activityCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  seeAllActivity: {
    alignSelf: "center",
    marginTop: 8,
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
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
})
