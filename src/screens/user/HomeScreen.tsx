"use client"

import { useEffect, useContext } from "react"
import { StyleSheet, View, ScrollView, FlatList } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Text, Avatar, Button, Card, Title, Paragraph, Appbar, Searchbar } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { AuthContext } from "../../context/AuthContext"
import type { RootState } from "../../redux/store"
import { setFeaturedCategories } from "../../redux/slices/categoriesSlice"
import { theme } from "../../theme"
import ServiceCard from "../../components/ServiceCard"
import CategoryButton from "../../components/CategoryButton"

export default function HomeScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { currentUser } = useContext(AuthContext)
  const { items: categories } = useSelector((state: RootState) => state.categories)
  const { popularServices } = useSelector((state: RootState) => state.services)

  useEffect(() => {
    // Set featured categories (first 4)
    dispatch(setFeaturedCategories(categories.slice(0, 4)))
  }, [categories, dispatch])

  const navigateToSearch = () => {
    navigation.navigate("Search" as never)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Avatar.Image size={40} source={{ uri: currentUser?.avatar }} />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Hola,</Text>
              <Text style={styles.userName}>{currentUser?.name}</Text>
            </View>
          </View>
          <Appbar.Action icon="bell" onPress={() => {}} />
        </View>
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Searchbar
            value=""
            placeholder="¿Qué servicio necesitas?"
            onPress={navigateToSearch}
            style={styles.searchbar}
            editable={false}
          />
        </View>

        {/* Hero Banner */}
        <Card style={styles.heroBanner}>
          <Card.Content style={styles.heroContent}>
            <Title style={styles.heroTitle}>¡20% de descuento en tu primer servicio!</Title>
            <Paragraph style={styles.heroSubtitle}>Usa el código PRIMERA20</Paragraph>
            <Button mode="contained" style={styles.heroButton}>
              Ver más
            </Button>
          </Card.Content>
        </Card>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Categorías</Title>
            <Button mode="text" onPress={() => {}}>
              Ver todas
            </Button>
          </View>
          <FlatList
            data={categories.slice(0, 4)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            renderItem={({ item }) => <CategoryButton category={item} onPress={() => {}} />}
          />
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Servicios populares</Title>
            <Button mode="text" onPress={() => {}}>
              Ver todos
            </Button>
          </View>
          <FlatList
            data={popularServices}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesContainer}
            renderItem={({ item }) => <ServiceCard service={item} onPress={() => {}} />}
          />
        </View>

        {/* Promotion Banner */}
        <Card style={styles.promotionCard}>
          <Card.Content style={styles.promotionContent}>
            <Title style={styles.promotionTitle}>¿Eres profesional?</Title>
            <Paragraph style={styles.promotionSubtitle}>
              Regístrate como proveedor y comienza a ofrecer tus servicios
            </Paragraph>
            <Button mode="contained" style={styles.promotionButton}>
              Comenzar ahora
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    elevation: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchbar: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  heroBanner: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.secondary,
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
  },
  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  section: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  categoriesContainer: {
    paddingLeft: 16,
  },
  servicesContainer: {
    paddingLeft: 16,
  },
  promotionCard: {
    margin: 16,
    borderRadius: 16,
  },
  promotionContent: {
    padding: 20,
    alignItems: "center",
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  promotionSubtitle: {
    textAlign: "center",
    marginBottom: 16,
    color: theme.colors.placeholder,
  },
  promotionButton: {
    backgroundColor: theme.colors.primary,
  },
})
