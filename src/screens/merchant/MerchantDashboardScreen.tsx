import { View, StyleSheet } from "react-native"
import { Text, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"

export default function MerchantDashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Panel de Comerciante</Title>
      <Text style={styles.text}>Bienvenido a tu dashboard de comercios.</Text>
      <Text style={styles.text}>Aquí verás estadísticas y accesos rápidos.</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, color: theme.colors.text, marginBottom: 8 },
}) 