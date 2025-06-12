// utils/contactHelpers.ts
import { Linking, Alert } from 'react-native'

export const contactProfessional = {
  whatsapp: (phone: string, message?: string) => {
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message || 'Hola, vi tu perfil en Lo Que Quieras')}`
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp')
    })
  },
  
  call: (phone: string) => {
    const url = `tel:${phone}`
    Linking.openURL(url)
  },
  
  email: (email: string, subject?: string) => {
    const url = `mailto:${email}?subject=${encodeURIComponent(subject || 'Contacto desde Lo Que Quieras')}`
    Linking.openURL(url)
  }
}