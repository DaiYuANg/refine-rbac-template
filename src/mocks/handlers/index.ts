import { http, HttpResponse } from 'msw'
import { env } from '@/config'
import { MOCK_USERS } from '@/mocks/fixtures/users'
import { MOCK_ROLES } from '@/mocks/fixtures/roles'
import { MOCK_PERMISSIONS } from '@/mocks/fixtures/permissions'
import { MOCK_PERMISSION_GROUPS } from '@/mocks/fixtures/permission-groups'

const API_BASE = env.apiBaseUrl

const users = [...MOCK_USERS]
const roles = [...MOCK_ROLES]
const permissions = [...MOCK_PERMISSIONS]
const permissionGroups = [...MOCK_PERMISSION_GROUPS]

function createCrudHandlers<T extends { id: string }>(
  path: string,
  store: T[],
  defaultFields: Partial<T>,
) {
  return [
    http.get(`${API_BASE}${path}`, ({ request }) => {
      const url = new URL(request.url)
      const start = parseInt(url.searchParams.get('_start') ?? '0', 10)
      const end = parseInt(url.searchParams.get('_end') ?? '10', 10)
      const slice = store.slice(start, end)
      return HttpResponse.json(slice, {
        headers: { 'X-Total-Count': String(store.length) },
      })
    }),
    http.get(`${API_BASE}${path}/:id`, ({ params }) => {
      const item = store.find((u) => u.id === params.id)
      if (!item) return new HttpResponse(null, { status: 404 })
      return HttpResponse.json(item)
    }),
    http.post(`${API_BASE}${path}`, async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>
      const item = {
        ...defaultFields,
        ...body,
        id: String(store.length + 1),
        createdAt: new Date().toISOString(),
      } as unknown as T
      store.push(item)
      return HttpResponse.json(item, { status: 201 })
    }),
    http.patch(`${API_BASE}${path}/:id`, async ({ params, request }) => {
      const idx = store.findIndex((u) => u.id === params.id)
      if (idx === -1) return new HttpResponse(null, { status: 404 })
      const body = (await request.json()) as Partial<T>
      store[idx] = { ...store[idx], ...body }
      return HttpResponse.json(store[idx])
    }),
    http.delete(`${API_BASE}${path}/:id`, ({ params }) => {
      const idx = store.findIndex((u) => u.id === params.id)
      if (idx === -1) return new HttpResponse(null, { status: 404 })
      store.splice(idx, 1)
      return new HttpResponse(null, { status: 200 })
    }),
  ]
}

export const handlers = [
  http.get(`${API_BASE}/me`, () => {
    return HttpResponse.json({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
    })
  }),

  // Users CRUD - simple-rest contract
  http.get(`${API_BASE}/users`, ({ request }) => {
    const url = new URL(request.url)
    const start = parseInt(url.searchParams.get('_start') ?? '0', 10)
    const end = parseInt(url.searchParams.get('_end') ?? '10', 10)

    // Filter by q (keyword: name or email), name_like, email_like
    let filtered = [...users]
    const q = url.searchParams.get('q')?.trim()
    const nameLike = url.searchParams.get('name_like')?.trim()
    const emailLike = url.searchParams.get('email_like')?.trim()

    if (q) {
      const lower = q.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower)
      )
    }
    if (nameLike) {
      const lower = nameLike.toLowerCase()
      filtered = filtered.filter((u) => u.name.toLowerCase().includes(lower))
    }
    if (emailLike) {
      const lower = emailLike.toLowerCase()
      filtered = filtered.filter((u) => u.email.toLowerCase().includes(lower))
    }

    const slice = filtered.slice(start, end)
    return HttpResponse.json(slice, {
      headers: { 'X-Total-Count': String(filtered.length) },
    })
  }),

  http.get(`${API_BASE}/users/:id`, ({ params }) => {
    const user = users.find((u) => u.id === params.id)
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(user)
  }),

  http.post(`${API_BASE}/users`, async ({ request }) => {
    const body = (await request.json()) as { email: string; name: string; avatar?: string }
    const user = {
      id: String(users.length + 1),
      email: body.email ?? '',
      name: body.name ?? '',
      avatar: body.avatar,
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    return HttpResponse.json(user, { status: 201 })
  }),

  http.patch(`${API_BASE}/users/:id`, async ({ params, request }) => {
    const idx = users.findIndex((u) => u.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as Partial<{ email: string; name: string; avatar: string }>
    users[idx] = { ...users[idx], ...body }
    return HttpResponse.json(users[idx])
  }),

  http.delete(`${API_BASE}/users/:id`, ({ params }) => {
    const idx = users.findIndex((u) => u.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    users.splice(idx, 1)
    return new HttpResponse(null, { status: 200 })
  }),

  ...createCrudHandlers('/roles', roles, { name: '' }),
  ...createCrudHandlers('/permissions', permissions, { name: '', code: '' }),
  ...createCrudHandlers('/permission-groups', permissionGroups, { name: '' }),
]
