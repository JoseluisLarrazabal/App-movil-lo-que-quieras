import { View, StyleSheet, Alert } from "react-native"
import { Text, Title, Button } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

export default function MerchantProfileScreen() {
  const { signOut } = useContext(AuthContext)

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: signOut },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Perfil de Comerciante</Title>
      <Text style={styles.text}>Aquí podrás ver y editar tu perfil.</Text>
      <Button
        mode="outlined"
        style={styles.logoutButton}
        onPress={handleSignOut}
        icon="logout"
      >
        Cerrar sesión
      </Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, color: theme.colors.text, marginBottom: 8 },
  logoutButton: { marginTop: 32, borderRadius: 12, borderColor: theme.colors.error }
}) 