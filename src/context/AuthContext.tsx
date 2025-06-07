"use client"

import type React from "react"
import { createContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

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

      // Simulate API call - In real app, this would be your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data based on email
      let mockUser: User
      if (email === "admin@test.com") {
        mockUser = {
          id: "1",
          name: "Administrador",
          email: "admin@test.com",
          role: "admin",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        }
      } else if (email === "provider@test.com") {
        mockUser = {
          id: "2",
          name: "Juan Proveedor",
          email: "provider@test.com",
          role: "provider",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        }
      } else {
        mockUser = {
          id: "3",
          name: "María Usuario",
          email: "user@test.com",
          role: "user",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        }
      }

      const mockToken = "mock-jwt-token"

      await AsyncStorage.setItem("@LoQueQuieras:user", JSON.stringify(mockUser))
      await AsyncStorage.setItem("@LoQueQuieras:token", mockToken)

      setCurrentUser(mockUser)
      setUserRole(mockUser.role)
    } catch (error) {
      console.log("Error signing in", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string, role: "user" | "provider") => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role,
        avatar: `https://randomuser.me/api/portraits/${role === "user" ? "women" : "men"}/${Math.floor(Math.random() * 50)}.jpg`,
      }

      const mockToken = "mock-jwt-token"

      await AsyncStorage.setItem("@LoQueQuieras:user", JSON.stringify(newUser))
      await AsyncStorage.setItem("@LoQueQuieras:token", mockToken)

      setCurrentUser(newUser)
      setUserRole(newUser.role)
    } catch (error) {
      console.log("Error signing up", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      await AsyncStorage.removeItem("@LoQueQuieras:user")
      await AsyncStorage.removeItem("@LoQueQuieras:token")

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
