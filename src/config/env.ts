/**
 * Centralized environment configuration.
 * This is the ONLY module that reads import.meta.env.
 * Page and feature components must import from here, never read import.meta.env directly.
 */

const raw = import.meta.env

/** Whether to use mock API (vite-plugin-mock-dev-server). Dev default true, or VITE_USE_MOCK=true. */
export const useMock =
  (raw.VITE_USE_MOCK as string | undefined) === 'true' || raw.DEV === true

const apiBaseUrl = (raw.VITE_API_URL as string | undefined)?.trim() ?? '/api'

/** Auth refresh URL. Refresh token is sent via httpOnly cookie. */
const authRefreshUrl =
  (raw.VITE_AUTH_REFRESH_URL as string | undefined)?.trim() ||
  `${apiBaseUrl}/auth/refresh`

/** Enable Refine audit log provider. When true, CRUD operations are logged. */
const enableAuditLog =
  (raw.VITE_ENABLE_AUDIT_LOG as string | undefined) === 'true'

if (raw.PROD === true && !useMock && !apiBaseUrl) {
  throw new Error(
    '[config] VITE_API_URL is required in production when not using mock API.'
  )
}

export const env = {
  /** API base URL for data provider (e.g. '/api') */
  apiBaseUrl,

  /** Auth refresh endpoint. Refresh token sent via cookie. */
  authRefreshUrl,

  /** Whether the app is running in development mode */
  isDev: raw.DEV === true,

  /** Whether the app is in production build */
  isProd: raw.PROD === true,

  /** Application mode - 'development' | 'production' */
  mode: raw.MODE as string,

  /** Whether to run MSW mock API (dev default true, or VITE_USE_MOCK=true) */
  useMock,

  /** Whether to enable Refine audit log provider (VITE_ENABLE_AUDIT_LOG=true) */
  enableAuditLog,
} as const

export type EnvConfig = typeof env
