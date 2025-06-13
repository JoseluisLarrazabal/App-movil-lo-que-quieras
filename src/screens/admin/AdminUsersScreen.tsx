"use client"

import React from "react"
import { useState } from "react"
import { StyleSheet, View, FlatList } from "react-native"
import { Text, Card, Avatar, Searchbar, SegmentedButtons, Menu, IconButton, Chip, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"

export default function AdminUsersScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null)

  // Mock users data
  const [users] = useState([
    {
      id: "1",
      name: "María García",
      email: "maria@email.com",
      role: "user",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "active",
      joinDate: "2023-01-15",
      totalBookings: 12,
      totalSpent: 2400,
    },
    {
      id: "2",
      name: "Juan Pérez",
      email: "juan@email.com",
      role: "provider",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "active",
      joinDate: "2023-02-20",
      totalServices: 8,
      totalEarnings: 5600,
      rating: 4.8,
    },
    {
      id: "3",
      name: "Ana López",
      email: "ana@email.com",
      role: "user",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      status: "suspended",
      joinDate: "2023-03-10",
      totalBookings: 3,
      totalSpent: 450,
    },
    {
      id: "4",
      name: "Carlos Rodríguez",
      email: "carlos@email.com",
      role: "provider",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      status: "pending",
      joinDate: "2023-06-01",
      totalServices: 0,
      totalEarnings: 0,
    },
  ])

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

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action ${action} for user ${userId}`)
    setVisibleMenu(null)
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
            visible={visibleMenu === item.id}
            onDismiss={() => setVisibleMenu(null)}
            anchor={<IconButton icon="dots-vertical" onPress={() => setVisibleMenu(item.id)} />}
          >
            <Menu.Item onPress={() => handleUserAction(item.id, "view")} title="Ver perfil" leadingIcon="account" />
            <Menu.Item onPress={() => handleUserAction(item.id, "edit")} title="Editar" leadingIcon="pencil" />
            {item.status === "active" ? (
              <Menu.Item
                onPress={() => handleUserAction(item.id, "suspend")}
                title="Suspender"
                leadingIcon="block-helper"
              />
            ) : (
              <Menu.Item
                onPress={() => handleUserAction(item.id, "activate")}
                title="Activar"
                leadingIcon="check-circle"
              />
            )}
            <Menu.Item onPress={() => handleUserAction(item.id, "delete")} title="Eliminar" leadingIcon="delete" />
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
        keyExtractor={(item) => item.id}
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
