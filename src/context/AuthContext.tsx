"use client"

import type React from "react"
import { createContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import api from "../services/api"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "provider" | "admin"
  avatar?: string
  phone?: string
  location?: string
}

interface AuthContextData {
  currentUser: User | null
  userRole: "user" | "provider" | "admin" | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, role: "user" | "provider") => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<"user" | "provider" | "admin" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserFromStorage()
  }, [])

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@LoQueQuieras:user")
      const storedToken = await AsyncStorage.getItem("@LoQueQuieras:token")

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser) as User
        setCurrentUser(parsedUser)
        setUserRole(parsedUser.role)
      }
    } catch (error) {
      console.log("Error loading user from storage", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Hacer request real al backend
      const response = await api.post('/auth/login', {
        email,
        password
      })

      const { user, tokens } = response.data

      // Guardar tokens y usuario
      await AsyncStorage.setItem("@LoQueQuieras:user", JSON.stringify(user))
      await AsyncStorage.setItem("@LoQueQuieras:token", tokens.accessToken)
      await AsyncStorage.setItem("@LoQueQuieras:refreshToken", tokens.refreshToken)

      setCurrentUser(user)
      setUserRole(user.role)
    } catch (error: any) {
      console.log("Error signing in", error)
      
      // Manejar errores específicos
      if (error.response?.status === 401) {
        throw new Error("Email o contraseña incorrectos")
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network')) {
        throw new Error("Error de conexión. Verifica tu internet.")
      } else {
        throw new Error("Error al iniciar sesión. Intenta nuevamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string, role: "user" | "provider") => {
    try {
      setIsLoading(true)

      // Hacer request real al backend
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role
      })

      const { user, tokens } = response.data

      // Guardar tokens y usuario
      await AsyncStorage.setItem("@LoQueQuieras:user", JSON.stringify(user))
      await AsyncStorage.setItem("@LoQueQuieras:token", tokens.accessToken)
      await AsyncStorage.setItem("@LoQueQuieras:refreshToken", tokens.refreshToken)

      setCurrentUser(user)
      setUserRole(user.role)
    } catch (error: any) {
      console.log("Error signing up", error)
      
      // Manejar errores específicos
      if (error.response?.status === 409) {
        throw new Error("El email ya está registrado")
      } else if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors[0])
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network')) {
        throw new Error("Error de conexión. Verifica tu internet.")
      } else {
        throw new Error("Error al crear la cuenta. Intenta nuevamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      
      // Opcional: notificar al backend del logout
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.log("Error notifying logout to server:", error)
      }

      await AsyncStorage.removeItem("@LoQueQuieras:user")
      await AsyncStorage.removeItem("@LoQueQuieras:token")
      await AsyncStorage.removeItem("@LoQueQuieras:refreshToken")

      setCurrentUser(null)
      setUserRole(null)
    } catch (error) {
      console.log("Error signing out", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true)

      if (currentUser) {
        // En el futuro, aquí harías un request al backend
        // const response = await api.put('/users/profile', data)
        
        // Por ahora, solo actualizamos localmente
        const updatedUser = { ...currentUser, ...data }
        await AsyncStorage.setItem("@LoQueQuieras:user", JSON.stringify(updatedUser))
        setCurrentUser(updatedUser)
      }
    } catch (error) {
      console.log("Error updating profile", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}