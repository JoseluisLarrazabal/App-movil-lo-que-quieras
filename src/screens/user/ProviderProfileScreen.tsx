"use client"

import { useState } from "react"
import { StyleSheet, View, ScrollView, FlatList } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../navigation/types"
import { Text, Avatar, Button, Card, Title, Paragraph, Chip, Divider, List, Appbar } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"
import ServiceCard from "../../components/ServiceCard"

type ProviderProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProviderProfile'
>;

export default function ProviderProfileScreen() {
  const route = useRoute()
  const navigation = useNavigation<ProviderProfileScreenNavigationProp>()
  const { providerId } = route.params as { providerId: string }

  // Mock provider data
  const [provider] = useState({
    id: "1",
    name: "María García",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    reviewsCount: 127,
    completedJobs: 89,
    responseTime: "< 1 hora",
    memberSince: "2022",
    verified: true,
    description:
      "Profesional en servicios de limpieza con más de 5 años de experiencia. Especializada en limpieza profunda y mantenimiento de hogares.",
    location: "Buenos Aires, Argentina",
    services: ["Limpieza general", "Limpieza profunda", "Limpieza post-construcción", "Organización de espacios"],
    availability: ["Lunes a Viernes", "9:00 - 18:00"],
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    ],
  })

  const [providerServices] = useState([
    {
      id: "1",
      title: "Limpieza profunda de hogar",
      description: "Servicio completo de limpieza para tu hogar",
      price: 850,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      category: { id: "1", name: "Limpieza" },
      provider: {
        id: "1",
        name: "María García",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 4.9,
      },
      location: {
        lat: -34.6037,
        lng: -58.3816,
        address: "Buenos Aires, Argentina",
      },
    },
  ])

  const [reviews] = useState([
    {
      id: "1",
      user: {
        name: "Ana López",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      },
      rating: 5,
      comment: "Excelente servicio, muy profesional y puntual. Mi casa quedó impecable.",
      date: "Hace 2 días",
    },
    {
      id: "2",
      user: {
        name: "Carlos Pérez",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      rating: 4,
      comment: "Buen trabajo, llegó a tiempo y fue muy cuidadoso con los muebles.",
      date: "Hace 1 semana",
    },
  ])

  const handleContactProvider = () => {
    navigation.navigate("Chat", {
      providerId: provider.id,
      providerName: provider.name,
    });
  }

  const navigateToServiceDetail = (serviceId: string) => {
    navigation.navigate("ServiceDetail", { serviceId });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Perfil del proveedor" />
        <Appbar.Action icon="heart-outline" onPress={() => {}} />
        <Appbar.Action icon="share" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Provider Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Avatar.Image size={80} source={{ uri: provider.avatar }} />
            <View style={styles.providerInfo}>
              <View style={styles.nameContainer}>
                <Title style={styles.providerName}>{provider.name}</Title>
                {provider.verified && (
                  <Chip style={styles.verifiedChip} textStyle={styles.verifiedText}>
                    Verificado
                  </Chip>
                )}
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★ {provider.rating}</Text>
                <Text style={styles.reviewsCount}>({provider.reviewsCount} reseñas)</Text>
              </View>
              <Text style={styles.location}>{provider.location}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{provider.completedJobs}</Text>
                <Text style={styles.statLabel}>Trabajos completados</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{provider.responseTime}</Text>
                <Text style={styles.statLabel}>Tiempo de respuesta</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{provider.memberSince}</Text>
                <Text style={styles.statLabel}>Miembro desde</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Description */}
        <Card style={styles.descriptionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Acerca de mí</Title>
            <Paragraph style={styles.description}>{provider.description}</Paragraph>
          </Card.Content>
        </Card>

        {/* Services */}
        <Card style={styles.servicesCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Servicios que ofrezco</Title>
            <View style={styles.servicesContainer}>
              {provider.services.map((service, index) => (
                <Chip key={index} style={styles.serviceChip}>
                  {service}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Availability */}
        <Card style={styles.availabilityCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Disponibilidad</Title>
            <List.Item
              title="Días disponibles"
              description={provider.availability[0]}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
            <Divider />
            <List.Item
              title="Horarios"
              description={provider.availability[1]}
              left={(props) => <List.Icon {...props} icon="clock" />}
            />
          </Card.Content>
        </Card>

        {/* Gallery */}
        <Card style={styles.galleryCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Galería de trabajos</Title>
            <FlatList
              data={provider.gallery}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.galleryItem}>
                  <Card style={styles.galleryImageCard}>
                    <Card.Cover source={{ uri: item }} style={styles.galleryImage} />
                  </Card>
                </View>
              )}
            />
          </Card.Content>
        </Card>

        {/* Provider Services */}
        <Card style={styles.providerServicesCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Servicios disponibles</Title>
            <FlatList
              data={providerServices}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.serviceCardContainer}>
                  <ServiceCard service={item} onPress={() => navigateToServiceDetail(item.id)} />
                </View>
              )}
            />
          </Card.Content>
        </Card>

        {/* Reviews */}
        <Card style={styles.reviewsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Reseñas ({provider.reviewsCount})</Title>

            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Avatar.Image size={40} source={{ uri: review.user.avatar }} />
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewerName}>{review.user.name}</Text>
                    <Text style={styles.reviewRating}>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </Text>
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
                {review.id !== reviews[reviews.length - 1].id && <Divider style={styles.reviewDivider} />}
              </View>
            ))}

            <Button mode="text" style={styles.seeAllReviews}>
              Ver todas las reseñas
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          mode="outlined"
          style={styles.contactButton}
          contentStyle={styles.buttonContent}
          onPress={handleContactProvider}
        >
          Contactar
        </Button>
        <Button mode="contained" style={styles.hireButton} contentStyle={styles.buttonContent} onPress={() => {}}>
          Contratar
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
  headerCard: {
    margin: 16,
    borderRadius: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  providerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  providerName: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  verifiedChip: {
    backgroundColor: theme.colors.success,
    height: 24,
  },
  verifiedText: {
    fontSize: 10,
    color: "white",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F59E0B",
    marginRight: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  location: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    textAlign: "center",
  },
  descriptionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onSurface,
  },
  servicesCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  serviceChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  availabilityCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  galleryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  galleryItem: {
    marginRight: 12,
  },
  galleryImageCard: {
    width: 120,
    borderRadius: 8,
  },
  galleryImage: {
    height: 80,
    borderRadius: 8,
  },
  providerServicesCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  serviceCardContainer: {
    marginRight: 12,
  },
  reviewsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
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
    marginTop: 16,
  },
  seeAllReviews: {
    alignSelf: "center",
    marginTop: 8,
  },
  bottomActions: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
  },
  contactButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
  },
  hireButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
  },
  buttonContent: {
    height: 48,
  },
})
