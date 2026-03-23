/**
 * List display preferences (e.g. show ID column).
 * Persisted to localStorage for user preference.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const STORAGE_KEY = 'rbac_template_list_display'

interface ListDisplayState {
  showIdColumn: boolean
  setShowIdColumn: (show: boolean) => void
}

export const useListDisplayStore = create<ListDisplayState>()(
  devtools(
    persist(
      (set) => ({
        showIdColumn: true,
        setShowIdColumn: (show) => set({ showIdColumn: show }),
      }),
      {
        name: STORAGE_KEY,
        partialize: (state) => ({ showIdColumn: state.showIdColumn }),
      }
    ),
    { name: 'ListDisplayStore' }
  )
)
