/**
 * Zustand store for current user's RBAC state (roles, permissions, identity).
 * Populated by authProvider.getIdentity when /me is fetched.
 * Persisted to localStorage; cleared on logout.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { CurrentUserPermissions } from './types'

export interface IdentityData {
  id: string
  name: string
}

interface AuthState extends CurrentUserPermissions {
  identity: IdentityData | null
  setMe: (data: {
    roles: CurrentUserPermissions['roles']
    permissions: CurrentUserPermissions['permissions']
    id: string
    name: string
  }) => void
  clear: () => void
}

const emptyState: CurrentUserPermissions & { identity: IdentityData | null } = {
  roles: [],
  permissions: [],
  identity: null,
}

const STORAGE_KEY = 'rbac_template_auth'

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...emptyState,
        setMe: (data) =>
          set({
            roles: data.roles,
            permissions: data.permissions,
            identity: { id: data.id, name: data.name },
          }),
        clear: () => set({ ...emptyState }),
      }),
      {
        name: STORAGE_KEY,
        partialize: (state) => ({
          roles: state.roles,
          permissions: state.permissions,
          identity: state.identity,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)
