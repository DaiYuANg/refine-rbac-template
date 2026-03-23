import axios from 'axios'
import { API_BASE_URL } from '@/constants'
import { useSessionStore } from '@/features/auth'
import { normalizeApiError, type NormalizedApiError } from '@/types/errors'
import { createDataProvider } from './create-data-provider'

// No baseURL: provider builds full path like /api/users
const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach auth token and cache-busting timestamp for GET requests
axiosInstance.interceptors.request.use((config) => {
  const token = useSessionStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.method?.toLowerCase() === 'get') {
    config.params = { ...config.params, _t: Date.now() }
  }
  return config
})

// Normalize errors; 401 bubbles to authProvider.onError
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeApiError(error)
    Object.assign(error, { normalizedError: normalized as NormalizedApiError })
    return Promise.reject(error)
  }
)

export const httpClient = axiosInstance
export const dataProviderInstance = createDataProvider({
  apiUrl: API_BASE_URL,
  httpClient: axiosInstance,
})
