import type { AuthProvider } from '@refinedev/core'
import { API_BASE_URL } from '@/constants'
import { ROUTES } from '@/constants/routes'
import i18n from '@/i18n'
import { useAuthStore } from '@/features/rbac'
import { useSessionStore } from '@/features/auth'
import type { MeResponse } from '@/features/auth/types'
import { httpClient } from '../data-provider'

/** Shared /me fetch: populates RBAC store once per session. Deduplicates concurrent calls. */
let meFetchPromise: Promise<MeResponse | null> | null = null

async function fetchMeAndPopulateStore(): Promise<MeResponse | null> {
  const { identity, setMe } = useAuthStore.getState()
  if (identity) return null

  if (meFetchPromise) return meFetchPromise

  meFetchPromise = httpClient
    .get<MeResponse>(`${API_BASE_URL}/me`)
    .then((res) => {
      const data = res.data
      setMe({
        roles: data.roles ?? [],
        permissions: data.permissions ?? [],
        id: data.id,
        name: data.name,
      })
      return data
    })
    .catch(() => {
      useAuthStore.getState().clear()
      return null
    })
    .finally(() => {
      meFetchPromise = null
    })

  return meFetchPromise
}

export const authProvider: AuthProvider = {
  login: async ({ username }) => {
    if (!username?.trim()) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: i18n.t('login.requiredUsername'),
        },
      }
    }
    useSessionStore.getState().setSession(true, `mock:${username.trim()}`)
    return { success: true, redirectTo: ROUTES.home }
  },
  logout: async () => {
    useSessionStore.getState().clear()
    useAuthStore.getState().clear()
    meFetchPromise = null
    return { success: true, redirectTo: ROUTES.login }
  },
  check: async () => {
    const { authenticated } = useSessionStore.getState()
    if (authenticated) {
      return { authenticated: true }
    }
    useAuthStore.getState().clear()
    meFetchPromise = null
    return {
      authenticated: false,
      redirectTo: ROUTES.login,
      logout: true,
    }
  },
  getIdentity: async () => {
    await fetchMeAndPopulateStore()
    const identity = useAuthStore.getState().identity
    if (identity) return identity
    return { id: '1', name: 'Demo User' }
  },
  getPermissions: async () => {
    await fetchMeAndPopulateStore()
    const { roles, permissions } = useAuthStore.getState()
    return { roles, permissions }
  },
  onError: async (error) => {
    const status = error?.response?.status
    if (status === 401) {
      return { logout: true, redirectTo: ROUTES.login }
    }
    return { logout: false }
  },
}
