import { defineMock } from 'vite-plugin-mock-dev-server'
import { permissions } from './data'
import { shouldSimulate401, pageResponse, applySort } from './utils'

async function maybeDelay() {
  if (Math.random() < 0.3) {
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 700))
  }
}

export default defineMock([
  {
    url: '/api/permissions',
    method: 'GET',
    response: async (req, res) => {
      await maybeDelay()
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const query = req.query as Record<string, string>
      const idParam = query.id
      if (idParam) {
        const ids = idParam
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        const items = ids
          .map((id) => permissions.value.find((p) => p.id === id))
          .filter(Boolean)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(items))
        return
      }
      const page = parseInt(query.page ?? '1', 10)
      const pageSize = parseInt(query.pageSize ?? '10', 10)
      const groupIdEq = query.groupId_eq?.trim()
      const q = query.q?.trim()

      let filtered = [...permissions.value]
      if (groupIdEq) {
        filtered = filtered.filter((p) => p.groupId === groupIdEq)
      }
      if (q) {
        const lower = q.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.code.toLowerCase().includes(lower)
        )
      }
      filtered = applySort(filtered, query)
      const start = (page - 1) * pageSize
      const slice = filtered.slice(start, start + pageSize)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify(pageResponse(slice, filtered.length, page, pageSize))
      )
    },
  },
  {
    url: '/api/permissions/:id',
    method: 'GET',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const id = (req.params as { id: string }).id
      const item = permissions.value.find((p) => p.id === id)
      if (!item) {
        res.statusCode = 404
        res.end()
        return
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(item))
    },
  },
  {
    url: '/api/permissions/:id',
    method: 'PATCH',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const id = (req.params as { id: string }).id
      const idx = permissions.value.findIndex((p) => p.id === id)
      if (idx === -1) {
        res.statusCode = 404
        res.end()
        return
      }
      const body = req.body as Partial<{
        name: string
        code: string
        groupId: string | null
      }>
      permissions.value[idx] = { ...permissions.value[idx], ...body }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(permissions.value[idx]))
    },
  },
  {
    url: '/api/permissions/bulk',
    method: 'PATCH',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const query = req.query as Record<string, string>
      const ids = (query.id ?? '').split(',').filter(Boolean)
      const body = req.body as Partial<{
        name: string
        code: string
        groupId: string | null
      }>
      const updated = ids
        .map((id) => {
          const idx = permissions.value.findIndex((p) => p.id === id)
          if (idx === -1) return null
          permissions.value[idx] = { ...permissions.value[idx], ...body }
          return permissions.value[idx]
        })
        .filter(Boolean)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(updated))
    },
  },
])
