import React, { useEffect } from "react"
import { View, StyleSheet, FlatList, Alert } from "react-native"
import { Text, Title, Card, Button, FAB, ActivityIndicator } from "react-native-paper"
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

  useEffect(() => {
    console.log('MerchantStoresScreen montado, llamando fetchMyLocalStores');
    dispatch(fetchMyLocalStores())
  }, [dispatch])

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar comercio",
      "¿Estás seguro que deseas eliminar este comercio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await dispatch(deleteLocalStore(id))
          },
        },
      ]
    )
  }

  const renderItem = ({ item }: { item: LocalStore }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.name}</Title>
        <Text style={styles.cardType}>{item.type?.charAt(0).toUpperCase() + item.type?.slice(1)} • {item.city}</Text>
        <Text style={styles.cardAddress}>{item.address}</Text>
        <Text style={styles.cardHours}>{item.openingHours}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate("AddEditStore", { store: item, mode: "edit" })}>Editar</Button>
        <Button onPress={() => handleDelete(item._id)} textColor={theme.colors.error}>Eliminar</Button>
      </Card.Actions>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mis Comercios</Title>
        <Text style={styles.subtitle}>Gestiona tus comercios registrados</Text>
      </View>
      {status === "loading" ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No tienes comercios registrados</Text>}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddEditStore", { mode: "add" })}
        label="Agregar comercio"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: theme.colors.placeholder, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 120 },
  card: { marginBottom: 12, borderRadius: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  cardType: { fontSize: 13, color: theme.colors.primary, marginBottom: 2 },
  cardAddress: { fontSize: 12, color: theme.colors.placeholder, marginBottom: 2 },
  cardHours: { fontSize: 12, color: theme.colors.text, marginBottom: 2 },
  empty: { textAlign: 'center', color: theme.colors.placeholder, marginTop: 40 },
  error: { color: theme.colors.error, textAlign: 'center', marginTop: 40 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    borderRadius: 28,
  },
}) 