import type { AuthProvider } from '@refinedev/core'
import { ROUTES } from '@/constants/routes'
import i18n from '@/i18n'

/** Mock session flag; replace with token / cookie when wiring real auth. */
const AUTH_STORAGE_KEY = 'rbac_template_authenticated'

export const authProvider: AuthProvider = {
  login: async ({ username }) => {
    if (!username?.trim()) {
      return {
        success: false,
        error: { name: 'LoginError', message: i18n.t('login.requiredUsername') },
      }
    }
    localStorage.setItem(AUTH_STORAGE_KEY, '1')
    return { success: true, redirectTo: ROUTES.home }
  },
  logout: async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return { success: true, redirectTo: ROUTES.login }
  },
  check: async () => {
    const ok = localStorage.getItem(AUTH_STORAGE_KEY) === '1'
    if (ok) {
      return { authenticated: true }
    }
    return {
      authenticated: false,
      redirectTo: ROUTES.login,
      logout: true,
    }
  },
  getIdentity: async () => {
    return {
      id: '1',
      name: 'Demo User',
      avatar: undefined,
    }
  },
  onError: async () => {
    return { logout: false }
  },
}
