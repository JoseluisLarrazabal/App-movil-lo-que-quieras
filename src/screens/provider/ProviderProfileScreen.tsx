"use client"

import { useContext, useState } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Avatar, Button, Card, Title, List, Divider, Switch, Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { AuthContext } from "../../context/AuthContext"
import { theme } from "../../theme"

export default function ProviderProfileScreen() {
  const { currentUser, signOut } = useContext(AuthContext)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: signOut },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Avatar.Image
            size={100}
            source={{ uri: currentUser?.avatar || "https://via.placeholder.com/100" }}
            style={styles.avatar}
          />
          <Title style={styles.name}>{currentUser?.name}</Title>
          <Text style={styles.role}>Proveedor de servicios</Text>
        </View>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Servicios</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Reservas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Configuración</Title>
            
            <List.Item
              title="Disponibilidad"
              description="Activar/desactivar para recibir reservas"
              left={props => <List.Icon {...props} icon="clock-outline" />}
              right={() => (
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  color={theme.colors.primary}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Notificaciones"
              description="Recibir alertas de nuevas reservas"
              left={props => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={theme.colors.primary}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Ubicación"
              description="Compartir ubicación con clientes"
              left={props => <List.Icon {...props} icon="map-marker-outline" />}
              right={() => (
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  color={theme.colors.primary}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Account Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Cuenta</Title>
            <List.Item
              title="Editar perfil"
              left={props => <List.Icon {...props} icon="account-edit" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Cambiar contraseña"
              left={props => <List.Icon {...props} icon="lock" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Cerrar sesión"
              left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
              onPress={handleSignOut}
              titleStyle={{ color: theme.colors.error }}
            />
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
    alignItems: "center",
    padding: 24,
    backgroundColor: theme.colors.primary,
  },
  avatar: {
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "white",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statsCard: {
    margin: 16,
    borderRadius: 12,
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.disabled,
  },
  settingsCard: {
    margin: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  actionsCard: {
    margin: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
})
