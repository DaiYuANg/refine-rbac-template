import { env } from '@/config'

export const API_BASE_URL = env.apiBaseUrl

/** Health check endpoint. Backend should return { status: "UP" }. */
export const HEALTH_CHECK_URL = `${API_BASE_URL}/health`
export { resources } from './resources'
export { ROUTES } from './routes'
