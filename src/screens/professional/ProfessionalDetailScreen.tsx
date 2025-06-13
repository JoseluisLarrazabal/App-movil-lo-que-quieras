// screens/professional/ProfessionalDetailScreen.tsx
"use client"

import { useSelector } from "react-redux"
import { StyleSheet, View, ScrollView, Linking, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Avatar, Card, Title, Text, Button, Paragraph } from "react-native-paper"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import type { RootState } from "../../redux/store"
import { theme } from "../../theme"

export default function ProfessionalDetailScreen() {
  // Asume que recibes professionalId por parámetros de la navegación
  const route = useRoute<RouteProp<{ params: { professionalId: string } }, "params">>()
  const navigation = useNavigation()
  const { items: professionals } = useSelector((state: RootState) => state.professionals)
  const professional = professionals.find(p => p._id === route.params?.professionalId)

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
            
            <View style={styles.professionChip}>
              <Text style={styles.professionText}>{professional.profession}</Text>
            </View>
            
            <Text style={styles.city}>{professional.workLocation.city}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★ {professional.rating}</Text>
              <Text style={styles.secondary}>({professional.projectsCompleted} trabajos)</Text>
              {professional.verified && (
                <View style={styles.verifiedChip}>
                  <Text style={styles.verifiedText}>✓ Verificado</Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Especialidades</Title>
            <View style={styles.row}>
              {professional.specialties.map((s, i) => (
                <View key={i} style={styles.specialtyChip}>
                  <Text style={styles.specialtyText}>{s}</Text>
                </View>
              ))}
            </View>
            
            <Title style={styles.sectionTitle}>Habilidades</Title>
            <View style={styles.row}>
              {professional.skills.map((s, i) => (
                <View key={i} style={styles.skillChip}>
                  <Text style={styles.skillText}>{s}</Text>
                </View>
              ))}
            </View>
            
            <Title style={styles.sectionTitle}>Tarifas</Title>
            <View style={styles.ratesContainer}>
              {professional.rates.hourly && (
                <Text style={styles.rateText}>• ${professional.rates.hourly}/h</Text>
              )}
              {professional.rates.daily && (
                <Text style={styles.rateText}>• ${professional.rates.daily}/día</Text>
              )}
              {professional.rates.project && (
                <Text style={styles.rateText}>• {professional.rates.project}</Text>
              )}
            </View>
            
            <Title style={styles.sectionTitle}>Contacto</Title>
            <View style={styles.contactContainer}>
              <Text style={styles.contactText}>Teléfono: {professional.contactInfo.phone}</Text>
              <Text style={styles.contactText}>Ciudad: {professional.workLocation.city}</Text>
            </View>
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
  
  // Chip personalizado para profesión
  professionChip: { 
    marginTop: 8, 
    backgroundColor: theme.colors.primary, 
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  professionText: {
    color: "white",
    fontSize: 14,
    fontWeight: '600',
  },
  
  city: { fontSize: 13, marginTop: 4, color: theme.colors.placeholder },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 },
  rating: { fontWeight: "bold", color: "#F59E0B", fontSize: 16 },
  secondary: { color: theme.colors.placeholder, marginLeft: 4 },
  
  // Chip verificado personalizado
  verifiedChip: { 
    backgroundColor: theme.colors.success, 
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: { 
    fontSize: 10, 
    color: "white",
    fontWeight: '600',
  },
  
  infoCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, marginTop: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  
  // Chips de especialidades personalizados
  specialtyChip: { 
    marginRight: 8, 
    marginBottom: 8, 
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  specialtyText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  
  // Chips de habilidades personalizados
  skillChip: { 
    marginRight: 8, 
    marginBottom: 8, 
    backgroundColor: theme.colors.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '500',
  },
  
  // Contenedores adicionales para mejor organización
  ratesContainer: {
    marginBottom: 8,
  },
  rateText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  contactContainer: {
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  
  actions: { flexDirection: "row", justifyContent: "space-between", margin: 24, gap: 8 },
  contactButton: { flex: 1, borderRadius: 12, backgroundColor: theme.colors.primary },
  backButton: { flex: 1, borderRadius: 12 }
})