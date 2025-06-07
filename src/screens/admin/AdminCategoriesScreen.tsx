"use client"

import { useState } from "react"
import { StyleSheet, View, FlatList, Alert } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import {
  Text,
  Card,
  Button,
  FAB,
  Searchbar,
  Menu,
  IconButton,
  Title,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import type { RootState } from "../../redux/store"
import { theme } from "../../theme"

export default function AdminCategoriesScreen() {
  const dispatch = useDispatch()
  const { items: categories } = useSelector((state: RootState) => state.categories)

  const [searchQuery, setSearchQuery] = useState("")
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  // Form states
  const [categoryName, setCategoryName] = useState("")
  const [categoryIcon, setCategoryIcon] = useState("")
  const [categoryColor, setCategoryColor] = useState("#E3F2FD")

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryName("")
    setCategoryIcon("")
    setCategoryColor("#E3F2FD")
    setShowAddModal(true)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setCategoryIcon(category.icon)
    setCategoryColor(category.color)
    setShowAddModal(true)
    setVisibleMenu(null)
  }

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert(
      "Eliminar categoría",
      "¿Estás seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // Dispatch delete action
            setVisibleMenu(null)
          },
        },
      ],
    )
  }

  const handleSaveCategory = () => {
    if (!categoryName || !categoryIcon) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (editingCategory) {
      // Update existing category
      console.log("Updating category:", editingCategory.id)
    } else {
      // Add new category
      console.log("Adding new category")
    }

    setShowAddModal(false)
    Alert.alert("Éxito", editingCategory ? "Categoría actualizada" : "Categoría creada")
  }

  const colorOptions = ["#E3F2FD", "#F3E5F5", "#E8F5E8", "#FFF3E0", "#FCE4EC", "#F1F8E9", "#FFF8E1", "#E0F2F1"]

  const renderCategoryItem = ({ item }: { item: any }) => (
    <Card style={styles.categoryCard}>
      <Card.Content>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.serviceCount}>{item.serviceCount} servicios</Text>
          </View>

          <Menu
            visible={visibleMenu === item.id}
            onDismiss={() => setVisibleMenu(null)}
            anchor={<IconButton icon="dots-vertical" onPress={() => setVisibleMenu(item.id)} />}
          >
            <Menu.Item onPress={() => handleEditCategory(item)} title="Editar" leadingIcon="pencil" />
            <Menu.Item onPress={() => handleDeleteCategory(item.id)} title="Eliminar" leadingIcon="delete" />
          </Menu>
        </View>

        <View style={styles.categoryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.serviceCount}</Text>
            <Text style={styles.statLabel}>Servicios activos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Proveedores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Reservas este mes</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Gestión de Categorías</Title>
        <Text style={styles.headerSubtitle}>{filteredCategories.length} categorías</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar categorías..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoriesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No hay categorías</Text>
            <Text style={styles.emptyText}>Agrega la primera categoría para comenzar</Text>
            <Button mode="contained" style={styles.emptyButton} onPress={handleAddCategory}>
              Agregar categoría
            </Button>
          </View>
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={handleAddCategory} label="Agregar categoría" />

      {/* Add/Edit Category Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>{editingCategory ? "Editar categoría" : "Agregar categoría"}</Title>

          <TextInput
            label="Nombre de la categoría"
            value={categoryName}
            onChangeText={setCategoryName}
            style={styles.modalInput}
            placeholder="Ej: Limpieza"
          />

          <TextInput
            label="Icono (emoji)"
            value={categoryIcon}
            onChangeText={setCategoryIcon}
            style={styles.modalInput}
            placeholder="🧹"
          />

          <Text style={styles.colorLabel}>Color de fondo:</Text>
          <View style={styles.colorPicker}>
            {colorOptions.map((color) => (
              <Button
                key={color}
                mode={categoryColor === color ? "contained" : "outlined"}
                style={[styles.colorOption, { backgroundColor: color }]}
                onPress={() => setCategoryColor(color)}
              >
                {categoryColor === color ? "✓" : ""}
              </Button>
            ))}
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Vista previa:</Text>
            <View style={styles.previewCategory}>
              <View style={[styles.previewIcon, { backgroundColor: categoryColor }]}>
                <Text style={styles.previewIconText}>{categoryIcon || "?"}</Text>
              </View>
              <Text style={styles.previewName}>{categoryName || "Nombre"}</Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => setShowAddModal(false)} style={styles.modalButton}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={handleSaveCategory} style={styles.modalButton}>
              {editingCategory ? "Actualizar" : "Crear"}
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchbar: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  serviceCount: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  categoryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.placeholder,
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 12,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    minWidth: 40,
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
  },
  previewCategory: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  previewIconText: {
    fontSize: 16,
  },
  previewName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
})
