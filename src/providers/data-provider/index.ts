import axios from 'axios'
import dataProvider from '@refinedev/simple-rest'
import { API_BASE_URL } from '@/constants'

// No baseURL: simple-rest builds full path like /api/users; baseURL would double the /api segment
const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Centralize interceptors, auth headers, error normalization here
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize errors - extend as needed
    return Promise.reject(error)
  }
)

export const httpClient = axiosInstance
export const dataProviderInstance = dataProvider(API_BASE_URL, axiosInstance)
