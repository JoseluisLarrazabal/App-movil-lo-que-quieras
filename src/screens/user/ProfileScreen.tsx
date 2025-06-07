"use client"

import { useContext, useState } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Avatar, Button, Card, Title, List, Divider, Switch, Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { AuthContext } from "../../context/AuthContext"
import { theme } from "../../theme"

export default function ProfileScreen() {
  const { currentUser, signOut } = useContext(AuthContext)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: signOut },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Image size={80} source={{ uri: currentUser?.avatar }} />
            <View style={styles.profileInfo}>
              <Title style={styles.profileName}>{currentUser?.name}</Title>
              <Text style={styles.profileEmail}>{currentUser?.email}</Text>
              <Text style={styles.profileRole}>
                {currentUser?.role === "user"
                  ? "Usuario"
                  : currentUser?.role === "provider"
                    ? "Proveedor"
                    : "Administrador"}
              </Text>
            </View>
            <Button mode="outlined" style={styles.editButton}>
              Editar
            </Button>
          </Card.Content>
        </Card>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.statsTitle}>Estadísticas</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Servicios contratados</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Calificación promedio</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>$2,450</Text>
                <Text style={styles.statLabel}>Total gastado</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Menu Options */}
        <Card style={styles.menuCard}>
          <Card.Content>
            <List.Item
              title="Mis reservas"
              description="Ver historial de servicios"
              left={(props) => <List.Icon {...props} icon="calendar" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Métodos de pago"
              description="Gestionar tarjetas y pagos"
              left={(props) => <List.Icon {...props} icon="credit-card" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Direcciones"
              description="Gestionar direcciones guardadas"
              left={(props) => <List.Icon {...props} icon="map-marker" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Favoritos"
              description="Servicios y proveedores favoritos"
              left={(props) => <List.Icon {...props} icon="heart" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title style={styles.settingsTitle}>Configuración</Title>
            <List.Item
              title="Notificaciones"
              description="Recibir alertas de nuevos servicios"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />}
            />
            <Divider />
            <List.Item
              title="Ubicación"
              description="Permitir acceso a ubicación"
              left={(props) => <List.Icon {...props} icon="map" />}
              right={() => <Switch value={locationEnabled} onValueChange={setLocationEnabled} />}
            />
            <Divider />
            <List.Item
              title="Privacidad"
              description="Configurar privacidad de datos"
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Ayuda y soporte"
              description="Centro de ayuda y contacto"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        {/* Sign Out Button */}
        <Button
          mode="outlined"
          style={styles.signOutButton}
          contentStyle={styles.signOutContent}
          labelStyle={styles.signOutLabel}
          onPress={handleSignOut}
        >
          Cerrar sesión
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    margin: 16,
    borderRadius: 16,
  },
  profileContent: {
    alignItems: "center",
    padding: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginVertical: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  editButton: {
    borderColor: theme.colors.primary,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    textAlign: "center",
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  signOutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderColor: theme.colors.error,
    borderRadius: 12,
  },
  signOutContent: {
    height: 48,
  },
  signOutLabel: {
    color: theme.colors.error,
    fontWeight: "bold",
  },
})
