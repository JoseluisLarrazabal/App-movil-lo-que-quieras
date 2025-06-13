import React from "react"
import { StyleSheet, View, FlatList } from "react-native"
import { useSelector } from "react-redux"
import { useNavigation } from "@react-navigation/native"
import { Appbar, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState } from "../../redux/store"
import ServiceCard from "../../components/ServiceCard"
import { theme } from "../../theme"

export default function AllServicesScreen() {
  const navigation = useNavigation()
  const { items: services } = useSelector((state: RootState) => state.services)

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Todos los servicios" />
      </Appbar.Header>
      <Title style={styles.title}>Explora todos los servicios</Title>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.serviceItemWrapper}>
            <ServiceCard service={item} onPress={() => {}} />
          </View>
        )}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Title style={styles.emptyText}>No hay servicios disponibles</Title>}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
    color: theme.colors.text,
    textAlign: "center",
  },
  servicesList: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  serviceItemWrapper: {
    marginBottom: 18,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.placeholder,
    marginTop: 40,
  },
}) 