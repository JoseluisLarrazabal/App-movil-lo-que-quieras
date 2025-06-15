import React, { useState, useEffect } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { Text, TextInput, Button, Title, Chip } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch } from "react-redux"
import { createLocalStore, updateLocalStore } from "../../redux/slices/localStoresSlice"
import { theme } from "../../theme"
import { useNavigation, useRoute } from "@react-navigation/native"

export default function AddEditStoreScreen() {
  const dispatch = useDispatch<any>()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { store, mode } = route.params || {}
  const isEditing = mode === "edit"

  // Campos del modelo
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [website, setWebsite] = useState("")
  const [openingHours, setOpeningHours] = useState("")
  const [services, setServices] = useState<string>("")
  const [isActive, setIsActive] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [images, setImages] = useState<string>("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  // Tipos de comercio
  const storeTypes = [
    { label: "Barrio", value: "barrio" },
    { label: "Supermercado", value: "supermercado" },
    { label: "Minimarket", value: "minimarket" },
    { label: "Mercado", value: "mercado" },
    { label: "Otro", value: "otro" },
  ]

  useEffect(() => {
    if (isEditing && store) {
      setName(store.name || "")
      setType(store.type || "")
      setAddress(store.address || "")
      setCity(store.city || "")
      setLat(store.location?.lat?.toString() || "")
      setLng(store.location?.lng?.toString() || "")
      setPhone(store.contact?.phone || "")
      setWhatsapp(store.contact?.whatsapp || "")
      setWebsite(store.contact?.website || "")
      setOpeningHours(store.openingHours || "")
      setServices((store.services || []).join(", "))
      setIsActive(store.isActive !== false)
      setFeatured(store.featured === true)
      setImages((store.images || []).join(", "))
      setDescription(store.description || "")
    }
  }, [isEditing, store])

  const handleSave = async () => {
    // Validación básica
    if (!name || !type || !address || !city || !lat || !lng) {
      Alert.alert("Error", "Completa todos los campos obligatorios: nombre, tipo, dirección, ciudad, latitud y longitud")
      return
    }
    setLoading(true)
    const data = {
      name,
      type,
      address,
      city,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      contact: { phone, whatsapp, website },
      openingHours,
      services: services.split(",").map(s => s.trim()).filter(Boolean),
      isActive,
      featured,
      images: images.split(",").map(s => s.trim()).filter(Boolean),
      description,
    }
    try {
      if (isEditing && store?._id) {
        await dispatch(updateLocalStore({ id: store._id, data })).unwrap()
        Alert.alert("Éxito", "Comercio actualizado correctamente")
      } else {
        await dispatch(createLocalStore(data)).unwrap()
        Alert.alert("Éxito", "Comercio creado correctamente")
      }
      navigation.goBack()
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Error al guardar comercio")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Title style={styles.title}>{isEditing ? "Editar Comercio" : "Agregar Comercio"}</Title>
        <TextInput label="Nombre*" value={name} onChangeText={setName} style={styles.input} />
        <Text style={styles.label}>Tipo de comercio*</Text>
        <View style={styles.chipRow}>
          {storeTypes.map(opt => (
            <Chip key={opt.value} selected={type === opt.value} onPress={() => setType(opt.value)} style={styles.chip}>{opt.label}</Chip>
          ))}
        </View>
        <TextInput label="Dirección*" value={address} onChangeText={setAddress} style={styles.input} />
        <TextInput label="Ciudad*" value={city} onChangeText={setCity} style={styles.input} />
        <View style={styles.row}>
          <TextInput label="Latitud*" value={lat} onChangeText={setLat} style={[styles.input, styles.inputHalf]} keyboardType="numeric" />
          <TextInput label="Longitud*" value={lng} onChangeText={setLng} style={[styles.input, styles.inputHalf]} keyboardType="numeric" />
        </View>
        <TextInput label="Teléfono" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        <TextInput label="WhatsApp" value={whatsapp} onChangeText={setWhatsapp} style={styles.input} keyboardType="phone-pad" />
        <TextInput label="Sitio web" value={website} onChangeText={setWebsite} style={styles.input} />
        <TextInput label="Horario de atención" value={openingHours} onChangeText={setOpeningHours} style={styles.input} />
        <TextInput label="Servicios (separados por coma)" value={services} onChangeText={setServices} style={styles.input} />
        <TextInput label="Imágenes (URLs, separadas por coma)" value={images} onChangeText={setImages} style={styles.input} />
        <TextInput label="Descripción" value={description} onChangeText={setDescription} style={styles.input} multiline numberOfLines={3} />
        <View style={styles.row}>
          <Chip selected={isActive} onPress={() => setIsActive(!isActive)} style={styles.chip}>{isActive ? "Activo" : "Inactivo"}</Chip>
          <Chip selected={featured} onPress={() => setFeatured(!featured)} style={styles.chip}>{featured ? "Destacado" : "No destacado"}</Chip>
        </View>
        <Button mode="contained" style={styles.saveButton} onPress={handleSave} loading={loading} disabled={loading}>
          {isEditing ? "Actualizar" : "Crear"}
        </Button>
        <Button mode="outlined" style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
          Cancelar
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24 },
  input: { marginBottom: 16, backgroundColor: "transparent" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  chip: { marginRight: 8, marginBottom: 8 },
  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
  inputHalf: { flex: 1 },
  saveButton: { marginTop: 16, borderRadius: 12 },
  cancelButton: { marginTop: 8, borderRadius: 12 },
}) 