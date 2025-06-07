import { StyleSheet, View, TouchableOpacity, Image } from "react-native"
import { Card, Text, Avatar, Button, Chip } from "react-native-paper"
import { theme } from "../theme"

interface ServiceCardProps {
  service: {
    id: string
    title: string
    description: string
    price: number
    rating: number
    image: string
    category: {
      id: string
      name: string
    }
    provider: {
      id: string
      name: string
      avatar: string
      rating: number
    }
    location: {
      lat: number
      lng: number
      address: string
    }
  }
  onPress: () => void
}

export default function ServiceCard({ service, onPress }: ServiceCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.image} />
          <Chip style={styles.categoryChip} textStyle={styles.categoryChipText}>
            {service.category.name}
          </Chip>
        </View>

        <Card.Content style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {service.title}
          </Text>

          <View style={styles.providerInfo}>
            <Avatar.Image size={24} source={{ uri: service.provider.avatar }} />
            <Text style={styles.providerName}>{service.provider.name}</Text>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>★ {service.rating}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.price}>${service.price}</Text>
            <Button mode="contained" compact style={styles.bookButton} labelStyle={styles.bookButtonLabel}>
              Reservar
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    width: 280,
  },
  card: {
    borderRadius: 16,
    elevation: 2,
    backgroundColor: theme.colors.surface,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  categoryChip: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  categoryChipText: {
    fontSize: 10,
    color: theme.colors.text,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  providerName: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginLeft: 8,
    flex: 1,
  },
  rating: {
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 10,
    color: "#856404",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  bookButton: {
    borderRadius: 8,
  },
  bookButtonLabel: {
    fontSize: 12,
  },
})
