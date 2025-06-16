"use client"

import React, { useEffect, useContext, useCallback, useMemo } from "react"
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  FlatList, 
  RefreshControl,
  StatusBar,
  Dimensions,
  Platform
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { 
  Text, 
  Avatar, 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  Appbar, 
  Searchbar,
  ActivityIndicator
} from "react-native-paper"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { AuthContext } from "../../context/AuthContext"
import type { RootState, AppDispatch } from "../../redux/store"
import { theme } from "../../theme"
import ServiceCard from "../../components/ServiceCard"
import CategoryButton from "../../components/CategoryButton"
import { fetchServices } from "../../redux/slices/servicesSlice"
import { fetchCategories } from "../../redux/slices/categoriesSlice"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../navigation/types"

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const HEADER_HEIGHT = Platform.OS === 'ios' ? 120 : 100

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser } = useContext(AuthContext)
  
  // Selectors con memoización
  const categories = useSelector((state: RootState) => state.categories.items)
  const { popularServices, items: allServices, status: servicesStatus } = useSelector((state: RootState) => state.services)
  const categoriesState = useSelector((state: RootState) => state.categories)
  const categoriesLoading = categoriesState.status === "loading"
  const servicesLoading = servicesStatus === "loading"
  
  // Datos computados memoizados
  const popularActiveServices = useMemo(() => 
    popularServices.filter(s => s.isActive !== false).slice(0, 6),
    [popularServices]
  )
  
  const featuredCategories = useMemo(() => 
    categories.slice(0, 6),
    [categories]
  )
  
  const isLoading = servicesLoading || categoriesLoading
  
  // Callbacks memoizados
  const navigateToSearch = useCallback(() => {
    navigation.navigate("Search" as never)
  }, [navigation])

  const handleCategoryPress = useCallback((category: any) => {
    navigation.navigate("CategoryScreen", {
      categoryId: category._id,
      categoryName: category.name,
    })
  }, [navigation])
  
  const handleServicePress = useCallback((serviceId: string) => {
    navigation.navigate("CreateBookingScreen", { serviceId })
  }, [navigation])
  
  const handleRefresh = useCallback(() => {
    dispatch(fetchServices({ status: "active" }))
    dispatch(fetchCategories())
  }, [dispatch])

  // Efecto de carga inicial
  useFocusEffect(
    useCallback(() => {
      if (categories.length === 0 || popularServices.length === 0) {
        dispatch(fetchServices({ status: "active" }))
        dispatch(fetchCategories())
      }
    }, [dispatch, categories.length, popularServices.length])
  )

  // Render functions memoizados
  const renderCategoryItem = useCallback(({ item }: { item: any }) => (
    <View style={styles.categoryItemWrapper}>
      <CategoryButton 
        category={item} 
        onPress={() => handleCategoryPress(item)} 
      />
    </View>
  ), [handleCategoryPress])
  
  const renderServiceItem = useCallback(({ item }: { item: any }) => (
    <View style={styles.serviceItemWrapper}>
      <ServiceCard 
        service={item} 
        onPress={() => handleServicePress(item.id)} 
      />
    </View>
  ), [handleServicePress])

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={theme.colors.primary}
        translucent={false}
      />
      <SafeAreaView style={styles.container}>
        {/* Header optimizado con mejor jerarquía visual */}
        <View style={styles.fixedHeader}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Avatar.Image 
                  size={52} 
                  source={{ uri: currentUser?.avatar || 'https://via.placeholder.com/52' }}
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
                size={24}
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
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              progressViewOffset={HEADER_HEIGHT}
            />
          }
          scrollEventThrottle={16}
        >
          {/* Search mejorado con mejor feedback visual */}
          <View style={styles.searchSection}>
            <Text style={styles.searchLabel}>¿Qué necesitas hoy?</Text>
            <Searchbar
              value=""
              placeholder="Buscar servicios, profesionales..."
              onPress={navigateToSearch}
              style={styles.searchbar}
              inputStyle={styles.searchInput}
              iconColor={theme.colors.primary}
              editable={false}
              elevation={2}
            />
          </View>

          {/* Hero Banner mejorado con animaciones sutiles */}
          <View style={styles.heroContainer}>
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
                    onPress={() => {}}
                  >
                    Usar ahora
                  </Button>
                </View>
                <View style={styles.heroRight}>
                  <View style={styles.heroIconContainer}>
                    <Text style={styles.heroEmoji}>🎉</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Categories con loading state */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Title style={styles.sectionTitle}>✨ Categorías populares</Title>
                <Text style={styles.sectionSubtitle}>Encuentra lo que buscas rápidamente</Text>
              </View>
              <Button 
                mode="text" 
                labelStyle={styles.sectionButtonLabel}
                onPress={() => navigation.navigate("AllCategoriesScreen" as never)}
                icon="arrow-right"
                compact
              >
                Ver todas
              </Button>
            </View>
            
            {categoriesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : (
              <FlatList
                data={featuredCategories}
                keyExtractor={(item) => item._id}
                renderItem={renderCategoryItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
                removeClippedSubviews={true}
                maxToRenderPerBatch={4}
                windowSize={6}
                getItemLayout={(data, index) => ({
                  length: 120,
                  offset: 120 * index,
                  index,
                })}
              />
            )}
          </View>

          {/* Popular Services optimizado */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Title style={styles.sectionTitle}>🔥 Más solicitados</Title>
                <Text style={styles.sectionSubtitle}>Los favoritos de nuestros usuarios</Text>
              </View>
              <Button 
                mode="text" 
                labelStyle={styles.sectionButtonLabel}
                onPress={() => navigation.navigate("AllServicesScreen" as never)}
                icon="arrow-right"
                compact
              >
                Ver todos
              </Button>
            </View>
            
            {servicesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : (
              <FlatList
                data={popularActiveServices}
                keyExtractor={(item) => item.id}
                renderItem={renderServiceItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.servicesContainer}
                removeClippedSubviews={true}
                maxToRenderPerBatch={3}
                windowSize={5}
              />
            )}
          </View>

          {/* Stats mejoradas con mejor espaciado */}
          <View style={styles.statsSection}>
            <Card style={styles.statsCard} mode="elevated">
              <Card.Content style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                    <Text style={styles.statIcon}>🛠️</Text>
                  </View>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>Servicios</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
                    <Text style={styles.statIcon}>👥</Text>
                  </View>
                  <Text style={styles.statNumber}>10k+</Text>
                  <Text style={styles.statLabel}>Usuarios</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={styles.statIcon}>⭐</Text>
                  </View>
                  <Text style={styles.statNumber}>4.8</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Promotion Banner simplificado y más limpio */}
          <View style={styles.promotionSection}>
            <Card style={styles.promotionCard} mode="elevated">
              <Card.Content style={styles.promotionContent}>
                <View style={styles.promotionHeader}>
                  <View style={styles.promotionIconContainer}>
                    <Text style={styles.promotionEmoji}>👨‍💼</Text>
                  </View>
                  <View style={styles.promotionTextContainer}>
                    <Title style={styles.promotionTitle}>¿Eres profesional?</Title>
                    <Paragraph style={styles.promotionSubtitle}>
                      Únete a nuestra comunidad de expertos
                    </Paragraph>
                  </View>
                </View>
                <Button 
                  mode="contained" 
                  style={styles.promotionButton}
                  labelStyle={styles.promotionButtonLabel}
                  contentStyle={styles.promotionButtonContent}
                  icon="arrow-right"
                  onPress={() => {}}
                >
                  Comenzar ahora
                </Button>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </>
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
    paddingTop: HEADER_HEIGHT + 10,
  },
  
  // Header optimizado
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    borderRadius: 30,
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatar: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  welcomeContainer: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: '600',
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginTop: 2,
  },
  notificationContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  notificationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    width: 44,
    height: 44,
  },

  // Search optimizado
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  searchbar: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInput: {
    fontSize: 16,
    paddingLeft: 8,
  },

  // Hero simplificado
  heroContainer: {
    margin: 20,
    marginTop: 24,
  },
  heroBanner: {
    borderRadius: 20,
    backgroundColor: '#667eea',
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  heroContent: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLeft: {
    flex: 1,
  },
  heroRight: {
    marginLeft: 16,
  },
  discountBadge: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 4,
  },
  heroButtonLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  heroButtonContent: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  heroIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 28,
  },

  // Sections optimizadas
  section: {
    marginTop: 28,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    fontWeight: '500',
  },
  sectionButtonLabel: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Loading
  loadingContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Lists optimizadas
  categoriesContainer: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  categoryItemWrapper: {
    marginRight: 12,
  },
  servicesContainer: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  serviceItemWrapper: {
    marginRight: 12,
  },

  // Stats mejoradas
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  statsCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statsContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginHorizontal: 8,
  },

  // Promotion simplificada
  promotionSection: {
    margin: 20,
  },
  promotionCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  promotionContent: {
    padding: 20,
  },
  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promotionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  promotionEmoji: {
    fontSize: 24,
  },
  promotionTextContainer: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: theme.colors.text,
  },
  promotionSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    lineHeight: 20,
    fontWeight: '500',
  },
  promotionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    elevation: 4,
  },
  promotionButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  promotionButtonContent: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  bottomSpacing: {
    height: 24,
  },
})