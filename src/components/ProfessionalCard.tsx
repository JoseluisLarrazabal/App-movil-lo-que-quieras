// components/ProfessionalCard.tsx
import { StyleSheet, View, TouchableOpacity, Linking, Alert } from "react-native"
import { Card, Avatar, Text, Chip, Button } from "react-native-paper"
import { theme } from "../theme"
import type { Professional } from "../redux/slices/professionalsSlice"  // ✅ USAR el tipo correcto
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Definir el tipo para las rutas de navegación
type RootStackParamList = {
  ProfessionalDetail: { professionalId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfessionalDetail'>;

interface ProfessionalCardProps {
  professional: Professional  // ✅ CAMBIAR a Professional completo
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const navigation = useNavigation<NavigationProp>();
  
  // ✅ IMPLEMENTAR lógica de contacto real
  const handleContact = () => {
    Alert.alert(
      "Contactar",
      `¿Cómo quieres contactar a ${professional.user.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "WhatsApp", 
          onPress: () => openWhatsApp() 
        },
        { 
          text: "Llamar", 
          onPress: () => makeCall() 
        }
      ]
    )
  }

  const openWhatsApp = () => {
    const phone = professional.contactInfo.whatsapp || professional.contactInfo.phone
    const message = `Hola ${professional.user.name}, vi tu perfil en Lo Que Quieras y me interesa contactarte.`
    const url = `whatsapp://send?phone=${phone.replace(/[^\d]/g, '')}&text=${encodeURIComponent(message)}`
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp')
    })
  }

  const makeCall = () => {
    const url = `tel:${professional.contactInfo.phone}`
    Linking.openURL(url)
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate("ProfessionalDetail", { professionalId: professional.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Avatar.Image size={60} source={{ uri: professional.user.avatar }} />
            <View style={styles.info}>
              <Text style={styles.name}>{professional.user.name}</Text>
              <Text style={styles.profession}>{professional.profession}</Text>
              <Text style={styles.experience}>
                {professional.experience.years} años de experiencia
              </Text>
              <View style={styles.rating}>
                <Text style={styles.ratingText}>★ {professional.rating}</Text>
                <Text style={styles.location}>• {professional.workLocation.city}</Text>
                {/* ✅ AGREGAR verificación */}
                {professional.verified && (
                  <Chip style={styles.verifiedChip} textStyle={styles.verifiedText}>
                    ✓
                  </Chip>
                )}
              </View>
            </View>
            <View style={styles.rightSection}>
              {professional.rates.hourly && (
                <Text style={styles.rate}>${professional.rates.hourly}/h</Text>
              )}
              {professional.rates.daily && (
                <Text style={styles.rate}>${professional.rates.daily}/día</Text>
              )}
              <Chip style={styles.availabilityChip}>
                {professional.availability.type}
              </Chip>
            </View>
          </View>

          <View style={styles.specialties}>
            {professional.specialties.slice(0, 3).map((specialty, index) => (
              <Chip key={index} style={styles.specialtyChip}>
                {specialty}
              </Chip>
            ))}
            {/* ✅ AGREGAR indicador de más especialidades */}
            {professional.specialties.length > 3 && (
              <Text style={styles.moreSpecialties}>+{professional.specialties.length - 3} más</Text>
            )}
          </View>

          {/* ✅ AGREGAR información adicional */}
          <View style={styles.footer}>
            <Text style={styles.stats}>
              {professional.projectsCompleted} trabajos • {professional.responseTime}
            </Text>
          </View>

          <View style={styles.actions}>
            <Button 
              mode="outlined" 
              style={styles.actionButton} 
              onPress={() => navigation.navigate("ProfessionalDetail", { professionalId: professional.id })}
            >
              Ver perfil
            </Button>
            <Button mode="contained" style={styles.actionButton} onPress={handleContact}>
              Contactar
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}

// ✅ ACTUALIZAR estilos
const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,  // ✅ AGREGAR elevación
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    color: theme.colors.text,  // ✅ AGREGAR color explícito
  },
  profession: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  experience: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#F59E0B",
    marginRight: 4,  // ✅ AJUSTAR margen
  },
  location: {
    fontSize: 10,
    color: theme.colors.placeholder,
    marginRight: 8,  // ✅ AGREGAR margen
  },
  // ✅ AGREGAR estilos nuevos
  verifiedChip: {
    height: 20,
    backgroundColor: theme.colors.success,
  },
  verifiedText: {
    fontSize: 8,
    color: "white",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  rate: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  availabilityChip: {
    height: 24,
    backgroundColor: theme.colors.success,
  },
  specialties: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",  // ✅ AGREGAR
    marginBottom: 12,
  },
  specialtyChip: {
    marginRight: 6,
    marginBottom: 4,
    height: 24,
    backgroundColor: theme.colors.background,  // ✅ CAMBIAR color
  },
  moreSpecialties: {
    fontSize: 10,
    color: theme.colors.placeholder,
    fontStyle: "italic",
  },
  footer: {
    marginBottom: 12,
  },
  stats: {
    fontSize: 11,
    color: theme.colors.placeholder,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,  // ✅ AGREGAR gap
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,  // ✅ AGREGAR border radius
  },
})