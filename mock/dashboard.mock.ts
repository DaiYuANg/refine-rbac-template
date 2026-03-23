import { defineMock } from 'vite-plugin-mock-dev-server'
import {
  DASHBOARD_STAT_CARDS,
  DASHBOARD_USER_ACTIVITY,
  DASHBOARD_ROLE_DISTRIBUTION,
  DASHBOARD_PERMISSION_GROUPS,
} from '../src/mocks/fixtures/dashboard'
import { shouldSimulate401 } from './utils'

async function maybeDelay() {
  if (Math.random() < 0.3) {
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 700))
  }
}

export default defineMock({
  url: '/api/dashboard/stats',
  method: 'GET',
  delay: [0, 800],
  response: async (req, res) => {
    await maybeDelay()
    if (shouldSimulate401(req)) {
      res.statusCode = 401
      res.end()
      return
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        statCards: DASHBOARD_STAT_CARDS,
        userActivity: DASHBOARD_USER_ACTIVITY,
        roleDistribution: DASHBOARD_ROLE_DISTRIBUTION,
        permissionGroups: DASHBOARD_PERMISSION_GROUPS,
      })
    )
  },
})
