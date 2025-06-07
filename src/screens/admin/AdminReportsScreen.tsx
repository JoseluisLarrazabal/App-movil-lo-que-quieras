"use client"

import { useState } from "react"
import { StyleSheet, View, ScrollView, Dimensions } from "react-native"
import { Text, Card, Title, Button, SegmentedButtons, List, Divider } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { theme } from "../../theme"

const screenWidth = Dimensions.get("window").width

export default function AdminReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("revenue")

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }

  // Revenue data
  const revenueData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [12000, 19000, 30000, 28000, 42000, 45600],
        color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Ingresos por comisiones"],
  }

  // User growth data
  const userGrowthData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [120, 180, 250, 320, 410, 480],
      },
    ],
  }

  // Bookings data
  const bookingsData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [85, 142, 198, 245, 312, 378],
      },
    ],
  }

  // Category performance
  const categoryPerformanceData = [
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

  const renderChart = () => {
    switch (selectedReport) {
      case "revenue":
        return (
          <LineChart
            data={revenueData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            yAxisLabel="$"
          />
        )
      case "users":
        return (
          <BarChart
            data={userGrowthData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
          />
        )
      case "bookings":
        return (
          <LineChart
            data={bookingsData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        )
      case "categories":
        return (
          <PieChart
            data={categoryPerformanceData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )
      default:
        return null
    }
  }

  const getReportTitle = () => {
    switch (selectedReport) {
      case "revenue":
        return "Ingresos por comisiones"
      case "users":
        return "Crecimiento de usuarios"
      case "bookings":
        return "Reservas realizadas"
      case "categories":
        return "Rendimiento por categorías"
      default:
        return "Reporte"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Reportes y Análisis</Title>
          <Text style={styles.headerSubtitle}>Métricas de rendimiento de la plataforma</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <SegmentedButtons
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            buttons={[
              { value: "week", label: "Semana" },
              { value: "month", label: "Mes" },
              { value: "quarter", label: "Trimestre" },
              { value: "year", label: "Año" },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Report Type Selector */}
        <View style={styles.reportContainer}>
          <SegmentedButtons
            value={selectedReport}
            onValueChange={setSelectedReport}
            buttons={[
              { value: "revenue", label: "Ingresos" },
              { value: "users", label: "Usuarios" },
              { value: "bookings", label: "Reservas" },
              { value: "categories", label: "Categorías" },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Main Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Title>{getReportTitle()}</Title>
              <Button mode="outlined" icon="download" onPress={() => {}}>
                Exportar
              </Button>
            </View>
            {renderChart()}
          </Card.Content>
        </Card>

        {/* Key Metrics */}
        <Card style={styles.metricsCard}>
          <Card.Content>
            <Title style={styles.metricsTitle}>Métricas clave</Title>
            <View style={styles.metricsContainer}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>$45,600</Text>
                <Text style={styles.metricLabel}>Ingresos este mes</Text>
                <Text style={styles.metricChange}>+22% vs mes anterior</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>1,247</Text>
                <Text style={styles.metricLabel}>Usuarios activos</Text>
                <Text style={styles.metricChange}>+12% vs mes anterior</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>378</Text>
                <Text style={styles.metricLabel}>Reservas completadas</Text>
                <Text style={styles.metricChange}>+18% vs mes anterior</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>4.8</Text>
                <Text style={styles.metricLabel}>Calificación promedio</Text>
                <Text style={styles.metricChange}>+0.2 vs mes anterior</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Top Performers */}
        <Card style={styles.performersCard}>
          <Card.Content>
            <Title style={styles.performersTitle}>Mejores proveedores</Title>

            <List.Item
              title="María García"
              description="Limpieza • $2,450 ganados • 4.9★"
              left={(props) => <List.Icon {...props} icon="trophy" color="#FFD700" />}
              right={() => <Text style={styles.rankText}>#1</Text>}
            />
            <Divider />

            <List.Item
              title="Juan Pérez"
              description="Plomería • $1,890 ganados • 4.8★"
              left={(props) => <List.Icon {...props} icon="trophy" color="#C0C0C0" />}
              right={() => <Text style={styles.rankText}>#2</Text>}
            />
            <Divider />

            <List.Item
              title="Carlos López"
              description="Electricidad • $1,650 ganados • 4.7★"
              left={(props) => <List.Icon {...props} icon="trophy" color="#CD7F32" />}
              right={() => <Text style={styles.rankText}>#3</Text>}
            />

            <Button mode="text" style={styles.seeAllButton}>
              Ver todos los proveedores
            </Button>
          </Card.Content>
        </Card>

        {/* Export Options */}
        <Card style={styles.exportCard}>
          <Card.Content>
            <Title style={styles.exportTitle}>Exportar reportes</Title>
            <Text style={styles.exportSubtitle}>Descarga reportes detallados en diferentes formatos</Text>

            <View style={styles.exportButtons}>
              <Button mode="outlined" style={styles.exportButton} icon="file-pdf-box">
                PDF
              </Button>
              <Button mode="outlined" style={styles.exportButton} icon="file-excel">
                Excel
              </Button>
              <Button mode="outlined" style={styles.exportButton} icon="file-chart">
                CSV
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
  periodContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  reportContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.surface,
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  metricsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricItem: {
    width: "48%",
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.text,
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 10,
    color: theme.colors.success,
    fontWeight: "600",
  },
  performersCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  performersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  seeAllButton: {
    alignSelf: "center",
    marginTop: 8,
  },
  exportCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  exportSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 16,
  },
  exportButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  exportButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
})
