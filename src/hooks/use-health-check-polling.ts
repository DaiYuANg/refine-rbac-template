/**
 * Polls backend health endpoint every 5 seconds.
 * Updates health-check-store on success (status === "UP") or failure.
 */

import { useEffect } from 'react'
import { httpClient } from '@/providers/data-provider'
import { HEALTH_CHECK_URL } from '@/constants'
import { useHealthCheckStore } from '@/stores/health-check-store'

const POLL_INTERVAL_MS = 5000

export type HealthResponse = { status?: string }

export async function checkHealth(): Promise<void> {
  try {
    const { data } = await httpClient.get<HealthResponse>(HEALTH_CHECK_URL)
    const status = String(data?.status ?? '').toUpperCase()
    if (status === 'UP') {
      useHealthCheckStore.getState().setUp()
    } else {
      useHealthCheckStore
        .getState()
        .setDown(`Backend status: ${status || 'unknown'}`)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Request failed'
    useHealthCheckStore.getState().setDown(msg)
  }
}

export function useHealthCheckPolling(): void {
  useEffect(() => {
    void checkHealth()
    const id = setInterval(checkHealth, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])
}
