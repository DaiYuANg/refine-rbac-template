/**
 * Token refresh with concurrency control.
 * When access token expires (401), use refresh token (from httpOnly cookie)
 * to get new access token, then retry all failed requests.
 */

import type { InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config'
import { useSessionStore } from '@/features/auth'
import type { RefreshTokenResponse } from '@/features/auth/types'

const REFRESH_URL = env.authRefreshUrl

/** Custom config to mark refresh request - avoid retry loop */
export const IS_REFRESH_REQUEST = Symbol('isRefreshRequest')

export function isRefreshRequest(config: InternalAxiosRequestConfig): boolean {
  return Boolean(
    (config as InternalAxiosRequestConfig & { [IS_REFRESH_REQUEST]?: boolean })[
      IS_REFRESH_REQUEST
    ]
  )
}

export function markAsRefreshRequest(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  ;(config as InternalAxiosRequestConfig & { [IS_REFRESH_REQUEST]?: boolean })[
    IS_REFRESH_REQUEST
  ] = true
  return config
}

type QueuedRequest = {
  resolve: (value: string) => void
  reject: (reason: unknown) => void
}

let refreshPromise: Promise<string | null> | null = null
const failedQueue: QueuedRequest[] = []

function processQueue(newToken: string | null, error: unknown = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else if (newToken) {
      resolve(newToken)
    } else {
      reject(new Error('Refresh failed'))
    }
  })
  failedQueue.length = 0
}

/**
 * Call POST /auth/refresh with credentials (cookie). Backend returns new accessToken.
 * Deduplicates concurrent refresh calls - all waiters get the same result.
 */
export async function refreshAccessToken(axiosInstance: {
  request: (config: InternalAxiosRequestConfig) => Promise<unknown>
}): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = axiosInstance
    .request(
      markAsRefreshRequest({
        url: REFRESH_URL,
        method: 'POST',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      } as InternalAxiosRequestConfig)
    )
    .then((res: unknown) => {
      const data = (res as { data?: RefreshTokenResponse })?.data
      const accessToken = data?.accessToken
      if (!accessToken) {
        throw new Error('No accessToken in refresh response')
      }
      useSessionStore.getState().setSession(true, accessToken)
      processQueue(accessToken)
      return accessToken
    })
    .catch((err: unknown) => {
      processQueue(null, err)
      useSessionStore.getState().clear()
      return null
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

/**
 * Queue a failed request to retry after refresh. Returns a promise that resolves
 * with the new token when refresh succeeds, or rejects when refresh fails.
 */
export function queueForRetry(): Promise<string> {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject })
  })
}
