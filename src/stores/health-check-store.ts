/**
 * Network health status from backend health check.
 * Polled every 5 seconds; overlay shows when status !== "UP" or request fails.
 */

import { create } from 'zustand'

interface HealthCheckState {
  /** false when poll failed or status !== "UP" */
  isUp: boolean
  /** Last error message for display */
  lastError: string | null
  setUp: () => void
  setDown: (error?: string) => void
}

export const useHealthCheckStore = create<HealthCheckState>((set) => ({
  isUp: true,
  lastError: null,
  setUp: () => set({ isUp: true, lastError: null }),
  setDown: (error) =>
    set({
      isUp: false,
      lastError: error ?? null,
    }),
}))
