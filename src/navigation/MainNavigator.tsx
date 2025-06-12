"use client"

import { useContext } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialCommunityIcons } from "@expo/vector-icons"
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
import ProfessionalSearchScreen from "../screens/professional/ProfessionalSearchScreen"

const Stack = createNativeStackNavigator()
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
  const { currentUser, userRole, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return null // Loading screen could be added here
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentUser ? (
        // Authentication Stack
        <Stack.Group>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : (
        // User Stack (simplified for this version)
        <Stack.Group>
          <Stack.Screen name="UserTabs" component={UserTabs} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}
