import React, { useEffect, useState } from "react"
import { View, StyleSheet, FlatList, Alert } from "react-native"
import { Text, Title, Card, Button, FAB, ActivityIndicator, Menu, IconButton, Snackbar } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../../redux/store"
import { fetchMyLocalStores, deleteLocalStore, LocalStore } from "../../redux/slices/localStoresSlice"
import { theme } from "../../theme"
import { useNavigation } from "@react-navigation/native"

export default function MerchantStoresScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<any>()
  const { items, status, error } = useSelector((state: RootState) => state.localStores)
  const [menuVisible, setMenuVisible] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({ visible: false, message: '', type: 'success' })

  useEffect(() => {
    console.log('MerchantStoresScreen montado, llamando fetchMyLocalStores');
    dispatch(fetchMyLocalStores())
  }, [dispatch])

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteLocalStore(id) as any).unwrap()
      setSnackbar({ visible: true, message: 'Comercio eliminado correctamente', type: 'success' })
    } catch (e: any) {
      setSnackbar({ visible: true, message: e?.message || 'Error al eliminar comercio', type: 'error' })
    }
  }

  const renderItem = ({ item }: { item: LocalStore }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Title style={styles.cardTitle}>{item.name}</Title>
          <Text style={styles.cardType}>{item.type?.charAt(0).toUpperCase() + item.type?.slice(1)} • {item.city}</Text>
          <Text style={styles.cardAddress}>{item.address}</Text>
          <Text style={styles.cardHours}>{item.openingHours}</Text>
        </View>
        <Menu
          visible={menuVisible === item._id}
          onDismiss={() => setMenuVisible(null)}
          anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(item._id)} />}
        >
          <Menu.Item onPress={() => { setMenuVisible(null); navigation.navigate('AddEditStore', { mode: 'edit', store: item }) }} title="Editar" leadingIcon="pencil" />
          <Menu.Item onPress={() => { setMenuVisible(null); handleDelete(item._id) }} title="Eliminar" leadingIcon="delete" />
        </Menu>
      </Card.Content>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mis Comercios</Title>
        <Text style={styles.subtitle}>Gestiona tus comercios registrados</Text>
        <Button mode="contained" icon="plus" onPress={() => navigation.navigate('AddEditStore', { mode: 'add' })} style={styles.addButton}>
          Agregar comercio
        </Button>
      </View>
      {status === 'loading' ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes comercios registrados.</Text>
          <Button mode="contained" icon="plus" onPress={() => navigation.navigate('AddEditStore', { mode: 'add' })} style={styles.addButton}>
            Agregar comercio
          </Button>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={{ backgroundColor: snackbar.type === 'success' ? theme.colors.success : theme.colors.error }}
      >
        {snackbar.message}
      </Snackbar>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: theme.colors.placeholder, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 120 },
  card: { marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
  cardContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  cardType: { fontSize: 13, color: theme.colors.primary, marginBottom: 2 },
  cardAddress: { fontSize: 12, color: theme.colors.placeholder, marginBottom: 2 },
  cardHours: { fontSize: 12, color: theme.colors.text, marginBottom: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 32 },
  emptyText: { fontSize: 16, color: theme.colors.placeholder, textAlign: 'center', marginBottom: 16 },
  addButton: { marginVertical: 8, borderRadius: 12 },
}) 