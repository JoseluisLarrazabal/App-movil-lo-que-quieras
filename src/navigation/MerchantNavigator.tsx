import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { theme } from "../theme"

// Pantallas placeholder (crearás las reales luego)
import MerchantDashboardScreen from "../screens/merchant/MerchantDashboardScreen"
import MerchantStoresScreen from "../screens/merchant/MerchantStoresScreen"
import MerchantProfileScreen from "../screens/merchant/MerchantProfileScreen"

const Tab = createBottomTabNavigator()

export default function MerchantNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="MerchantDashboard"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="MerchantDashboard"
        component={MerchantDashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MerchantStores"
        component={MerchantStoresScreen}
        options={{
          tabBarLabel: "Comercios",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="storefront" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MerchantProfile"
        component={MerchantProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
} 