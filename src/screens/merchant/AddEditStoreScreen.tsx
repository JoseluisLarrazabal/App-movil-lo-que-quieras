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
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [website, setWebsite] = useState("")
  const [openingFrom, setOpeningFrom] = useState("")
  const [openingTo, setOpeningTo] = useState("")
  const [services, setServices] = useState<string>("")
  const [isActive, setIsActive] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [images, setImages] = useState<string>("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 })

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
      setPhone(store.contact?.phone || "")
      setWhatsapp(store.contact?.whatsapp || "")
      setWebsite(store.contact?.website || "")
      if (store.openingHours) {
        const [from, to] = store.openingHours.split("-")
        setOpeningFrom(from || "")
        setOpeningTo(to || "")
      }
      setServices((store.services || []).join(", "))
      setIsActive(store.isActive !== false)
      setFeatured(store.featured === true)
      setImages((store.images || []).join(", "))
      setDescription(store.description || "")
      setLocation({ lat: store.location?.lat || 0, lng: store.location?.lng || 0 })
    }
  }, [isEditing, store])

  const handleSave = async () => {
    // Validación básica
    if (!name || !type || !address || !city) {
      Alert.alert("Error", "Completa todos los campos obligatorios: nombre, tipo, dirección, ciudad")
      return
    }
    if (!openingFrom || !openingTo) {
      Alert.alert("Error", "Completa el horario de atención (desde y hasta)")
      return
    }
    setLoading(true)
    const openingHours = `${openingFrom}-${openingTo}`
    const data = {
      name,
      type,
      address,
      city,
      location: { lat: location.lat, lng: location.lng },
      contact: { phone, whatsapp, website: website || undefined },
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

  const handleSelectLocation = () => {
    navigation.navigate('SelectLocation', {
      initialLocation: location,
      onLocationSelected: (coords: { lat: number; lng: number }) => setLocation(coords)
    })
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
        <Text style={styles.label}>Ubicación:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ flex: 1 }}>Lat: {location.lat?.toFixed(5) || '-'}  Lng: {location.lng?.toFixed(5) || '-'}</Text>
          <Button mode="outlined" onPress={handleSelectLocation} style={{ marginLeft: 8 }}>Seleccionar en el mapa</Button>
        </View>
        <TextInput label="Teléfono" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        <TextInput label="WhatsApp" value={whatsapp} onChangeText={setWhatsapp} style={styles.input} keyboardType="phone-pad" />
        <TextInput label="Sitio web (opcional)" value={website} onChangeText={setWebsite} style={styles.input} keyboardType="url" />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <TextInput label="Horario desde* (ej: 8:00)" value={openingFrom} onChangeText={setOpeningFrom} style={[styles.input, { flex: 1 }]} />
          <TextInput label="Horario hasta* (ej: 22:00)" value={openingTo} onChangeText={setOpeningTo} style={[styles.input, { flex: 1 }]} />
        </View>
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
  saveButton: { marginTop: 16, borderRadius: 12 },
  cancelButton: { marginTop: 8, borderRadius: 12 },
}) 