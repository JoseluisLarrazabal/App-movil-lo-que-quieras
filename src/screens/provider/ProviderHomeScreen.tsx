import { StyleSheet, View, ScrollView } from "react-native"
import { Text, Card, Title, Paragraph, Button } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../navigation/types"
import { theme } from "../../theme"

type ProviderHomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function ProviderHomeScreen() {
  const navigation = useNavigation<ProviderHomeScreenNavigationProp>()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.title}>Panel de Control</Title>
          <Text style={styles.subtitle}>Bienvenido a tu espacio profesional</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsNumber}>12</Text>
              <Text style={styles.statsLabel}>Reservas activas</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsNumber}>4.8</Text>
              <Text style={styles.statsLabel}>Rating promedio</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Acciones rápidas</Title>
            <View style={styles.actionsContainer}>
              <Button
                mode="contained"
                icon="plus"
                onPress={() => navigation.navigate("AddService", { mode: "add" })}
                style={styles.actionButton}
              >
                Nuevo servicio
              </Button>
              <Button
                mode="outlined"
                icon="calendar"
                onPress={() => navigation.navigate("ProviderBookings")}
                style={styles.actionButton}
              >
                Ver reservas
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Actividad reciente</Title>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Nueva reserva de Juan Pérez</Text>
              <Text style={styles.activityTime}>Hace 2 horas</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Actualización de perfil completada</Text>
              <Text style={styles.activityTime}>Hace 1 día</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: theme.colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  statsCard: {
    flex: 1,
    borderRadius: 12,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  actionsCard: {
    margin: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
  activityCard: {
    margin: 16,
    borderRadius: 12,
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.disabled,
  },
  activityText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
}) 