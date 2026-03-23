/**
 * User login/session state - persisted to localStorage.
 * Single source for auth provider and axios interceptors.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const STORAGE_KEY = 'rbac_template_session'

interface SessionState {
  authenticated: boolean
  token: string | null
  setSession: (authenticated: boolean, token: string | null) => void
  clear: () => void
}

const emptyState = {
  authenticated: false,
  token: null,
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        ...emptyState,
        setSession: (authenticated, token) => set({ authenticated, token }),
        clear: () => set(emptyState),
      }),
      {
        name: STORAGE_KEY,
        partialize: (state) => ({
          authenticated: state.authenticated,
          token: state.token,
        }),
      }
    ),
    { name: 'SessionStore' }
  )
)
