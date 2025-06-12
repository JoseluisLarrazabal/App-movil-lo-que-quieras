"use client"

import { useState } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Text, TextInput, Button, Title, Chip } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch } from "react-redux"
import { addProfessional } from "../../redux/slices/professionalsSlice"
import { theme } from "../../theme"
import { useNavigation } from "@react-navigation/native"

export default function CreateProfessionalProfileScreen() {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  // Campos de formulario
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("https://randomuser.me/api/portraits/men/31.jpg")
  const [profession, setProfession] = useState("")
  const [specialties, setSpecialties] = useState("")
  const [experienceYears, setExperienceYears] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [rate, setRate] = useState("")
  const [availability, setAvailability] = useState<"full-time" | "part-time" | "freelance" | "contract">("full-time")
  const [skills, setSkills] = useState("")
  
  function handleSubmit() {
    if (!name || !profession || !phone || !city)
      return Alert.alert("Error", "Completa todos los campos obligatorios")

    dispatch(addProfessional({
      id: Date.now().toString(),
      user: { name, avatar },
      profession,
      specialties: specialties.split(",").map(s => s.trim()).filter(Boolean),
      experience: { years: Number(experienceYears) },
      rating: 0,
      reviewsCount: 0,
      projectsCompleted: 0,
      rates: { hourly: Number(rate) },
      workLocation: { city },
      availability: { type: availability, remote: false },
      contactInfo: { phone },
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      verified: false,
      isActive: true,
      responseTime: "<24 horas"
    }))
    Alert.alert("¡Listo!", "Perfil creado correctamente", [
      { text: "Ir a Profesionales", onPress: () => navigation.goBack() }
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Title style={styles.title}>Crear Perfil Profesional</Title>
        
        <TextInput
          label="Nombre completo"
          value={name}
          onChangeText={setName}
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />
        <TextInput
          label="URL de Foto (opcional)"
          value={avatar}
          onChangeText={setAvatar}
          style={styles.input}
          left={<TextInput.Icon icon="image" />}
        />
        <TextInput
          label="Profesión u oficio"
          value={profession}
          onChangeText={setProfession}
          style={styles.input}
          left={<TextInput.Icon icon="briefcase" />}
          placeholder="Ej: Soldador"
        />
        <TextInput
          label="Especialidades (separadas por ,)"
          value={specialties}
          onChangeText={setSpecialties}
          style={styles.input}
          left={<TextInput.Icon icon="star" />}
          placeholder="Ej: Soldadura TIG, MIG, diseño"
        />
        <TextInput
          label="Años de experiencia"
          value={experienceYears}
          onChangeText={setExperienceYears}
          style={styles.input}
          left={<TextInput.Icon icon="calendar" />}
          keyboardType="numeric"
        />
        <TextInput
          label="Teléfono/WhatsApp"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          left={<TextInput.Icon icon="phone" />}
          keyboardType="phone-pad"
        />
        <TextInput
          label="Ciudad"
          value={city}
          onChangeText={setCity}
          style={styles.input}
          left={<TextInput.Icon icon="city" />}
        />
        <TextInput
          label="Tarifa por hora (opcional)"
          value={rate}
          onChangeText={setRate}
          style={styles.input}
          left={<TextInput.Icon icon="cash" />}
          keyboardType="numeric"
          placeholder="Ej: 1000"
        />
        <Text style={styles.label}>Disponibilidad:</Text>
        <View style={styles.chipContainer}>
          {["full-time","part-time","freelance","contract"].map(opt => (
            <Chip key={opt}
              selected={availability===opt}
              onPress={()=>setAvailability(opt as any)}
              style={styles.chip}
            >{{
              "full-time":"Tiempo completo",
              "part-time":"Medio tiempo",
              "freelance":"Freelance",
              "contract":"Por proyecto"
            }[opt]}</Chip>
          ))}
        </View>
        <TextInput
          label="Habilidades (separadas por ,)"
          value={skills}
          onChangeText={setSkills}
          style={styles.input}
          left={<TextInput.Icon icon="tools" />}
          placeholder="Ej: lectura de planos, plomería"
        />

        <Button
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          Publicar Perfil
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  input: { marginBottom: 16, backgroundColor: "transparent" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 8, marginTop: 16 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  chip: { marginRight: 8, marginBottom: 8 },
  submitButton: { marginTop: 16, borderRadius: 12 },
})