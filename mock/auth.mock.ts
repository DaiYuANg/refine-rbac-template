import { defineMock } from 'vite-plugin-mock-dev-server'
import { getMockIdentityByUsername } from '../src/mocks/fixtures/mock-identities'
import { shouldSimulate401, shouldSimulateHealthFail } from './utils'

export default defineMock([
  {
    url: '/api/health',
    method: 'GET',
    response: (req, res) => {
      if (shouldSimulateHealthFail()) {
        res.statusCode = 503
        res.end()
        return
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ status: 'UP' }))
    },
  },
  {
    url: '/api/auth/refresh',
    method: 'POST',
    body: { accessToken: `mock-jwt-token-${Date.now()}` },
  },
  {
    url: '/api/me',
    method: 'GET',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const auth = req.headers?.authorization ?? ''
      const token = (auth.replace(/^Bearer\s+/i, '') || '').trim()
      const identity = token.startsWith('mock:')
        ? getMockIdentityByUsername(token.slice(5))
        : getMockIdentityByUsername('admin@example.com')
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          id: identity.id,
          name: identity.name,
          email: identity.email,
          roles: identity.roles,
          permissions: identity.permissions,
        })
      )
    },
  },
])
