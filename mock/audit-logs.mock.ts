import { defineMock } from 'vite-plugin-mock-dev-server'
import { auditLogs } from './data'
import { shouldSimulate401 } from './utils'

export default defineMock([
  {
    url: '/api/audit-logs',
    method: 'GET',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const query = req.query as Record<string, string>
      const resource = query.resource?.trim()
      const action = query.action?.trim()
      const metaId = query['meta.id']?.trim()
      const authorId = query.authorId?.trim()

      let filtered = [...auditLogs.value]
      if (resource) {
        filtered = filtered.filter((l) => l.resource === resource)
      }
      if (action) {
        filtered = filtered.filter((l) => l.action === action)
      }
      if (metaId) {
        filtered = filtered.filter(
          (l) => (l.meta as Record<string, unknown>)?.['id'] === metaId
        )
      }
      if (authorId) {
        filtered = filtered.filter(
          (l) => (l.author as Record<string, unknown>)?.['id'] === authorId
        )
      }

      const items = filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(items))
    },
  },
  {
    url: '/api/audit-logs',
    method: 'POST',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const body = req.body as {
        resource?: string
        action?: string
        author?: Record<string, unknown>
        data?: unknown
        previousData?: unknown
        meta?: Record<string, unknown>
      }
      const entry = {
        id: String(auditLogs.value.length + 1),
        resource: body.resource ?? '',
        action: body.action ?? '',
        author: body.author,
        data: body.data,
        previousData: body.previousData,
        meta: body.meta,
        name: `${body.action ?? 'action'} ${body.resource ?? ''} ${(body.meta as Record<string, unknown>)?.['id'] ?? ''}`.trim(),
        createdAt: new Date().toISOString(),
      }
      auditLogs.value.push(entry)
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(entry))
    },
  },
  {
    url: '/api/audit-logs/:id',
    method: 'PATCH',
    response: (req, res) => {
      if (shouldSimulate401(req)) {
        res.statusCode = 401
        res.end()
        return
      }
      const id = (req.params as { id: string }).id
      const idx = auditLogs.value.findIndex((l) => l.id === id)
      if (idx === -1) {
        res.statusCode = 404
        res.end()
        return
      }
      const body = req.body as Record<string, unknown>
      auditLogs.value[idx] = { ...auditLogs.value[idx], ...body }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(auditLogs.value[idx]))
    },
  },
])
