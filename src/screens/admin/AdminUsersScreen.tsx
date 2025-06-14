"use client"

import React from "react"
import { useState } from "react"
import { StyleSheet, View, FlatList } from "react-native"
import { Text, Card, Avatar, Searchbar, SegmentedButtons, Menu, IconButton, Chip, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../../redux/store"
import { fetchUsers, updateUser, changeUserStatus, deleteUser } from "../../redux/slices/usersSlice"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigation } from "@react-navigation/native"

export default function AdminUsersScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null)

  const dispatch: AppDispatch = useDispatch()
  const { items: users, status, error } = useSelector((state: RootState) => state.users)
  const { signOut } = useContext(AuthContext)
  const navigation = useNavigation<any>()

  // Cargar usuarios al montar
  React.useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "users") return matchesSearch && user.role === "user"
    if (selectedTab === "providers") return matchesSearch && user.role === "provider"
    if (selectedTab === "suspended") return matchesSearch && user.status === "suspended"

    return matchesSearch
  })

  const handleUserAction = async (userId: string, action: string) => {
    setVisibleMenu(null)
    const user = users.find(u => u._id === userId)
    if (!user) return
    if (action === "suspend") {
      await dispatch(changeUserStatus({ id: userId, isActive: false }))
      dispatch(fetchUsers())
    } else if (action === "activate") {
      await dispatch(changeUserStatus({ id: userId, isActive: true }))
      dispatch(fetchUsers())
    } else if (action === "delete") {
      await dispatch(deleteUser(userId))
      dispatch(fetchUsers())
    } else if (action === "edit") {
      // Aquí podrías abrir un modal para editar el usuario
    } else if (action === "view") {
      // Aquí podrías navegar a una pantalla de detalle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.colors.success
      case "suspended":
        return theme.colors.error
      case "pending":
        return theme.colors.warning
      default:
        return theme.colors.placeholder
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "suspended":
        return "Suspendido"
      case "pending":
        return "Pendiente"
      default:
        return status
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "user":
        return "Usuario"
      case "provider":
        return "Proveedor"
      case "admin":
        return "Administrador"
      default:
        return role
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigation.reset({ index: 0, routes: [{ name: "Login" }] })
  }

  const renderUserItem = ({ item }: { item: any }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <View style={styles.userHeader}>
          <Avatar.Image size={50} source={{ uri: item.avatar }} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={styles.userTags}>
              <Chip style={styles.roleChip} textStyle={styles.chipText}>
                {getRoleText(item.role)}
              </Chip>
              <Chip
                style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
                textStyle={styles.statusChipText}
              >
                {getStatusText(item.status)}
              </Chip>
            </View>
          </View>

          <Menu
            visible={visibleMenu === item._id}
            onDismiss={() => setVisibleMenu(null)}
            anchor={<IconButton icon="dots-vertical" onPress={() => setVisibleMenu(item._id)} />}
          >
            <Menu.Item onPress={() => handleUserAction(item._id, "view")} title="Ver perfil" leadingIcon="account" />
            <Menu.Item onPress={() => handleUserAction(item._id, "edit")} title="Editar" leadingIcon="pencil" />
            {item.status === "active" ? (
              <Menu.Item
                onPress={() => handleUserAction(item._id, "suspend")}
                title="Suspender"
                leadingIcon="block-helper"
              />
            ) : (
              <Menu.Item
                onPress={() => handleUserAction(item._id, "activate")}
                title="Activar"
                leadingIcon="check-circle"
              />
            )}
            <Menu.Item onPress={() => handleUserAction(item._id, "delete")} title="Eliminar" leadingIcon="delete" />
          </Menu>
        </View>

        <View style={styles.userStats}>
          {item.role === "user" ? (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{item.totalBookings}</Text>
                <Text style={styles.statLabel}>Reservas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>${item.totalSpent}</Text>
                <Text style={styles.statLabel}>Gastado</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{item.totalServices}</Text>
                <Text style={styles.statLabel}>Servicios</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>${item.totalEarnings}</Text>
                <Text style={styles.statLabel}>Ganado</Text>
              </View>
              {item.rating && (
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{item.rating}</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              )}
            </>
          )}
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.joinDate}</Text>
            <Text style={styles.statLabel}>Registro</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Gestión de Usuarios</Title>
        <Text style={styles.headerSubtitle}>{filteredUsers.length} usuarios</Text>
        <View style={{ position: "absolute", right: 16, top: 20 }}>
          <IconButton icon="logout" onPress={handleLogout} accessibilityLabel="Cerrar sesión" />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar usuarios..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.tabsContainer}>
        <SegmentedButtons
          value={selectedTab}
          onValueChange={setSelectedTab}
          buttons={[
            { value: "all", label: "Todos" },
            { value: "users", label: "Usuarios" },
            { value: "providers", label: "Proveedores" },
            { value: "suspended", label: "Suspendidos" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.usersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
          </View>
        }
      />
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchbar: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.surface,
  },
  usersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  userCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  userTags: {
    flexDirection: "row",
    gap: 8,
  },
  roleChip: {
    backgroundColor: theme.colors.primary,
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: "white",
  },
  statusChipText: {
    fontSize: 10,
    color: "white",
  },
  userStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.placeholder,
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: "center",
  },
})
