import { defineMock } from 'vite-plugin-mock-dev-server'
import { roles } from './data'
import { shouldSimulate401, pageResponse, applySort } from './utils'

const maybeDelay = async () => {
  if (Math.random() < 0.3) {
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 700))
  }
}

const crudMocks = (
  path: string,
  store: { value: { id: string }[] },
  defaultFields: Record<string, unknown>
) => [
  {
    url: `${path}`,
    method: 'GET',
    response: async (
      req: {
        query: Record<string, string>
        headers: { authorization?: string }
      },
      res: {
        statusCode: number
        setHeader: (a: string, b: string) => void
        end: (s?: string) => void
      }
    ) => {
      await maybeDelay()
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const query = req.query
      const idParam = query.id
      if (idParam) {
        const ids = idParam
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        const items = ids
          .map((id) => store.value.find((x) => x.id === id))
          .filter(Boolean)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(items))
        return
      }
      const page = parseInt(query.page ?? '1', 10)
      const pageSize = parseInt(query.pageSize ?? '10', 10)
      const q = query.q?.trim()
      let filtered = [...store.value]
      if (q) {
        const lower = q.toLowerCase()
        filtered = filtered.filter(
          (r) =>
            (r as Record<string, unknown>).name
              ?.toString()
              .toLowerCase()
              .includes(lower) ||
            (r as Record<string, unknown>).description
              ?.toString()
              .toLowerCase()
              .includes(lower)
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
    url: `${path}/:id`,
    method: 'GET',
    response: (
      req: { params: { id: string }; headers: { authorization?: string } },
      res: {
        statusCode: number
        setHeader: (a: string, b: string) => void
        end: (s?: string) => void
      }
    ) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const item = store.value.find((u) => u.id === req.params.id)
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
    url: path,
    method: 'POST',
    response: (
      req: {
        body: Record<string, unknown>
        headers: { authorization?: string }
      },
      res: {
        statusCode: number
        setHeader: (a: string, b: string) => void
        end: (s: string) => void
      }
    ) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const item = {
        ...defaultFields,
        ...req.body,
        id: String(store.value.length + 1),
        createdAt: new Date().toISOString(),
      }
      store.value.push(item as (typeof store.value)[number])
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(item))
    },
  },
  {
    url: `${path}/:id`,
    method: 'PATCH',
    response: (
      req: {
        params: { id: string }
        body: Record<string, unknown>
        headers: { authorization?: string }
      },
      res: {
        statusCode: number
        setHeader: (a: string, b: string) => void
        end: (s: string) => void
      }
    ) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const idx = store.value.findIndex((u) => u.id === req.params.id)
      if (idx === -1) {
        res.statusCode = 404
        res.end()
        return
      }
      store.value[idx] = {
        ...store.value[idx],
        ...req.body,
      } as (typeof store.value)[number]
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(store.value[idx]))
    },
  },
  {
    url: `${path}/:id`,
    method: 'DELETE',
    response: (
      req: { params: { id: string }; headers: { authorization?: string } },
      res: { statusCode: number; end: () => void }
    ) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const idx = store.value.findIndex((u) => u.id === req.params.id)
      if (idx === -1) {
        res.statusCode = 404
        res.end()
        return
      }
      store.value.splice(idx, 1)
      res.statusCode = 200
      res.end()
    },
  },
  {
    url: `${path}/bulk`,
    method: 'POST',
    response: (
      req: {
        body: { items?: Record<string, unknown>[] }
        headers: { authorization?: string }
      },
      res: {
        statusCode: number
        setHeader: (a: string, b: string) => void
        end: (s: string) => void
      }
    ) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const items = req.body?.items ?? []
      const created = items.map((item, i) => {
        const rec = {
          ...defaultFields,
          ...item,
          id: String(store.value.length + i + 1),
          createdAt: new Date().toISOString(),
        }
        store.value.push(rec as (typeof store.value)[number])
        return rec
      })
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(created))
    },
  },
  {
    url: `${path}/bulk`,
    method: 'PATCH',
    response: (
      req: {
        query: Record<string, string>
        body: Record<string, unknown>
        headers: { authorization?: string }
      },
      res: {
        statusCode: number
        setHeader: (a: string, b: string) => void
        end: (s: string) => void
      }
    ) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const ids = (req.query.id ?? '').split(',').filter(Boolean)
      const body = req.body
      const updated = ids
        .map((id) => {
          const idx = store.value.findIndex((u) => u.id === id)
          if (idx === -1) return null
          store.value[idx] = {
            ...store.value[idx],
            ...body,
          } as (typeof store.value)[number]
          return store.value[idx]
        })
        .filter(Boolean)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(updated))
    },
  },
  {
    url: path,
    method: 'DELETE',
    response: (
      req: {
        query: Record<string, string>
        headers: { authorization?: string }
      },
      res: {
        statusCode: number
        setHeader: (a: string, b: string) => void
        end: (s: string) => void
      }
    ) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const idParam = req.query.id
      if (!idParam) {
        res.statusCode = 400
        res.end()
        return
      }
      const ids = idParam.split(',')
      const deleted: unknown[] = []
      for (const id of ids) {
        const idx = store.value.findIndex((u) => u.id === id)
        if (idx !== -1) {
          deleted.push(store.value[idx])
          store.value.splice(idx, 1)
        }
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(deleted))
    },
  },
]

export default defineMock(crudMocks('/api/roles', roles, { name: '' }))
