"use client"

import { useState, useContext } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Text, Avatar, Button, Card, Title, List, Divider, Switch, TextInput, Portal, Modal } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { AuthContext } from "../../context/AuthContext"
import { theme } from "../../theme"

export default function ProviderProfileScreen() {
  const { currentUser, signOut, updateProfile } = useContext(AuthContext)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [availabilityEnabled, setAvailabilityEnabled] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState(currentUser?.name || "")
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "")
  const [editLocation, setEditLocation] = useState(currentUser?.location || "")

  // Mock provider stats
  const [stats] = useState({
    totalEarnings: 12500,
    completedJobs: 48,
    averageRating: 4.8,
    responseTime: "< 1 hora",
    memberSince: "2022",
  })

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: signOut },
    ])
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: editName,
        phone: editPhone,
        location: editLocation,
      })
      setShowEditModal(false)
      Alert.alert("Éxito", "Perfil actualizado correctamente")
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil")
    }
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
              <Text style={styles.profileRole}>Proveedor de servicios</Text>
            </View>
            <Button mode="outlined" style={styles.editButton} onPress={() => setShowEditModal(true)}>
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
                <Text style={styles.statNumber}>${stats.totalEarnings}</Text>
                <Text style={styles.statLabel}>Ganancias totales</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.completedJobs}</Text>
                <Text style={styles.statLabel}>Trabajos completados</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.averageRating}</Text>
                <Text style={styles.statLabel}>Calificación promedio</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Business Info */}
        <Card style={styles.businessCard}>
          <Card.Content>
            <Title style={styles.businessTitle}>Información del negocio</Title>
            <List.Item
              title="Tiempo de respuesta"
              description={stats.responseTime}
              left={(props) => <List.Icon {...props} icon="clock" />}
            />
            <Divider />
            <List.Item
              title="Miembro desde"
              description={stats.memberSince}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
            <Divider />
            <List.Item
              title="Verificación"
              description="Cuenta verificada"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
            />
          </Card.Content>
        </Card>

        {/* Menu Options */}
        <Card style={styles.menuCard}>
          <Card.Content>
            <List.Item
              title="Mis servicios"
              description="Gestionar servicios ofrecidos"
              left={(props) => <List.Icon {...props} icon="briefcase" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Horarios de trabajo"
              description="Configurar disponibilidad"
              left={(props) => <List.Icon {...props} icon="clock-outline" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Métodos de pago"
              description="Gestionar cuentas bancarias"
              left={(props) => <List.Icon {...props} icon="bank" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Historial de ganancias"
              description="Ver reportes financieros"
              left={(props) => <List.Icon {...props} icon="chart-line" />}
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
              description="Recibir alertas de nuevas solicitudes"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />}
            />
            <Divider />
            <List.Item
              title="Disponibilidad automática"
              description="Mostrar disponibilidad en tiempo real"
              left={(props) => <List.Icon {...props} icon="calendar-check" />}
              right={() => <Switch value={availabilityEnabled} onValueChange={setAvailabilityEnabled} />}
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
              description="Centro de ayuda para proveedores"
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

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={() => setShowEditModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Editar perfil</Title>

          <TextInput label="Nombre completo" value={editName} onChangeText={setEditName} style={styles.modalInput} />

          <TextInput
            label="Teléfono"
            value={editPhone}
            onChangeText={setEditPhone}
            style={styles.modalInput}
            keyboardType="phone-pad"
          />

          <TextInput label="Ubicación" value={editLocation} onChangeText={setEditLocation} style={styles.modalInput} />

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => setShowEditModal(false)} style={styles.modalButton}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={handleSaveProfile} style={styles.modalButton}>
              Guardar
            </Button>
          </View>
        </Modal>
      </Portal>
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
  businessCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  businessTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
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
  modalContainer: {
    backgroundColor: theme.colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
})
