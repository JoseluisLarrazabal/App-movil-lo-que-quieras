"use client"

import { useContext } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import type { RootStackParamList } from "./types"
import { AuthContext } from "../context/AuthContext"
import { theme } from "../theme"

// Auth Screens
import OnboardingScreen from "../screens/auth/OnboardingScreen"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"

// User Screens
import HomeScreen from "../screens/user/HomeScreen"
import SearchScreen from "../screens/user/SearchScreen"
import ProfileScreen from "../screens/user/ProfileScreen"
import BookingsScreen from "../screens/user/BookingsScreen"
import ProviderProfileScreen from "../screens/user/ProviderProfileScreen"
import ProfessionalSearchScreen from "../screens/professional/ProfessionalSearchScreen"
import ProfessionalDetailScreen from "../screens/professional/ProfessionalDetailScreen"
import CreateProfessionalProfileScreen from "../screens/professional/CreateProfessionalProfileScreen"

// Additional Screens
import ServiceDetailScreen from "../screens/user/ServiceDetailScreen"
import ChatScreen from "../screens/user/ChatScreen"
import ProviderServicesScreen from "../screens/provider/ProviderServicesScreen"
import AddServiceScreen from "../screens/provider/AddServiceScreen"
import AllCategoriesScreen from "../screens/user/AllCategoriesScreen"
import CategoryScreen from "../screens/user/CategoryScreen"

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

// User Bottom Tabs
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Buscar",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="magnify" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Professionals"
        component={ProfessionalSearchScreen}
        options={{
          tabBarLabel: "Profesionales",
          tabBarIcon: ({ color, size }) =>
            <MaterialCommunityIcons name="account-hard-hat" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarLabel: "Reservas",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function MainNavigator() {
  const { currentUser, userRole, isLoading, hasProfessionalProfile } = useContext(AuthContext)

  // Pantalla de carga si falta info
  if (isLoading || (userRole === "provider" && hasProfessionalProfile === null)) {
    return null // O mostrar Spinner…
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentUser ? (
        // Auth screens
        <Stack.Group>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="CreateProfessionalProfile" component={CreateProfessionalProfileScreen} />
        </Stack.Group>
      ) : userRole === "provider" && !hasProfessionalProfile ? (
        // Obliga a crear perfil profesional antes de otra cosa
        <Stack.Screen
          name="CreateProfessionalProfile"
          component={CreateProfessionalProfileScreen}
        />
      ) : (
        // Tu stack normal para user/provider
        <Stack.Group>
          <Stack.Screen name="UserTabs" component={UserTabs} />
          <Stack.Screen name="ProfessionalDetail" component={ProfessionalDetailScreen} />
          <Stack.Screen name="CreateProfessionalProfile" component={CreateProfessionalProfileScreen} />
          <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
          <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ProviderServices" component={ProviderServicesScreen} />
          <Stack.Screen name="AddService" component={AddServiceScreen} />
          <Stack.Screen name="AllCategoriesScreen" component={AllCategoriesScreen} />
          <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}
