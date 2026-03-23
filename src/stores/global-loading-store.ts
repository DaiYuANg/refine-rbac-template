/**
 * Global loading state for API requests.
 * Incremented on request start, decremented on response/error.
 */

import { create } from 'zustand'

interface GlobalLoadingState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useGlobalLoadingStore = create<GlobalLoadingState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
}))
