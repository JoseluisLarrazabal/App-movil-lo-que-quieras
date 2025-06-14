import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { theme } from "../theme"

// User Screens
import HomeScreen from "../screens/user/HomeScreen"
import SearchScreen from "../screens/user/SearchScreen"
import ProfessionalSearchScreen from "../screens/professional/ProfessionalSearchScreen"
import BookingsScreen from "../screens/user/BookingsScreen"
import ProfileScreen from "../screens/user/ProfileScreen"
import HealthMapScreen from '../screens/health/HealthMapScreen'

const Tab = createBottomTabNavigator()

export default function UserNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Buscar",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Professionals"
        component={ProfessionalSearchScreen}
        options={{
          tabBarLabel: "Profesionales",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-hard-hat" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarLabel: "Reservas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthMapScreen}
        options={{
          tabBarLabel: "Salud",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hospital-building" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
} 