/**
 * Centralized environment configuration.
 * This is the ONLY module that reads import.meta.env.
 * Page and feature components must import from here, never read import.meta.env directly.
 */

const raw = import.meta.env

export const env = {
  /** API base URL for data provider (e.g. '/api') */
  apiBaseUrl: (raw.VITE_API_URL as string | undefined) ?? '/api',

  /** Whether the app is running in development mode */
  isDev: raw.DEV === true,

  /** Whether the app is in production build */
  isProd: raw.PROD === true,

  /** Application mode - 'development' | 'production' */
  mode: raw.MODE as string,
} as const

export type EnvConfig = typeof env
