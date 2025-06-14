"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Card, Title, Button, FAB, Portal, Modal, TextInput, Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../../redux/store"
import { fetchServices, createService, deleteServiceAsync } from "../../redux/slices/servicesSlice"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

export default function ProviderServicesScreen() {
  const dispatch: AppDispatch = useDispatch()
  const { items: services, status, error } = useSelector((state: RootState) => state.services)
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  useEffect(() => {
    dispatch(fetchServices())
  }, [dispatch])

  const handleDeleteService = (id: string) => {
    Alert.alert(
      "Eliminar servicio",
      "¿Estás seguro que deseas eliminar este servicio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await dispatch(deleteServiceAsync(id))
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Title style={styles.title}>Mis Servicios</Title>
          <Text style={styles.subtitle}>Gestiona los servicios que ofreces</Text>
        </View>

        {services.map(service => (
          <Card key={service.id} style={styles.serviceCard}>
            <Card.Content>
              <Title style={styles.serviceName}>{service.title}</Title>
              <Text style={styles.serviceCategory}>{service.category?.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <View style={styles.serviceDetails}>
                <Text style={styles.servicePrice}>${service.price}</Text>
                <Text style={styles.serviceDuration}>{(service as any).duration ?? 0} min</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>Editar</Button>
              <Button onPress={() => handleDeleteService(service.id)} textColor={theme.colors.error}>
                Eliminar
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddService", { mode: "add" })}
        label="Agregar servicio"
      />
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  serviceCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceCategory: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  serviceDuration: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
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
