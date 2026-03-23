/**
 * Mock server utilities.
 * Uses build-time define for env (injected by vite config).
 */
declare const __MOCK_401_PROB__: string
declare const __MOCK_HEALTH_FAIL_PROB__: string

const MOCK_401_PROB = parseFloat(
  typeof __MOCK_401_PROB__ !== 'undefined' ? __MOCK_401_PROB__ : '0.15'
)
const MOCK_HEALTH_FAIL_PROB = parseFloat(
  typeof __MOCK_HEALTH_FAIL_PROB__ !== 'undefined'
    ? __MOCK_HEALTH_FAIL_PROB__
    : '0.05'
)

const INITIAL_TOKEN = 'mock-jwt-token'
const REFRESHED_TOKEN_PREFIX = 'mock-jwt-token-'

export function shouldSimulate401(req: {
  headers?: { authorization?: string; Authorization?: string }
}): boolean {
  const auth = req.headers?.authorization ?? req.headers?.Authorization ?? ''
  if (!auth.startsWith('Bearer ')) return false
  const token = auth.slice(7).trim()
  if (!token) return false
  if (token === INITIAL_TOKEN) return true
  if (token.startsWith(REFRESHED_TOKEN_PREFIX)) {
    return Math.random() < MOCK_401_PROB
  }
  return false
}

export function shouldSimulateHealthFail(): boolean {
  return Math.random() < MOCK_HEALTH_FAIL_PROB
}

export function pageResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
) {
  return { items, total, page, pageSize }
}

export function applySort<T>(arr: T[], query: Record<string, unknown>): T[] {
  const sortParam = String(query.sort ?? '').trim()
  const orderParam = String(query.order ?? '').trim()
  if (!sortParam || !orderParam) return arr
  const result = [...arr]
  const fields = sortParam.split(',').map((s) => s.trim())
  const orders = orderParam.split(',').map((s) => s.trim() as 'asc' | 'desc')
  for (let i = fields.length - 1; i >= 0; i--) {
    const f = fields[i]
    const o = orders[i] ?? 'asc'
    result.sort((a, b) => {
      const av = (a as Record<string, unknown>)[f]
      const bv = (b as Record<string, unknown>)[f]
      const cmp =
        av == null && bv == null
          ? 0
          : av == null
            ? 1
            : bv == null
              ? -1
              : String(av).localeCompare(String(bv), undefined, {
                  numeric: true,
                })
      return o === 'asc' ? cmp : -cmp
    })
  }
  return result
}
