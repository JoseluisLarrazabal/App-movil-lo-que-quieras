"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, ScrollView, Image, Dimensions, Alert } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { useRoute, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../navigation/types"
import {
  Text,
  Button,
  Card,
  Avatar,
  Chip,
  Divider,
  List,
  Title,
  Paragraph,
  Appbar,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState } from "../../redux/store"
import { setSelectedService } from "../../redux/slices/servicesSlice"
import { addBooking } from "../../redux/slices/bookingsSlice"
import { theme } from "../../theme"

const { width } = Dimensions.get("window")

type ServiceDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ServiceDetail'
>;

export default function ServiceDetailScreen() {
  const route = useRoute()
  const navigation = useNavigation<ServiceDetailScreenNavigationProp>()
  const dispatch = useDispatch()
  const { serviceId } = route.params as { serviceId: string }
  const { items: services, selectedService } = useSelector((state: RootState) => state.services)

  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const service = services.find((s) => s.id === serviceId)
    if (service) {
      dispatch(setSelectedService(service))
    }
  }, [serviceId, services, dispatch])

  const handleBookService = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Por favor selecciona fecha y hora")
      return
    }

    const newBooking = {
      id: Date.now().toString(),
      serviceId: selectedService!.id,
      providerId: selectedService!.provider.id,
      userId: "3", // Current user ID
      date: selectedDate,
      time: selectedTime,
      status: "pending" as const,
      price: selectedService!.price,
      notes,
      service: {
        title: selectedService!.title,
        image: selectedService!.image,
      },
      provider: {
        name: selectedService!.provider.name,
        avatar: selectedService!.provider.avatar,
      },
      user: {
        name: "María Usuario",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
    }

    dispatch(addBooking(newBooking))
    setShowBookingModal(false)
    Alert.alert("¡Éxito!", "Tu reserva ha sido enviada al proveedor", [
      { text: "OK", onPress: () => navigation.goBack() },
    ])
  }

  const handleContactProvider = () => {
    if (!selectedService) return;
    
    navigation.navigate("Chat", {
      providerId: selectedService.provider.id,
      providerName: selectedService.provider.name,
    });
  }

  if (!selectedService) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalles del servicio" />
        <Appbar.Action icon="heart-outline" onPress={() => {}} />
        <Appbar.Action icon="share" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Image */}
        <Image source={{ uri: selectedService.image }} style={styles.serviceImage} />

        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <View style={styles.serviceHeader}>
            <View style={styles.serviceTitleContainer}>
              <Title style={styles.serviceTitle}>{selectedService.title}</Title>
              <Chip style={styles.categoryChip}>{selectedService.category.name}</Chip>
            </View>
            <Text style={styles.servicePrice}>${selectedService.price}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {selectedService.rating}</Text>
            <Text style={styles.ratingText}>(48 reseñas)</Text>
          </View>

          <Paragraph style={styles.serviceDescription}>{selectedService.description}</Paragraph>
        </View>

        {/* Provider Info */}
        <Card style={styles.providerCard}>
          <Card.Content>
            <View style={styles.providerHeader}>
              <Avatar.Image size={60} source={{ uri: selectedService.provider.avatar }} />
              <View style={styles.providerInfo}>
                <Title style={styles.providerName}>{selectedService.provider.name}</Title>
                <Text style={styles.providerRating}>★ {selectedService.provider.rating} • Proveedor verificado</Text>
                <Text style={styles.providerLocation}>{selectedService.location.address}</Text>
              </View>
            </View>
            <View style={styles.providerActions}>
              <Button mode="outlined" style={styles.contactButton} onPress={handleContactProvider}>
                Contactar
              </Button>
              <Button mode="text" onPress={() => {}}>
                Ver perfil
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Service Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.detailsTitle}>Detalles del servicio</Title>
            <List.Item
              title="Duración estimada"
              description="2-3 horas"
              left={(props) => <List.Icon {...props} icon="clock" />}
            />
            <Divider />
            <List.Item
              title="Incluye materiales"
              description="Productos de limpieza incluidos"
              left={(props) => <List.Icon {...props} icon="package-variant" />}
            />
            <Divider />
            <List.Item
              title="Garantía"
              description="Satisfacción garantizada"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
            />
          </Card.Content>
        </Card>

        {/* Reviews */}
        <Card style={styles.reviewsCard}>
          <Card.Content>
            <Title style={styles.reviewsTitle}>Reseñas (48)</Title>

            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Avatar.Image size={40} source={{ uri: "https://randomuser.me/api/portraits/women/32.jpg" }} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>Ana García</Text>
                  <Text style={styles.reviewRating}>★★★★★</Text>
                </View>
                <Text style={styles.reviewDate}>Hace 2 días</Text>
              </View>
              <Text style={styles.reviewText}>
                Excelente servicio, muy profesional y puntual. Mi casa quedó impecable.
              </Text>
            </View>

            <Divider style={styles.reviewDivider} />

            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Avatar.Image size={40} source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>Carlos López</Text>
                  <Text style={styles.reviewRating}>★★★★☆</Text>
                </View>
                <Text style={styles.reviewDate}>Hace 1 semana</Text>
              </View>
              <Text style={styles.reviewText}>Buen trabajo, llegó a tiempo y fue muy cuidadoso con los muebles.</Text>
            </View>

            <Button mode="text" style={styles.seeAllReviews}>
              Ver todas las reseñas
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          mode="contained"
          style={styles.bookButton}
          contentStyle={styles.bookButtonContent}
          onPress={() => setShowBookingModal(true)}
        >
          Reservar servicio
        </Button>
      </View>

      {/* Booking Modal */}
      <Portal>
        <Modal
          visible={showBookingModal}
          onDismiss={() => setShowBookingModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Reservar servicio</Title>

          <TextInput
            label="Fecha (DD/MM/YYYY)"
            value={selectedDate}
            onChangeText={setSelectedDate}
            style={styles.modalInput}
            placeholder="15/01/2024"
          />

          <TextInput
            label="Hora"
            value={selectedTime}
            onChangeText={setSelectedTime}
            style={styles.modalInput}
            placeholder="14:00"
          />

          <TextInput
            label="Notas adicionales (opcional)"
            value={notes}
            onChangeText={setNotes}
            style={styles.modalInput}
            multiline
            numberOfLines={3}
            placeholder="Detalles específicos sobre el servicio..."
          />

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => setShowBookingModal(false)} style={styles.modalButton}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={handleBookService} style={styles.modalButton}>
              Confirmar reserva
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
  serviceImage: {
    width: width,
    height: 250,
  },
  serviceInfo: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  serviceTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: "flex-start",
  },
  servicePrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F59E0B",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  serviceDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.onSurface,
  },
  providerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  providerHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  providerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  providerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  providerRating: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  providerLocation: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  providerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactButton: {
    flex: 1,
    marginRight: 8,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  reviewsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  reviewRating: {
    fontSize: 12,
    color: "#F59E0B",
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onSurface,
  },
  reviewDivider: {
    marginVertical: 16,
  },
  seeAllReviews: {
    alignSelf: "center",
  },
  bottomActions: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
  },
  bookButton: {
    borderRadius: 12,
  },
  bookButtonContent: {
    height: 48,
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
