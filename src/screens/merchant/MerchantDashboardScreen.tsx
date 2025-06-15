import { View, StyleSheet, ScrollView, Dimensions } from "react-native"
import { Text, Title, Card, Button, List, Divider } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"
import { useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'
import { LineChart, BarChart } from 'react-native-chart-kit'

const screenWidth = Dimensions.get('window').width

export default function MerchantDashboardScreen() {
  const { items: stores } = useSelector((state: RootState) => state.localStores)
  // Mock stats
  const totalStores = stores.length
  const totalVisits = 120 + totalStores * 10
  const totalSales = 15 + totalStores * 2
  const totalRevenue = 2500 + totalStores * 200
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }
  const salesData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      { data: [2, 4, 6, 8, 10, totalSales], color: (o=1)=>`rgba(16,185,129,${o})`, strokeWidth: 2 }
    ],
    legend: ['Ventas mensuales']
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Title style={styles.title}>Panel de Comerciante</Title>
          <Text style={styles.subtitle}>Resumen de tu actividad comercial</Text>
        </View>
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}><Card.Content><Text style={styles.statLabel}>Comercios</Text><Text style={styles.statValue}>{totalStores}</Text></Card.Content></Card>
          <Card style={styles.statCard}><Card.Content><Text style={styles.statLabel}>Visitas</Text><Text style={styles.statValue}>{totalVisits}</Text></Card.Content></Card>
          <Card style={styles.statCard}><Card.Content><Text style={styles.statLabel}>Ventas</Text><Text style={styles.statValue}>{totalSales}</Text></Card.Content></Card>
          <Card style={styles.statCard}><Card.Content><Text style={styles.statLabel}>Ingresos</Text><Text style={styles.statValue}>${totalRevenue}</Text></Card.Content></Card>
        </View>
        {/* Sales Chart */}
        <Card style={styles.chartCard}><Card.Content><Title>Ventas mensuales</Title><BarChart data={{ labels: salesData.labels, datasets: [{ data: salesData.datasets[0].data }] }} width={screenWidth-64} height={220} chartConfig={chartConfig} style={styles.chart} yAxisLabel="" yAxisSuffix="" /></Card.Content></Card>
        {/* Recent Activity */}
        <Card style={styles.activityCard}><Card.Content><Title style={styles.sectionTitle}>Actividad reciente</Title><List.Item title="Nueva venta realizada" description="Venta #1234 completada" left={props => <List.Icon {...props} icon="cash" color={theme.colors.success} />} right={() => <Text style={styles.activityTime}>Hace 2 horas</Text>} /><Divider /><List.Item title="Comercio editado" description="Supermercado Central actualizado" left={props => <List.Icon {...props} icon="pencil" color={theme.colors.primary} />} right={() => <Text style={styles.activityTime}>Hace 1 día</Text>} /><Divider /><List.Item title="Nuevo comercio agregado" description="Tienda de Barrio La Paz" left={props => <List.Icon {...props} icon="storefront" color={theme.colors.secondary} />} right={() => <Text style={styles.activityTime}>Hace 3 días</Text>} /></Card.Content></Card>
        {/* Reviews Placeholder */}
        <Card style={styles.reviewsCard}><Card.Content><Title style={styles.sectionTitle}>Reseñas de usuarios</Title><Text style={styles.reviewText}>Próximamente: aquí aparecerán las reseñas y comentarios de tus comercios.</Text></Card.Content></Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flexGrow: 1 },
  header: { padding: 24, backgroundColor: theme.colors.primary },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 16 },
  statCard: { flex: 1, margin: 8, borderRadius: 12, minWidth: 120 },
  statLabel: { fontSize: 13, color: theme.colors.placeholder, textAlign: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center' },
  chartCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 12 },
  chart: { marginVertical: 8, borderRadius: 16 },
  activityCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  activityTime: { fontSize: 12, color: theme.colors.placeholder },
  reviewsCard: { margin: 16, borderRadius: 12 },
  reviewText: { fontSize: 14, color: theme.colors.placeholder },
}) 