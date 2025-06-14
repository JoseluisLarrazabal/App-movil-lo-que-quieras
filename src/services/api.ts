import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// ⚠️ CAMBIA ESTA IP POR LA TUYA
const LOCAL_IP = "192.168.1.7" // 👈 PON TU IP AQUÍ

// Configuración para desarrollo
const BASE_URL = __DEV__ 
  ? `http://${LOCAL_IP}:3000/api`  // Para Expo Go
  : "https://tu-api-produccion.com/api"  // Para producción

// Create an Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos timeout
})

// Add a request interceptor to include auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem("@LoQueQuieras:token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.log("Error getting token:", error)
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log("API Error:", error.message)
    
    if (error.response) {
      console.log("Response Error:", error.response.data)
      
      if (error.response.status === 401) {
        try {
          await AsyncStorage.removeItem("@LoQueQuieras:token")
          await AsyncStorage.removeItem("@LoQueQuieras:user")
          await AsyncStorage.removeItem("@LoQueQuieras:refreshToken")
        } catch (clearError) {
          console.log("Error clearing storage:", clearError)
        }
      }
    } else if (error.request) {
      console.log("Network Error - Backend no responde")
    }

    return Promise.reject(error)
  },
)

export default api