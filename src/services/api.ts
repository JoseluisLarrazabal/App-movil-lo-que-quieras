import axios from "axios"

// Create an Axios instance
export const api = axios.create({
  // In a real app, this would be your API URL
  baseURL: "https://api.loquequieras.com",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.log("Response Error:", error.response.data)

      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // You could trigger a logout or refresh token here
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log("Network Error:", error.request)
    } else {
      // Something happened in setting up the request
      console.log("Request Error:", error.message)
    }

    return Promise.reject(error)
  },
)

export default api
