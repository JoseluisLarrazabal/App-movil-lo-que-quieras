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
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Avatar.Image 
                size={48} 
                source={{ uri: currentUser?.avatar || 'https://via.placeholder.com/48' }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>¡Hola!</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {currentUser?.name || 'Usuario'}
              </Text>
            </View>
          </View>
          <View style={styles.notificationContainer}>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
            <Appbar.Action 
              icon="bell-outline" 
              iconColor="white"
              size={26}
              onPress={() => {}} 
              style={styles.notificationButton}
            />
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.searchLabel}>¿Qué necesitas hoy?</Text>
          <View style={styles.searchContainer}>
            <Searchbar
              value=""
              placeholder="Buscar servicios, profesionales..."
              onPress={navigateToSearch}
              style={styles.searchbar}
              inputStyle={styles.searchInput}
              iconColor={theme.colors.primary}
              editable={false}
            />
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroContainer}>
          <View style={styles.heroBackground}>
            <View style={styles.heroBubble1} />
            <View style={styles.heroBubble2} />
            <View style={styles.heroBubble3} />
          </View>
          <Card style={styles.heroBanner} mode="elevated">
            <Card.Content style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>🔥 20% OFF</Text>
                </View>
                <Title style={styles.heroTitle}>
                  ¡Descuento especial!
                </Title>
                <Paragraph style={styles.heroSubtitle}>
                  En tu primer servicio con código PRIMERA20
                </Paragraph>
                <Button 
                  mode="contained" 
                  style={styles.heroButton}
                  labelStyle={styles.heroButtonLabel}
                  contentStyle={styles.heroButtonContent}
                  icon="arrow-right"
                >
                  Usar ahora
                </Button>
              </View>
              <View style={styles.heroRight}>
                <View style={styles.heroIconContainer}>
                  <View style={styles.heroIcon}>
                    <Text style={styles.heroEmoji}>🎉</Text>
                  </View>
                  <View style={styles.heroGlow} />
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Title style={styles.sectionTitle}>✨ Categorías populares</Title>
              <Text style={styles.sectionSubtitle}>Encuentra lo que buscas rápidamente</Text>
            </View>
            <Button 
              mode="text" 
              labelStyle={styles.sectionButtonLabel}
              onPress={() => {}}
              icon="arrow-right"
            >
              Ver todas
            </Button>
          </View>
          <FlatList
            data={categories.slice(0, 4)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            renderItem={({ item }) => (
              <View style={styles.categoryItemWrapper}>
                <CategoryButton category={item} onPress={() => {}} />
              </View>
            )}
          />
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Title style={styles.sectionTitle}>🔥 Más solicitados</Title>
              <Text style={styles.sectionSubtitle}>Los favoritos de nuestros usuarios</Text>
            </View>
            <Button 
              mode="text" 
              labelStyle={styles.sectionButtonLabel}
              onPress={() => {}}
              icon="arrow-right"
            >
              Ver todos
            </Button>
          </View>
          <FlatList
            data={popularServices}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesContainer}
            renderItem={({ item }) => (
              <View style={styles.serviceItemWrapper}>
                <ServiceCard service={item} onPress={() => {}} />
              </View>
            )}
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Card style={styles.statsCard} mode="elevated">
            <Card.Content style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>🛠️</Text>
                </View>
                <Text style={styles.statNumber}>500+</Text>
                <Text style={styles.statLabel}>Servicios</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>👥</Text>
                </View>
                <Text style={styles.statNumber}>10k+</Text>
                <Text style={styles.statLabel}>Usuarios</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>⭐</Text>
                </View>
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Promotion Banner */}
        <View style={styles.promotionSection}>
          <View style={styles.promotionBackground}>
            <View style={styles.promotionPattern1} />
            <View style={styles.promotionPattern2} />
          </View>
          <Card style={styles.promotionCard} mode="elevated">
            <Card.Content style={styles.promotionContent}>
              <View style={styles.promotionHeader}>
                <View style={styles.promotionIconContainer}>
                  <View style={styles.promotionIcon}>
                    <Text style={styles.promotionEmoji}>👨‍💼</Text>
                  </View>
                  <View style={styles.promotionIconGlow} />
                </View>
                <View style={styles.promotionTextContainer}>
                  <Title style={styles.promotionTitle}>¿Eres profesional?</Title>
                  <Paragraph style={styles.promotionSubtitle}>
                    Únete a nuestra comunidad de expertos y comienza a generar ingresos
                  </Paragraph>
                </View>
              </View>
              <Button 
                mode="contained" 
                style={styles.promotionButton}
                labelStyle={styles.promotionButtonLabel}
                contentStyle={styles.promotionButtonContent}
                icon="arrow-right"
              >
                Comenzar ahora
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120, // Space for fixed header
  },
  
  // Fixed Header Styles
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: theme.colors.primary,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    borderRadius: 28,
    padding: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  avatar: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: 'white',
  },
  welcomeContainer: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: '600',
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
    marginTop: 2,
  },
  notificationContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    width: 48,
    height: 48,
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  searchLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 16,
  },
  searchContainer: {
    position: 'relative',
  },
  searchbar: {
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  searchInput: {
    fontSize: 16,
    paddingLeft: 12,
  },

  // Hero Banner
  heroContainer: {
    position: 'relative',
    margin: 24,
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroBubble1: {
    position: 'absolute',
    top: -20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroBubble2: {
    position: 'absolute',
    bottom: -10,
    left: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroBubble3: {
    position: 'absolute',
    top: 40,
    left: -15,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  heroBanner: {
    borderRadius: 24,
    backgroundColor: '#667eea',
    elevation: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  heroContent: {
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLeft: {
    flex: 1,
  },
  heroRight: {
    marginLeft: 20,
  },
  discountBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    alignSelf: 'flex-start',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  discountText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  heroButtonLabel: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  heroButtonContent: {
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  heroIconContainer: {
    position: 'relative',
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroEmoji: {
    fontSize: 32,
  },

  // Section Styles
  section: {
    marginTop: 32,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: theme.colors.placeholder,
    fontWeight: '500',
  },
  sectionButtonLabel: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  categoriesContainer: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  categoryItemWrapper: {
    marginRight: 16,
  },
  servicesContainer: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  serviceItemWrapper: {
    marginRight: 16,
  },

  // Stats Section - ACTUALIZADOS CON ANCHO FIJO
  statsSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
  },
  statsCard: {
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  statsContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Cambiado para distribuir uniformemente
  },
  statItem: {
    alignItems: 'center',
    width: 80, // ANCHO FIJO para todos los elementos
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statIcon: {
    fontSize: 18,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    fontWeight: '600',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  // Promotion Section
  promotionSection: {
    position: 'relative',
    margin: 24,
  },
  promotionBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  promotionPattern1: {
    position: 'absolute',
    top: -10,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  promotionPattern2: {
    position: 'absolute',
    bottom: -5,
    left: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
  },
  promotionCard: {
    borderRadius: 24,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  promotionContent: {
    padding: 28,
  },
  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  promotionIconContainer: {
    position: 'relative',
    marginRight: 20,
  },
  promotionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  promotionIconGlow: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 38,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  promotionEmoji: {
    fontSize: 28,
  },
  promotionTextContainer: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    color: theme.colors.text,
  },
  promotionSubtitle: {
    fontSize: 15,
    color: theme.colors.placeholder,
    lineHeight: 22,
    fontWeight: '500',
  },
  promotionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    elevation: 6,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  promotionButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  promotionButtonContent: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  bottomSpacing: {
    height: 32,
  },
})