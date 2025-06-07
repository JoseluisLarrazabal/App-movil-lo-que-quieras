"use client"

import { useState } from "react"
import { StyleSheet, View, ScrollView, Alert } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { useSelector, useDispatch } from "react-redux"
import { TextInput, Button, Card, Title, Paragraph, Chip, Appbar, Menu } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState } from "../../redux/store"
import { addService, updateService } from "../../redux/slices/servicesSlice"
import { theme } from "../../theme"

export default function AddServiceScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { items: categories } = useSelector((state: RootState) => state.categories)

  const { serviceId, mode } = (route.params as { serviceId?: string; mode?: "edit" }) || {}
  const isEditing = mode === "edit"

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [duration, setDuration] = useState("")
  const [includesMaterials, setIncludesMaterials] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)

  const handleSaveService = () => {
    if (!title || !description || !price || !selectedCategory) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios")
      return
    }

    const serviceData = {
      id: isEditing ? serviceId! : Date.now().toString(),
      title,
      description,
      price: Number.parseFloat(price),
      rating: 0,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      category: {
        id: selectedCategory.id,
        name: selectedCategory.name,
      },
      provider: {
        id: "1", // Current provider ID
        name: "María García",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 4.9,
      },
      location: {
        lat: -34.6037,
        lng: -58.3816,
        address: "Buenos Aires, Argentina",
      },
    }

    if (isEditing) {
      dispatch(updateService(serviceData))
      Alert.alert("Éxito", "Servicio actualizado correctamente")
    } else {
      dispatch(addService(serviceData))
      Alert.alert("Éxito", "Servicio creado correctamente")
    }

    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? "Editar servicio" : "Agregar servicio"} />
        <Appbar.Action icon="check" onPress={handleSaveService} />
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Información básica</Title>

            <TextInput
              label="Título del servicio *"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="Ej: Limpieza profunda de hogar"
            />

            <TextInput
              label="Descripción *"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Describe detalladamente tu servicio..."
            />

            <Menu
              visible={showCategoryMenu}
              onDismiss={() => setShowCategoryMenu(false)}
              anchor={
                <TextInput
                  label="Categoría *"
                  value={selectedCategory?.name || ""}
                  style={styles.input}
                  editable={false}
                  right={<TextInput.Icon icon="chevron-down" onPress={() => setShowCategoryMenu(true)} />}
                  placeholder="Selecciona una categoría"
                />
              }
            >
              {categories.map((category) => (
                <Menu.Item
                  key={category.id}
                  onPress={() => {
                    setSelectedCategory(category)
                    setShowCategoryMenu(false)
                  }}
                  title={`${category.icon} ${category.name}`}
                />
              ))}
            </Menu>

            <TextInput
              label="Precio *"
              value={price}
              onChangeText={setPrice}
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              left={<TextInput.Affix text="$" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Detalles adicionales</Title>

            <TextInput
              label="Duración estimada"
              value={duration}
              onChangeText={setDuration}
              style={styles.input}
              placeholder="Ej: 2-3 horas"
            />

            <View style={styles.checkboxContainer}>
              <Chip
                selected={includesMaterials}
                onPress={() => setIncludesMaterials(!includesMaterials)}
                style={styles.checkbox}
              >
                Incluye materiales
              </Chip>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Vista previa</Title>
            <Paragraph style={styles.previewText}>Así es como verán tu servicio los clientes:</Paragraph>

            <Card style={styles.previewCard}>
              <Card.Content>
                <Title style={styles.previewTitle}>{title || "Título del servicio"}</Title>
                <Paragraph style={styles.previewDescription}>{description || "Descripción del servicio"}</Paragraph>
                <View style={styles.previewFooter}>
                  <Chip style={styles.previewCategory}>{selectedCategory?.name || "Categoría"}</Chip>
                  <Title style={styles.previewPrice}>${price || "0"}</Title>
                </View>
              </Card.Content>
            </Card>
          </Card.Content>
        </Card>

        <View style={styles.bottomActions}>
          <Button mode="outlined" style={styles.cancelButton} onPress={() => navigation.goBack()}>
            Cancelar
          </Button>
          <Button mode="contained" style={styles.saveButton} onPress={handleSaveService}>
            {isEditing ? "Actualizar" : "Crear servicio"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formCard: {
    margin: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  checkboxContainer: {
    marginTop: 8,
  },
  checkbox: {
    alignSelf: "flex-start",
  },
  previewText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    marginBottom: 12,
    color: theme.colors.onSurface,
  },
  previewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewCategory: {
    backgroundColor: theme.colors.primary,
  },
  previewPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  bottomActions: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
  },
})
