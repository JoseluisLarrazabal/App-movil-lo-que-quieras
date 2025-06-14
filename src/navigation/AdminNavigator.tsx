import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { theme } from "../theme"

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen"
import AdminUsersScreen from "../screens/admin/AdminUsersScreen"
import AdminCategoriesScreen from "../screens/admin/AdminCategoriesScreen"
import AdminReportsScreen from "../screens/admin/AdminReportsScreen"

const Tab = createBottomTabNavigator()

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="AdminDashboard"
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
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{
          tabBarLabel: "Usuarios",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminCategories"
        component={AdminCategoriesScreen}
        options={{
          tabBarLabel: "Categorías",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shape" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminReports"
        component={AdminReportsScreen}
        options={{
          tabBarLabel: "Reportes",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
} 