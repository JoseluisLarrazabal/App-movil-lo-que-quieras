// screens/professional/ProfessionalDetailScreen.tsx
"use client"

import { useSelector } from "react-redux"
import { StyleSheet, View, ScrollView, Linking, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Avatar, Card, Chip, Title, Text, Button, Paragraph } from "react-native-paper"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import type { RootState } from "../../redux/store"
import { theme } from "../../theme"

export default function ProfessionalDetailScreen() {
  // Asume que recibes professionalId por parámetros de la navegación
  const route = useRoute<RouteProp<{ params: { professionalId: string } }, "params">>()
  const navigation = useNavigation()
  const { items: professionals } = useSelector((state: RootState) => state.professionals)
  const professional = professionals.find(p => p.id === route.params?.professionalId)

  if (!professional) {
    return (
      <SafeAreaView style={{flex:1,alignItems:"center",justifyContent:"center"}}>
        <Text>Profesional no encontrado</Text>
      </SafeAreaView>
    )
  }

  const handleContact = () => {
    Alert.alert(
      "Contactar",
      `¿Cómo quieres contactar a ${professional.user.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "WhatsApp", 
          onPress: () => {
            const phone = professional.contactInfo.whatsapp || professional.contactInfo.phone
            const message = `Hola ${professional.user.name}, vi tu perfil en Lo Que Quieras y me interesa contactarte.`
            const url = `whatsapp://send?phone=${phone.replace(/[^\d]/g, '')}&text=${encodeURIComponent(message)}`
            Linking.openURL(url).catch(() => {
              Alert.alert('Error', 'No se pudo abrir WhatsApp')
            })
          }
        },
        { 
          text: "Llamar", 
          onPress: () => Linking.openURL(`tel:${professional.contactInfo.phone}`)
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Image size={90} source={{ uri: professional.user.avatar }} />
            <Title style={styles.name}>{professional.user.name}</Title>
            <Chip style={styles.professionChip}>{professional.profession}</Chip>
            <Text style={styles.city}>{professional.workLocation.city}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★ {professional.rating}</Text>
              <Text style={styles.secondary}>({professional.projectsCompleted} trabajos)</Text>
              {professional.verified && (
                <Chip style={styles.verifiedChip} textStyle={styles.verifiedText}>
                  ✓ Verificado
                </Chip>
              )}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Especialidades</Title>
            <View style={styles.row}>
              {professional.specialties.map((s, i) => (
                <Chip key={i} style={styles.specialtyChip}>{s}</Chip>
              ))}
            </View>
            <Title style={styles.sectionTitle}>Habilidades</Title>
            <View style={styles.row}>
              {professional.skills.map((s, i) => (
                <Chip key={i} style={styles.skillChip}>{s}</Chip>
              ))}
            </View>
            <Title style={styles.sectionTitle}>Tarifas</Title>
            {professional.rates.hourly && (
              <Text>• ${professional.rates.hourly}/h</Text>
            )}
            {professional.rates.daily && (
              <Text>• ${professional.rates.daily}/día</Text>
            )}
            {professional.rates.project && (
              <Text>• {professional.rates.project}</Text>
            )}
            <Title style={styles.sectionTitle}>Contacto</Title>
            <Text>Teléfono: {professional.contactInfo.phone}</Text>
            <Text>Ciudad: {professional.workLocation.city}</Text>
          </Card.Content>
        </Card>

        {/* Si quieres mostrar experiencia extra o descripción larga, descomenta: */}
        {/* {professional.experience?.description && (
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Experiencia</Title>
              <Paragraph>{professional.experience.description}</Paragraph>
            </Card.Content>
          </Card>
        )} */}

        <View style={styles.actions}>
          <Button 
            mode="contained"
            icon="phone"
            style={styles.contactButton}
            onPress={handleContact}
          >
            Contactar
          </Button>
          <Button 
            style={styles.backButton}
            mode="text"
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          >
            Volver
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  profileCard: { margin: 16, borderRadius: 16 },
  cardContent: { alignItems: "center", paddingVertical: 24 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 6 },
  professionChip: { marginTop: 8, backgroundColor: theme.colors.primary, color: "white" },
  city: { fontSize: 13, marginTop: 4, color: theme.colors.placeholder },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 },
  rating: { fontWeight: "bold", color: "#F59E0B", fontSize: 16 },
  secondary: { color: theme.colors.placeholder, marginLeft: 4 },
  verifiedChip: { backgroundColor: theme.colors.success, height: 22, marginLeft: 8 },
  verifiedText: { fontSize: 10, color: "white" },
  infoCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, marginTop: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  specialtyChip: { marginRight: 8, marginBottom: 8, backgroundColor: theme.colors.surface },
  skillChip: { marginRight: 8, marginBottom: 8, backgroundColor: theme.colors.tertiary },
  actions: { flexDirection: "row", justifyContent: "space-between", margin: 24, gap: 8 },
  contactButton: { flex: 1, borderRadius: 12, backgroundColor: theme.colors.primary },
  backButton: { flex: 1, borderRadius: 12 }
})