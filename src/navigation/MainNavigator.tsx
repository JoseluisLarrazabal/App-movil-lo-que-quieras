"use client"

import React from "react"
import { useContext } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ActivityIndicator, View } from "react-native"
import { AuthContext } from "../context/AuthContext"
import { theme } from "../theme"

// Auth Screens
import OnboardingScreen from "../screens/auth/OnboardingScreen"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import CreateProfessionalProfileScreen from "../screens/professional/CreateProfessionalProfileScreen"

// Navigators
import UserNavigator from "./UserNavigator"
import ProviderNavigator from "./ProviderNavigator"

// Additional Screens
import ServiceDetailScreen from "../screens/shared/ServiceDetailScreen"
import ChatScreen from "../screens/shared/ChatScreen"
import ReviewScreen from "../screens/shared/ReviewScreen"
import ProfessionalDetailScreen from "../screens/professional/ProfessionalDetailScreen"

const Stack = createNativeStackNavigator()

export default function MainNavigator() {
  const { currentUser, isLoading, hasProfessionalProfile } = useContext(AuthContext)

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentUser ? (
        // Auth screens
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : currentUser.role === "provider" && !hasProfessionalProfile ? (
        // Obliga a crear perfil profesional antes de otra cosa
        <Stack.Screen name="CreateProfessionalProfile" component={CreateProfessionalProfileScreen} />
      ) : (
        // Navegación principal basada en rol
        <>
          {currentUser.role === "provider" ? (
            <Stack.Screen name="ProviderTabs" component={ProviderNavigator} />
          ) : (
            <Stack.Screen name="UserTabs" component={UserNavigator} />
          )}
          
          {/* Screens compartidas */}
          <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="ProfessionalDetail" component={ProfessionalDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}
