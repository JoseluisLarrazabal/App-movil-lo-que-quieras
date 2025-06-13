import React, { useState, useEffect } from "react"
import { StyleSheet, View, ScrollView, Image, Alert } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Button, Card, Title, Text, Chip, Avatar, Divider } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"
import type { RootStackParamList } from "../../navigation/types"
import api from "../../services/api"
import type { Service } from "../../redux/slices/servicesSlice"

type ServiceDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ServiceDetail'>;

interface ServiceDetailParams {
  serviceId: string
}

export default function ServiceDetailScreen() {
  const route = useRoute()
  const navigation = useNavigation<ServiceDetailScreenNavigationProp>()
  const { serviceId } = route.params as ServiceDetailParams

  const [service, setService] = useState<Service | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchServiceDetails()
  }, [serviceId])

  const fetchServiceDetails = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/services/${serviceId}`)
      setService(response.data.service)
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al cargar los detalles del servicio"
      )
      navigation.goBack()
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookService = () => {
    if (!service) return
    navigation.navigate("CreateBookingScreen", { serviceId: service.id })
  }

  const handleContactProvider = () => {
    if (!service) return
    navigation.navigate("Chat", {
      providerId: service.provider.id,
      providerName: service.provider.name
    })
  }

  if (isLoading || !service) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Cargando detalles del servicio...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Imágenes del servicio */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: service.image }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.imageDots}>
            {[0].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  selectedImage === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Información del servicio */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.title}>{service.title}</Title>
            <Chip icon="star" style={styles.ratingChip}>
              {service.rating.toFixed(1)}
            </Chip>
          </View>

          <Text style={styles.price}>${service.price}</Text>
          <Text style={styles.description}>{service.description}</Text>

          <Divider style={styles.divider} />

          {/* Información del proveedor */}
          <Card style={styles.providerCard}>
            <Card.Content>
              <View style={styles.providerHeader}>
                <Avatar.Image
                  size={50}
                  source={{ uri: service.provider.avatar }}
                />
                <View style={styles.providerInfo}>
                  <Title style={styles.providerName}>
                    {service.provider.name}
                  </Title>
                  <Text style={styles.providerRating}>
                    {service.provider.rating.toFixed(1)} ⭐
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Ubicación */}
          <Card style={styles.locationCard}>
            <Card.Content>
              <Title style={styles.locationTitle}>Ubicación</Title>
              <Text style={styles.locationText}>{service.location.address}</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={handleContactProvider}
          style={[styles.button, styles.contactButton]}
          icon="message"
        >
          Contactar
        </Button>
        <Button
          mode="contained"
          onPress={handleBookService}
          style={[styles.button, styles.bookButton]}
          icon="calendar"
        >
          Reservar
        </Button>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imageDots: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  ratingChip: {
    backgroundColor: theme.colors.primary,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  providerCard: {
    marginBottom: 16,
  },
  providerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  providerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    marginBottom: 4,
  },
  providerRating: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  locationCard: {
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
    backgroundColor: theme.colors.surface,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  contactButton: {
    borderColor: theme.colors.primary,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
  },
}) 