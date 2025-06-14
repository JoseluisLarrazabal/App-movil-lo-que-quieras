"use client"

import { useState, useContext, useEffect } from "react"
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../navigation/types"
import { useSelector, useDispatch } from "react-redux"
import { TextInput, Button, Card, Title, Paragraph, Chip, Appbar, Menu } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState, AppDispatch } from "../../redux/store"
import { createService, updateServiceAsync } from "../../redux/slices/servicesSlice"
import { theme } from "../../theme"
import { AuthContext } from "../../context/AuthContext"
import { fetchCategories } from "../../redux/slices/categoriesSlice"

type AddServiceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "AddService">

// Copia de iconMap de CategoryButton
const iconMap: Record<string, string> = {
  broom: "🧹",
  wrench: "🔧",
  "lightning-bolt": "⚡",
  hammer: "🔨",
  tree: "🌱",
  brush: "🎨",
  car: "🚗",
  laptop: "💻",
  heart: "❤️",
  school: "🏫",
}

export default function AddServiceScreen() {
  const route = useRoute()
  const navigation = useNavigation<AddServiceScreenNavigationProp>()
  const dispatch: AppDispatch = useDispatch()
  const { items: categories } = useSelector((state: RootState) => state.categories)
  const { items: services } = useSelector((state: RootState) => state.services)
  const { currentUser } = useContext(AuthContext)

  const { serviceId, mode } = (route.params as { serviceId?: string; mode?: "edit" }) || {}
  const isEditing = mode === "edit"

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [duration, setDuration] = useState("")
  const [includesMaterials, setIncludesMaterials] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar categorías reales al montar
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories())
    }
    // Si es edición, cargar datos del servicio
    if (isEditing && serviceId) {
      const service = services.find(s => s.id === serviceId)
      if (service) {
        setTitle(service.title || "")
        setDescription(service.description || "")
        setPrice(service.price?.toString() || "")
        setDuration((service as any).duration?.toString() || "")
        setSelectedCategory(categories.find(c => c._id === (service.category?.id || service.category)) || null)
        setIncludesMaterials((service as any).features?.includes("Incluye materiales") || false)
      } else {
        Alert.alert("Error", "No se encontró el servicio a editar")
        navigation.goBack()
      }
    } else if (!isEditing) {
      setTitle("")
      setDescription("")
      setPrice("")
      setDuration("")
      setSelectedCategory(null)
      setIncludesMaterials(false)
    }
  }, [dispatch, isEditing, serviceId, categories, services])

  const handleSaveService = async () => {
    if (!title || !description || !price || !selectedCategory) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios")
      return
    }
    setIsLoading(true)
    try {
      if (isEditing && serviceId) {
        await dispatch(updateServiceAsync({
          id: serviceId,
          data: {
            title,
            description,
            price: Number.parseFloat(price),
            duration: Number.parseInt(duration) || 60,
            category: selectedCategory._id,
            images: [
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
            ],
            features: includesMaterials ? ["Incluye materiales"] : []
          }
        }) as any).unwrap()
        Alert.alert("Éxito", "Servicio actualizado correctamente")
      } else {
        await dispatch(createService({
          title,
          description,
          price: Number.parseFloat(price),
          duration: Number.parseInt(duration) || 60,
          category: selectedCategory._id,
          images: [
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
          ],
          features: includesMaterials ? ["Incluye materiales"] : []
        }) as any).unwrap()
        Alert.alert("Éxito", "Servicio creado correctamente")
      }
      // Limpiar formulario
      setTitle("")
      setDescription("")
      setPrice("")
      setSelectedCategory(null)
      setDuration("")
      setIncludesMaterials(false)
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", (error as any)?.message || (isEditing ? "Error al actualizar servicio" : "Error al crear servicio"))
    } finally {
      setIsLoading(false)
    }
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
                <TouchableOpacity onPress={() => setShowCategoryMenu(true)} activeOpacity={0.8} style={[styles.input, styles.categoryInputTouchable]}>
                  <View style={styles.categoryInputContent}>
                    <View style={[styles.categoryIconBox, { backgroundColor: selectedCategory?.color || theme.colors.disabled }]}> 
                      <Paragraph style={styles.categoryIcon}>{iconMap[selectedCategory?.icon] || "❓"}</Paragraph>
                    </View>
                    <Paragraph style={{ color: selectedCategory ? theme.colors.text : theme.colors.placeholder, flex: 1, fontSize: 15 }}>
                      {selectedCategory?.name || "Selecciona una categoría"}
                    </Paragraph>
                  </View>
                </TouchableOpacity>
              }
            >
              {categories.map((category) => (
                <Menu.Item
                  key={category._id}
                  onPress={() => {
                    setSelectedCategory(category)
                    setShowCategoryMenu(false)
                  }}
                  title={
                    <View style={styles.menuCategoryRow}>
                      <View style={[styles.categoryIconBox, { backgroundColor: category.color || theme.colors.disabled }]}> 
                        <Paragraph style={styles.categoryIcon}>{iconMap[category.icon] || "❓"}</Paragraph>
                      </View>
                      <Paragraph style={styles.menuCategoryName}>{category.name}</Paragraph>
                    </View>
                  }
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
          <Button mode="contained" style={styles.saveButton} onPress={handleSaveService} loading={isLoading} disabled={isLoading}>
            {isEditing ? "Actualizar" : isLoading ? "Creando..." : "Crear servicio"}
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
  categoryInputTouchable: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  categoryInputContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
  },
  categoryIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  categoryIcon: {
    fontSize: 18,
    textAlign: "center",
  },
  menuCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuCategoryName: {
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: 4,
  },
})
