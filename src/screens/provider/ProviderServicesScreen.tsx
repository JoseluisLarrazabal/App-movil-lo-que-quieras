"use client"

import { useState } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Card, Title, Button, FAB, Portal, Modal, TextInput, Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

export default function ProviderServicesScreen() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Corte de cabello",
      description: "Corte de cabello profesional con lavado incluido",
      price: 25,
      duration: 30,
      category: "Peluquería",
    },
    {
      id: "2",
      name: "Manicure",
      description: "Manicure completo con esmalte semipermanente",
      price: 35,
      duration: 45,
      category: "Belleza",
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    category: "",
  })

  const handleAddService = () => {
    if (!newService.name || !newService.description || !newService.category) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos")
      return
    }

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description,
      price: newService.price || 0,
      duration: newService.duration || 30,
      category: newService.category,
    }

    setServices([...services, service])
    setShowAddModal(false)
    setNewService({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "",
    })
  }

  const handleDeleteService = (id: string) => {
    Alert.alert(
      "Eliminar servicio",
      "¿Estás seguro que deseas eliminar este servicio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setServices(services.filter(service => service.id !== id))
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
              <Title style={styles.serviceName}>{service.name}</Title>
              <Text style={styles.serviceCategory}>{service.category}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <View style={styles.serviceDetails}>
                <Text style={styles.servicePrice}>${service.price}</Text>
                <Text style={styles.serviceDuration}>{service.duration} min</Text>
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

      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Agregar Nuevo Servicio</Title>

          <TextInput
            label="Nombre del servicio"
            value={newService.name}
            onChangeText={text => setNewService({ ...newService, name: text })}
            style={styles.input}
          />

          <TextInput
            label="Categoría"
            value={newService.category}
            onChangeText={text => setNewService({ ...newService, category: text })}
            style={styles.input}
          />

          <TextInput
            label="Descripción"
            value={newService.description}
            onChangeText={text => setNewService({ ...newService, description: text })}
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <TextInput
            label="Precio"
            value={newService.price?.toString()}
            onChangeText={text => setNewService({ ...newService, price: parseFloat(text) || 0 })}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Duración (minutos)"
            value={newService.duration?.toString()}
            onChangeText={text => setNewService({ ...newService, duration: parseInt(text) || 30 })}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => setShowAddModal(false)} style={styles.modalButton}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={handleAddService} style={styles.modalButton}>
              Agregar
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
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
