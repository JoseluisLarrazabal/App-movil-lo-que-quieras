import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// ⚠️ CAMBIA ESTA IP POR LA TUYA
const LOCAL_IP = "192.168.20.18" // 👈 PON TU IP AQUÍ

// Configuración para desarrollo
const BASE_URL = __DEV__ 
  ? `http://${LOCAL_IP}:3000/api`  // Para Expo Go
  : "https://app-movil-lo-que-quieras-2.onrender.com/api"  // Para producción

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

// Comercios locales y supermercados
export async function fetchLocalStores(params: { type?: string; city?: string; search?: string } = {}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${BASE_URL}/local-stores${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Error al obtener comercios');
  return await res.json();
}

export async function fetchLocalStoreById(id: string) {
  const res = await fetch(`${BASE_URL}/local-stores/${id}`);
  if (!res.ok) throw new Error('Error al obtener comercio');
  return await res.json();
}

// Comercios propios del merchant
export async function getMyLocalStores(): Promise<any> {
  console.log('Llamando endpoint /local-stores/my-local-stores desde frontend');
  const res = await api.get('/local-stores/my-local-stores');
  return res.data;
}

export async function createLocalStore(data: Record<string, any>): Promise<any> {
  const res = await api.post('/local-stores', data);
  return res.data;
}

export async function updateLocalStore(id: string, data: Record<string, any>): Promise<any> {
  const res = await api.put(`/local-stores/${id}`, data);
  return res.data;
}

export async function deleteLocalStore(id: string): Promise<any> {
  const res = await api.delete(`/local-stores/${id}`);
  return res.data;
}

export default api