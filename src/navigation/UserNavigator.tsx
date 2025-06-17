import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { theme } from "../theme"
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

// User Screens
import HomeScreen from "../screens/user/HomeScreen"
import SearchScreen from "../screens/user/SearchScreen"
import ProfileScreen from "../screens/user/ProfileScreen"
import ProfessionalSearchScreen from "../screens/professional/ProfessionalSearchScreen"
import BookingsScreen from "../screens/user/BookingsScreen"
import HealthMapScreen from '../screens/health/HealthMapScreen'
import CommerceMapScreen from '../screens/commerce/CommerceMapScreen'
import { TouchableOpacity } from "react-native"

const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

function MainTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons name="menu" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
        ),
        headerTitleAlign: 'center',
      })}
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
        name="Profile"
        component={ProfileScreen}
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

export default function UserNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.placeholder,
        headerShown: false,
      }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Principal"
        component={MainTabs}
        options={{
          drawerLabel: "Inicio",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profesionales"
        component={ProfessionalSearchScreen}
        options={{
          drawerLabel: "Profesionales",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="account-hard-hat" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Reservas"
        component={BookingsScreen}
        options={{
          drawerLabel: "Reservas",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Salud"
        component={HealthMapScreen}
        options={{
          drawerLabel: "Salud",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="hospital-building" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Comercios"
        component={CommerceMapScreen}
        options={{
          drawerLabel: "Comercios",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="storefront" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  )
} 