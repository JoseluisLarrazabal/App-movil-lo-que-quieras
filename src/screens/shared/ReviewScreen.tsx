import React from "react"
import { useState } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Button, Card, Title, Text, TextInput } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { theme } from "../../theme"
import type { RootStackParamList } from "../../navigation/types"
import api from "../../services/api"
import { Rating } from "react-native-ratings"

type ReviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ReviewParams {
  serviceId: string
  serviceName: string
  providerId: string
  providerName: string
  bookingId: string
}

export default function ReviewScreen() {
  const route = useRoute()
  const navigation = useNavigation<ReviewScreenNavigationProp>()
  const params = route.params as ReviewParams

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Por favor selecciona una calificación")
      return
    }

    if (comment.trim() === "") {
      Alert.alert("Error", "Por favor escribe un comentario")
      return
    }

    try {
      setIsSubmitting(true)
      await api.post(`/bookings/${params.bookingId}/review`, {
        rating,
        comment: comment.trim()
      })

      Alert.alert(
        "Éxito",
        "¡Gracias por tu reseña!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      )
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al enviar la reseña"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Title style={styles.title}>Escribe una reseña</Title>
          <Text style={styles.subtitle}>
            Cuéntanos tu experiencia con {params.serviceName}
          </Text>
        </View>

        <Card style={styles.ratingCard}>
          <Card.Content>
            <Title style={styles.ratingTitle}>¿Cómo calificarías el servicio?</Title>
            <View style={styles.ratingContainer}>
              <Rating
                showRating
                onFinishRating={setRating}
                style={styles.rating}
                imageSize={40}
                startingValue={rating}
                tintColor={theme.colors.background}
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.commentCard}>
          <Card.Content>
            <Title style={styles.commentTitle}>Tu comentario</Title>
            <TextInput
              mode="outlined"
              value={comment}
              onChangeText={setComment}
              placeholder="Cuéntanos tu experiencia..."
              multiline
              numberOfLines={6}
              style={styles.commentInput}
            />
          </Card.Content>
        </Card>

        <View style={styles.tipsContainer}>
          <Title style={styles.tipsTitle}>Consejos para una buena reseña:</Title>
          <Text style={styles.tip}>• Sé específico sobre tu experiencia</Text>
          <Text style={styles.tip}>• Menciona aspectos positivos y áreas de mejora</Text>
          <Text style={styles.tip}>• Mantén un tono respetuoso y constructivo</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmitReview}
          style={styles.submitButton}
          disabled={rating === 0 || comment.trim() === "" || isSubmitting}
          loading={isSubmitting}
        >
          Enviar reseña
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
  ratingCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  ratingTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  rating: {
    paddingVertical: 10,
  },
  commentCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  commentTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  commentInput: {
    backgroundColor: "transparent",
  },
  tipsContainer: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
    backgroundColor: theme.colors.surface,
  },
  submitButton: {
    borderRadius: 12,
  },
}) 