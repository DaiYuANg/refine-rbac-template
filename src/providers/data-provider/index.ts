import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/constants'
import { useSessionStore } from '@/features/auth'
import { useGlobalLoadingStore } from '@/stores/global-loading-store'
import { normalizeApiError, type NormalizedApiError } from '@/types/errors'
import {
  isRefreshRequest,
  refreshAccessToken,
  queueForRetry,
} from './token-refresh'
import { createDataProvider } from './create-data-provider'

// No baseURL: provider builds full path like /api/users
const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  withCredentials: true, // Send cookies (refresh token) on same/cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
})

const isHealthCheck = (config: { url?: string }) =>
  String(config?.url ?? '').includes('/health')

// Attach auth token and cache-busting timestamp for GET requests
axiosInstance.interceptors.request.use((config) => {
  if (!isHealthCheck(config)) {
    useGlobalLoadingStore.getState().increment()
  }
  if (!isRefreshRequest(config as Parameters<typeof isRefreshRequest>[0])) {
    const token = useSessionStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  if (config.method?.toLowerCase() === 'get') {
    config.params = { ...config.params, _t: Date.now() }
  }
  return config
})

// Decrement loading count on response (success or error)
const decrementLoading = (config: { url?: string }) => {
  if (!isHealthCheck(config ?? {})) {
    useGlobalLoadingStore.getState().decrement()
  }
}
axiosInstance.interceptors.response.use(
  (response) => {
    decrementLoading(response.config ?? {})
    return response
  },
  (error) => {
    decrementLoading(error?.config ?? {})
    return Promise.reject(error)
  }
)

// On 401: refresh token (cookie) -> new access token -> retry failed request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: {
    config?: InternalAxiosRequestConfig
    response?: { status?: number }
  }) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || !originalRequest) {
      const normalized = normalizeApiError(error)
      Object.assign(error, {
        normalizedError: normalized as NormalizedApiError,
      })
      return Promise.reject(error)
    }

    // Refresh request itself returned 401 -> refresh token expired, logout
    if (isRefreshRequest(originalRequest)) {
      useSessionStore.getState().clear()
      const normalized = normalizeApiError(error)
      Object.assign(error, {
        normalizedError: normalized as NormalizedApiError,
      })
      return Promise.reject(error)
    }

    // Avoid retry loop if we already retried
    if (originalRequest._retry) {
      const normalized = normalizeApiError(error)
      Object.assign(error, {
        normalizedError: normalized as NormalizedApiError,
      })
      return Promise.reject(error)
    }

    try {
      const tokenPromise = queueForRetry()
      refreshAccessToken(axiosInstance)
      const newToken = await tokenPromise
      if (!newToken) throw new Error('Refresh failed')

      originalRequest._retry = true
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return axiosInstance.request(originalRequest)
    } catch (refreshError) {
      const normalized = normalizeApiError(refreshError ?? error)
      Object.assign(error, {
        normalizedError: normalized as NormalizedApiError,
      })
      return Promise.reject(error)
    }
  }
)

export const httpClient = axiosInstance
export const dataProviderInstance = createDataProvider({
  apiUrl: API_BASE_URL,
  httpClient: axiosInstance,
})
