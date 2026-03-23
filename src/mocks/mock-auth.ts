/**
 * Mock auth simulation for refresh token flow.
 * Randomly returns 401 to trigger token refresh during development.
 */

const INITIAL_TOKEN = 'mock-jwt-token'
const REFRESHED_TOKEN_PREFIX = 'mock-jwt-token-'

/** Probability of 401 for refreshed tokens. Set VITE_MOCK_401_PROB=0 in E2E for stability. */
const RANDOM_401_PROBABILITY = (() => {
  const v = import.meta.env.VITE_MOCK_401_PROB as string | undefined
  if (v == null || v === '') return 0.15
  const n = parseFloat(v)
  return Number.isNaN(n) ? 0.15 : Math.max(0, Math.min(1, n))
})()

/**
 * Whether the mock server should return 401 for this request.
 * - Initial token (mock-jwt-token): always 401 on first use -> triggers refresh after login
 * - Refreshed token (mock-jwt-token-{ts}): random 401 -> simulates occasional expiration
 */
export function shouldSimulate401(request: Request): boolean {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return false

  const token = auth.slice(7)
  if (!token) return false

  if (token === INITIAL_TOKEN) {
    return true
  }
  if (token.startsWith(REFRESHED_TOKEN_PREFIX)) {
    return Math.random() < RANDOM_401_PROBABILITY
  }
  return false
}
