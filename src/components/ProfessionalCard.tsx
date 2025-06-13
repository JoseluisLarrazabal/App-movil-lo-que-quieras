// components/ProfessionalCard.tsx
import { StyleSheet, View, TouchableOpacity, Linking, Alert } from "react-native"
import { Card, Avatar, Text, Chip, Button } from "react-native-paper"
import { theme } from "../theme"
import type { Professional } from "../redux/slices/professionalsSlice"
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { UserTabParamList } from "../navigation/types";
import type { RootStackParamList } from "../navigation/types";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList, 'Professionals'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ProfessionalCardProps {
  professional: Professional
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const navigation = useNavigation<NavigationProp>();
  
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
    <TouchableOpacity onPress={() => navigation.navigate("ProfessionalDetail", { professionalId: professional._id })}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          {/* Header principal */}
          <View style={styles.header}>
            <Avatar.Image size={50} source={{ uri: professional.user.avatar }} />
            
            <View style={styles.mainInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {professional.user.name}
                </Text>
                {professional.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.profession} numberOfLines={1}>
                {professional.profession}
              </Text>
              
              <View style={styles.metaRow}>
                <Text style={styles.experience}>
                  {professional.experience.years} años exp.
                </Text>
                <Text style={styles.rating}>
                  ★ {professional.rating}
                </Text>
                <Text style={styles.location} numberOfLines={1}>
                  {professional.workLocation.city}
                </Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              {professional.rates.hourly && (
                <Text style={styles.price}>${professional.rates.hourly}/h</Text>
              )}
              {professional.rates.daily && (
                <Text style={styles.priceSecondary}>${professional.rates.daily}/día</Text>
              )}
              <View style={styles.availabilityChip}>
                <Text style={styles.chipText}>
                  {professional.availability.type}
                </Text>
              </View>
            </View>
          </View>

          {/* Especialidad principal */}
          <View style={styles.specialtyContainer}>
            <Text style={styles.specialtyLabel}>Especialidad:</Text>
            <Text style={styles.specialtyValue} numberOfLines={1}>
              {professional.specialties[0]}
              {professional.specialties.length > 1 && ` +${professional.specialties.length - 1} más`}
            </Text>
          </View>

          {/* Botones de acción */}
          <View style={styles.actions}>
            <Button 
              mode="outlined" 
              style={styles.outlinedButton}
              labelStyle={styles.buttonText}
              onPress={() => navigation.navigate("ProfessionalDetail", { professionalId: professional._id })}
            >
              Ver perfil
            </Button>
            <Button 
              mode="contained" 
              style={styles.containedButton}
              labelStyle={styles.buttonText}
              onPress={handleContact}
            >
              Contactar
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  mainInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    flex: 1,
    marginRight: 6,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 10,
    color: "white",
    fontWeight: 'bold',
  },
  profession: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  experience: {
    fontSize: 11,
    color: theme.colors.placeholder,
  },
  rating: {
    fontSize: 11,
    color: "#F59E0B",
    fontWeight: '600',
  },
  location: {
    fontSize: 11,
    color: theme.colors.placeholder,
    flex: 1,
  },
  priceContainer: {
    alignItems: "flex-end",
    minWidth: 75,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 2,
  },
  priceSecondary: {
    fontSize: 11,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  availabilityChip: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 24,
    alignSelf: 'flex-end',
  },
  chipText: {
    fontSize: 10,
    color: "white",
    fontWeight: '600',
    textAlign: 'center',
  },
  specialtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  specialtyLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginRight: 6,
    fontWeight: '500',
  },
  specialtyValue: {
    fontSize: 12,
    color: theme.colors.text,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  outlinedButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 2,
  },
  containedButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 2,
  },
  buttonText: {
    fontSize: 12,
  },
})