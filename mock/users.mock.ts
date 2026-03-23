import { defineMock } from 'vite-plugin-mock-dev-server'
import { users } from './data'
import { shouldSimulate401, pageResponse, applySort } from './utils'

async function maybeDelay() {
  if (Math.random() < 0.3) {
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 700))
  }
}

export default defineMock([
  {
    url: '/api/users',
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
          .map((id) => users.value.find((u) => u.id === id))
          .filter(Boolean)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(items))
        return
      }
      const page = parseInt(query.page ?? '1', 10)
      const pageSize = parseInt(query.pageSize ?? '10', 10)
      const q = query.q?.trim()
      const nameLike = query.name_like?.trim()
      const emailLike = query.email_like?.trim()

      let filtered = [...users.value]
      if (q) {
        const lower = q.toLowerCase()
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(lower) ||
            u.email.toLowerCase().includes(lower)
        )
      }
      if (nameLike) {
        filtered = filtered.filter((u) =>
          u.name.toLowerCase().includes(nameLike.toLowerCase())
        )
      }
      if (emailLike) {
        filtered = filtered.filter((u) =>
          u.email.toLowerCase().includes(emailLike.toLowerCase())
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
    url: '/api/users/:id',
    method: 'GET',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const id = (req.params as { id: string }).id
      const user = users.value.find((u) => u.id === id)
      if (!user) {
        res.statusCode = 404
        res.end()
        return
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(user))
    },
  },
  {
    url: '/api/users',
    method: 'POST',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const body = req.body as {
        email?: string
        name?: string
        roleIds?: string[]
      }
      const user = {
        id: String(users.value.length + 1),
        email: body.email ?? '',
        name: body.name ?? '',
        roleIds: body.roleIds ?? [],
        createdAt: new Date().toISOString(),
      }
      users.value.push(user)
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(user))
    },
  },
  {
    url: '/api/users/:id',
    method: 'PATCH',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const id = (req.params as { id: string }).id
      const idx = users.value.findIndex((u) => u.id === id)
      if (idx === -1) {
        res.statusCode = 404
        res.end()
        return
      }
      const body = req.body as Partial<{
        email: string
        name: string
        roleIds: string[]
      }>
      users.value[idx] = { ...users.value[idx], ...body }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(users.value[idx]))
    },
  },
  {
    url: '/api/users/:id',
    method: 'DELETE',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const id = (req.params as { id: string }).id
      const idx = users.value.findIndex((u) => u.id === id)
      if (idx === -1) {
        res.statusCode = 404
        res.end()
        return
      }
      users.value.splice(idx, 1)
      res.statusCode = 200
      res.end()
    },
  },
  {
    url: '/api/users/bulk',
    method: 'POST',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const body = req.body as { items?: { email?: string; name?: string }[] }
      const items = body?.items ?? []
      const created = items.map((item, i) => {
        const user = {
          id: String(users.value.length + i + 1),
          email: item.email ?? '',
          name: item.name ?? '',
          roleIds: [] as string[],
          createdAt: new Date().toISOString(),
        }
        users.value.push(user)
        return user
      })
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(created))
    },
  },
  {
    url: '/api/users/bulk',
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
        email: string
        name: string
        roleIds: string[]
      }>
      const updated = ids
        .map((id) => {
          const idx = users.value.findIndex((u) => u.id === id)
          if (idx === -1) return null
          users.value[idx] = { ...users.value[idx], ...body }
          return users.value[idx]
        })
        .filter(Boolean)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(updated))
    },
  },
  {
    url: '/api/users',
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
        const idx = users.value.findIndex((u) => u.id === id)
        if (idx !== -1) {
          deleted.push(users.value[idx])
          users.value.splice(idx, 1)
        }
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(deleted))
    },
  },
])
