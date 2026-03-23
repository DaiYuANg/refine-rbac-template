import { defineMock } from 'vite-plugin-mock-dev-server'
import { permissionGroups } from './data'
import { shouldSimulate401, pageResponse, applySort } from './utils'

async function maybeDelay() {
  if (Math.random() < 0.3) {
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 700))
  }
}

export default defineMock([
  {
    url: '/api/permission-groups',
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
          .map((id) => permissionGroups.value.find((g) => g.id === id))
          .filter(Boolean)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(items))
        return
      }
      const page = parseInt(query.page ?? '1', 10)
      const pageSize = parseInt(query.pageSize ?? '10', 10)
      const q = query.q?.trim()

      let filtered = [...permissionGroups.value]
      if (q) {
        const lower = q.toLowerCase()
        filtered = filtered.filter(
          (g) =>
            g.name.toLowerCase().includes(lower) ||
            (g.description ?? '').toLowerCase().includes(lower)
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
    url: '/api/permission-groups/:id',
    method: 'GET',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const id = (req.params as { id: string }).id
      const item = permissionGroups.value.find((g) => g.id === id)
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
    url: '/api/permission-groups',
    method: 'POST',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const body = req.body as Record<string, unknown>
      const item = {
        name: body.name ?? '',
        id: String(permissionGroups.value.length + 1),
        createdAt: new Date().toISOString(),
        ...body,
      }
      permissionGroups.value.push(
        item as (typeof permissionGroups.value)[number]
      )
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(item))
    },
  },
  {
    url: '/api/permission-groups/:id',
    method: 'PATCH',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const id = (req.params as { id: string }).id
      const idx = permissionGroups.value.findIndex((g) => g.id === id)
      if (idx === -1) {
        res.statusCode = 404
        res.end()
        return
      }
      const body = req.body as Partial<{ name: string; description?: string }>
      permissionGroups.value[idx] = { ...permissionGroups.value[idx], ...body }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(permissionGroups.value[idx]))
    },
  },
  {
    url: '/api/permission-groups/:id',
    method: 'DELETE',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const id = (req.params as { id: string }).id
      const idx = permissionGroups.value.findIndex((g) => g.id === id)
      if (idx === -1) {
        res.statusCode = 404
        res.end()
        return
      }
      permissionGroups.value.splice(idx, 1)
      res.statusCode = 200
      res.end()
    },
  },
  {
    url: '/api/permission-groups/bulk',
    method: 'POST',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const body = req.body as { items?: Record<string, unknown>[] }
      const items = body?.items ?? []
      const created = items.map((item, i) => {
        const rec = {
          name: '',
          id: String(permissionGroups.value.length + i + 1),
          createdAt: new Date().toISOString(),
          ...item,
        }
        permissionGroups.value.push(
          rec as (typeof permissionGroups.value)[number]
        )
        return rec
      })
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(created))
    },
  },
  {
    url: '/api/permission-groups/bulk',
    method: 'PATCH',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const query = req.query as Record<string, string>
      const ids = (query.id ?? '').split(',').filter(Boolean)
      const body = req.body as Partial<{ name: string; description?: string }>
      const updated = ids
        .map((id) => {
          const idx = permissionGroups.value.findIndex((g) => g.id === id)
          if (idx === -1) return null
          permissionGroups.value[idx] = {
            ...permissionGroups.value[idx],
            ...body,
          }
          return permissionGroups.value[idx]
        })
        .filter(Boolean)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(updated))
    },
  },
  {
    url: '/api/permission-groups',
    method: 'DELETE',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const query = req.query as Record<string, string>
      const idParam = query.id
      if (!idParam) {
        res.statusCode = 400
        res.end()
        return
      }
      const ids = idParam.split(',')
      const deleted: unknown[] = []
      for (const id of ids) {
        const idx = permissionGroups.value.findIndex((g) => g.id === id)
        if (idx !== -1) {
          deleted.push(permissionGroups.value[idx])
          permissionGroups.value.splice(idx, 1)
        }
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(deleted))
    },
  },
])
