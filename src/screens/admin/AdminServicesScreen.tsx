import { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Text,
  Card,
  Button,
  Chip,
  Title,
  Menu,
  IconButton,
  Searchbar,
  SegmentedButtons,
  Modal,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  fetchServices,
  updateServiceAsync,
  deleteServiceAsync,
  adminDeleteService,
  adminRestoreService,
} from "../../redux/slices/servicesSlice";
import { fetchCategories } from "../../redux/slices/categoriesSlice";
import { theme } from "../../theme";

export default function AdminServicesScreen() {
  const dispatch: AppDispatch = useDispatch();
  const { items: services, status } = useSelector(
    (state: RootState) => state.services,
  );
  const { items: categories } = useSelector(
    (state: RootState) => state.categories,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState<
    "delete" | "restore" | null
  >(null);
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);
  const [serviceReasons, setServiceReasons] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    let statusParam: "all" | "active" | "inactive" = "all";
    if (selectedStatus === "active") statusParam = "active";
    else if (selectedStatus === "inactive") statusParam = "inactive";
    dispatch(fetchServices({ status: statusParam }));
    dispatch(fetchCategories());
  }, [dispatch, selectedStatus]);

  const filteredServices = services.filter((service) => {
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && service.isActive !== false && !service.adminDeleted) ||
      (selectedStatus === "inactive" && (service.isActive === false || service.adminDeleted));
    const matchesCategory =
      !selectedCategory || service.category.id === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleDelete = async (id: string, reason: string) => {
    try {
      await dispatch(adminDeleteService({ id, reason }) as any).unwrap();
      setServiceReasons((prev) => ({ ...prev, [id]: reason }));
      Alert.alert("Éxito", "Servicio eliminado (soft delete)");
    } catch (error) {
      Alert.alert(
        "Error",
        (error as any)?.message || "No se pudo eliminar el servicio",
      );
    }
  };

  const handleRestore = async (service: any, reason: string) => {
    try {
      await dispatch(adminRestoreService(service.id) as any).unwrap();
      setServiceReasons((prev) => ({ ...prev, [service.id]: reason }));
      Alert.alert("Éxito", "Servicio restaurado");
    } catch (error) {
      Alert.alert(
        "Error",
        (error as any)?.message || "No se pudo restaurar el servicio",
      );
    }
  };

  const renderServiceItem = ({ item }: { item: any }) => (
    <Card style={styles.serviceCard}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Title style={styles.title}>{item.title}</Title>
          <Menu
            visible={visibleMenu === item.id}
            onDismiss={() => setVisibleMenu(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setVisibleMenu(item.id)}
              />
            }
          >
            {item.isActive !== false && !item.adminDeleted ? (
              <Menu.Item
                onPress={() => {
                  setPendingServiceId(item.id);
                  setShowReasonModal("delete");
                  setVisibleMenu(null);
                }}
                title="Eliminar"
                leadingIcon="delete"
              />
            ) : (
              <Menu.Item
                onPress={() => {
                  setPendingServiceId(item.id);
                  setShowReasonModal("restore");
                  setVisibleMenu(null);
                }}
                title="Restaurar"
                leadingIcon="backup-restore"
              />
            )}
          </Menu>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.metaRow}>
          <Chip style={styles.chip}>{item.category.name}</Chip>
          <Chip
            style={[
              styles.chip,
              {
                backgroundColor:
                  item.isActive !== false
                    ? theme.colors.success
                    : theme.colors.error,
              },
            ]}
          >
            {item.isActive !== false ? "Activo" : "Inactivo"}
          </Chip>
        </View>
        <Button
          mode="text"
          onPress={() => {
            setSelectedService(item);
            setShowDetailModal(true);
          }}
          style={{ marginTop: 8 }}
        >
          Ver detalle
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Gestión de Servicios</Title>
        <Text style={styles.headerSubtitle}>
          {filteredServices.length} servicios
        </Text>
      </View>
      <View style={styles.filtersRow}>
        <Searchbar
          placeholder="Buscar servicios..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <SegmentedButtons
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          buttons={[
            { value: "all", label: "Todos" },
            { value: "active", label: "Activos" },
            { value: "inactive", label: "Inactivos" },
          ]}
          style={styles.segmentedButtons}
        />
        <FlatList
          data={categories}
          keyExtractor={(cat) => cat._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item._id}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === item._id ? null : item._id,
                )
              }
              style={styles.chip}
            >
              {item.name}
            </Chip>
          )}
          style={styles.categoriesList}
        />
      </View>
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={renderServiceItem}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron servicios</Text>
        }
      />
      <Modal
        visible={showReasonModal !== null}
        onDismiss={() => {
          setShowReasonModal(null);
          setDeleteReason("");
          setPendingServiceId(null);
        }}
        contentContainerStyle={{
          backgroundColor: "white",
          margin: 24,
          borderRadius: 16,
          padding: 20,
        }}
      >
        <Title>
          {showReasonModal === "delete"
            ? "Motivo de eliminación"
            : "Motivo de restauración"}
        </Title>
        <TextInput
          label="Motivo (opcional)"
          value={deleteReason}
          onChangeText={setDeleteReason}
          style={{ marginBottom: 16 }}
          multiline
        />
        <Button
          mode="contained"
          onPress={() => {
            if (pendingServiceId && showReasonModal === "delete")
              handleDelete(pendingServiceId, deleteReason);
            if (pendingServiceId && showReasonModal === "restore")
              handleRestore(
                services.find((s) => s.id === pendingServiceId),
                deleteReason,
              );
            setShowReasonModal(null);
            setDeleteReason("");
            setPendingServiceId(null);
          }}
        >
          Confirmar
        </Button>
        <Button
          mode="text"
          onPress={() => {
            setShowReasonModal(null);
            setDeleteReason("");
            setPendingServiceId(null);
          }}
          style={{ marginTop: 8 }}
        >
          Cancelar
        </Button>
      </Modal>
      <Modal
        visible={showDetailModal}
        onDismiss={() => setShowDetailModal(false)}
        contentContainerStyle={{
          backgroundColor: "white",
          margin: 24,
          borderRadius: 16,
          padding: 20,
        }}
      >
        {selectedService && (
          <View>
            <Title>{selectedService.title}</Title>
            <Text style={{ marginBottom: 8 }}>
              {selectedService.description}
            </Text>
            <Text>Categoría: {selectedService.category.name}</Text>
            <Text>Proveedor: {selectedService.provider?.name || "N/A"}</Text>
            <Text>
              Estado:{" "}
              {selectedService.isActive !== false ? "Activo" : "Inactivo"}
            </Text>
            {selectedService.images && selectedService.images.length > 0 && (
              <FlatList
                data={selectedService.images}
                keyExtractor={(img, idx) => img + idx}
                horizontal
                renderItem={({ item }) => (
                  <View style={{ marginRight: 8 }}>
                    <Card.Cover
                      source={{ uri: item }}
                      style={{ width: 100, height: 60, borderRadius: 8 }}
                    />
                  </View>
                )}
                style={{ marginVertical: 8 }}
              />
            )}
            {serviceReasons[selectedService.id] && (
              <Text style={{ marginTop: 12, color: theme.colors.placeholder }}>
                Motivo admin: {serviceReasons[selectedService.id]}
              </Text>
            )}
            <Button
              mode="outlined"
              onPress={() => setShowDetailModal(false)}
              style={{ marginTop: 16 }}
            >
              Cerrar
            </Button>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  filtersRow: { paddingHorizontal: 16, marginBottom: 8 },
  searchbar: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 8,
  },
  segmentedButtons: { backgroundColor: theme.colors.surface, marginBottom: 8 },
  categoriesList: { marginBottom: 8 },
  servicesList: { paddingHorizontal: 16, paddingBottom: 20 },
  serviceCard: { marginBottom: 16, borderRadius: 12 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "bold", color: theme.colors.text },
  description: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  metaRow: { flexDirection: "row", gap: 8 },
  chip: { marginRight: 8, height: 24 },
  emptyText: {
    textAlign: "center",
    color: theme.colors.placeholder,
    marginTop: 40,
  },
});
 