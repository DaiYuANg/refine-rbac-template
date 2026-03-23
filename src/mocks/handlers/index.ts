import { http, HttpResponse } from 'msw'
import { env } from '@/config'
import { shouldSimulate401 } from '@/mocks/mock-auth'
import { MOCK_USERS } from '@/mocks/fixtures/users'
import { MOCK_ROLES } from '@/mocks/fixtures/roles'
import { MOCK_PERMISSIONS } from '@/mocks/fixtures/permissions'
import { MOCK_PERMISSION_GROUPS } from '@/mocks/fixtures/permission-groups'
import {
  DASHBOARD_STAT_CARDS,
  DASHBOARD_USER_ACTIVITY,
  DASHBOARD_ROLE_DISTRIBUTION,
  DASHBOARD_PERMISSION_GROUPS,
} from '@/mocks/fixtures/dashboard'

const API_BASE = env.apiBaseUrl

const users = [...MOCK_USERS]
const roles = [...MOCK_ROLES]
const permissions = [...MOCK_PERMISSIONS]
const permissionGroups = [...MOCK_PERMISSION_GROUPS]

/** PageResponse per README backend API contract */
function pageResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
) {
  return { items, total, page, pageSize }
}

function createCrudHandlers<T extends { id: string }>(
  path: string,
  store: T[],
  defaultFields: Partial<T>
) {
  return [
    http.get(`${API_BASE}${path}`, ({ request }) => {
      if (shouldSimulate401(request)) {
        return new HttpResponse(null, { status: 401 })
      }
      const url = new URL(request.url)
      const page = parseInt(url.searchParams.get('page') ?? '1', 10)
      const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10)
      const start = (page - 1) * pageSize
      const slice = store.slice(start, start + pageSize)
      return HttpResponse.json(
        pageResponse(slice, store.length, page, pageSize)
      )
    }),
    http.get(`${API_BASE}${path}/:id`, ({ request, params }) => {
      if (shouldSimulate401(request)) {
        return new HttpResponse(null, { status: 401 })
      }
      const item = store.find((u) => u.id === params.id)
      if (!item) return new HttpResponse(null, { status: 404 })
      return HttpResponse.json(item)
    }),
    http.post(`${API_BASE}${path}`, async ({ request }) => {
      if (shouldSimulate401(request)) {
        return new HttpResponse(null, { status: 401 })
      }
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
      if (shouldSimulate401(request)) {
        return new HttpResponse(null, { status: 401 })
      }
      const idx = store.findIndex((u) => u.id === params.id)
      if (idx === -1) return new HttpResponse(null, { status: 404 })
      const body = (await request.json()) as Partial<T>
      store[idx] = { ...store[idx], ...body }
      return HttpResponse.json(store[idx])
    }),
    http.delete(`${API_BASE}${path}/:id`, ({ params, request }) => {
      if (shouldSimulate401(request)) {
        return new HttpResponse(null, { status: 401 })
      }
      const idx = store.findIndex((u) => u.id === params.id)
      if (idx === -1) return new HttpResponse(null, { status: 404 })
      store.splice(idx, 1)
      return new HttpResponse(null, { status: 200 })
    }),
    http.post(`${API_BASE}${path}/bulk`, async ({ request }) => {
      if (shouldSimulate401(request)) {
        return new HttpResponse(null, { status: 401 })
      }
      const body = (await request.json()) as {
        items?: Record<string, unknown>[]
      }
      const items = body?.items ?? []
      const created = items.map((item, i) => {
        const rec = {
          ...defaultFields,
          ...item,
          id: String(store.length + i + 1),
          createdAt: new Date().toISOString(),
        } as unknown as T
        store.push(rec)
        return rec
      })
      return HttpResponse.json(created, { status: 201 })
    }),
    http.patch(`${API_BASE}${path}/bulk`, async ({ request }) => {
      if (shouldSimulate401(request)) {
        return new HttpResponse(null, { status: 401 })
      }
      const url = new URL(request.url)
      const ids = url.searchParams.get('id')?.split(',') ?? []
      const body = (await request.json()) as Partial<T>
      const updated: T[] = []
      for (const id of ids) {
        const idx = store.findIndex((u) => u.id === id)
        if (idx !== -1) {
          store[idx] = { ...store[idx], ...body } as T
          updated.push(store[idx])
        }
      }
      return HttpResponse.json(updated)
    }),
    http.delete(`${API_BASE}${path}`, ({ request }) => {
      if (shouldSimulate401(request)) {
        return new HttpResponse(null, { status: 401 })
      }
      const url = new URL(request.url)
      const idParam = url.searchParams.get('id')
      if (!idParam) return new HttpResponse(null, { status: 400 })
      const ids = idParam.split(',')
      const deleted: T[] = []
      for (const id of ids) {
        const idx = store.findIndex((u) => u.id === id)
        if (idx !== -1) {
          deleted.push(store[idx])
          store.splice(idx, 1)
        }
      }
      return HttpResponse.json(deleted)
    }),
  ]
}

export const handlers = [
  http.post(`${API_BASE}/auth/refresh`, () => {
    return HttpResponse.json({
      accessToken: `mock-jwt-token-${Date.now()}`,
    })
  }),

  http.get(`${API_BASE}/me`, ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    return HttpResponse.json({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      roles: [{ id: '1', name: '管理员' }],
      permissions: [
        'users:read',
        'users:write',
        'roles:read',
        'roles:write',
        'permissions:read',
        'permissions:write',
        'permission-groups:read',
        'permission-groups:write',
      ],
    })
  }),

  http.get(`${API_BASE}/dashboard/stats`, ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    return HttpResponse.json({
      statCards: DASHBOARD_STAT_CARDS,
      userActivity: DASHBOARD_USER_ACTIVITY,
      roleDistribution: DASHBOARD_ROLE_DISTRIBUTION,
      permissionGroups: DASHBOARD_PERMISSION_GROUPS,
    })
  }),

  // Users CRUD - README backend API (page, pageSize, PageResponse)
  http.get(`${API_BASE}/users`, ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') ?? '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10)

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

    const start = (page - 1) * pageSize
    const slice = filtered.slice(start, start + pageSize)
    return HttpResponse.json(
      pageResponse(slice, filtered.length, page, pageSize)
    )
  }),

  http.get(`${API_BASE}/users/:id`, ({ params, request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const user = users.find((u) => u.id === params.id)
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(user)
  }),

  http.post(`${API_BASE}/users`, async ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const body = (await request.json()) as {
      email: string
      name: string
      roleIds?: string[]
    }
    const user = {
      id: String(users.length + 1),
      email: body.email ?? '',
      name: body.name ?? '',
      roleIds: body.roleIds ?? [],
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    return HttpResponse.json(user, { status: 201 })
  }),

  http.patch(`${API_BASE}/users/:id`, async ({ params, request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const idx = users.findIndex((u) => u.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as Partial<{
      email: string
      name: string
      roleIds: string[]
    }>
    users[idx] = { ...users[idx], ...body }
    return HttpResponse.json(users[idx])
  }),

  http.delete(`${API_BASE}/users/:id`, ({ params, request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const idx = users.findIndex((u) => u.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    users.splice(idx, 1)
    return new HttpResponse(null, { status: 200 })
  }),

  http.post(`${API_BASE}/users/bulk`, async ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const body = (await request.json()) as {
      items?: { email?: string; name?: string }[]
    }
    const items = body?.items ?? []
    const created = items.map((item, i) => {
      const user = {
        id: String(users.length + i + 1),
        email: item.email ?? '',
        name: item.name ?? '',
        createdAt: new Date().toISOString(),
      }
      users.push(user)
      return user
    })
    return HttpResponse.json(created, { status: 201 })
  }),
  http.patch(`${API_BASE}/users/bulk`, async ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const url = new URL(request.url)
    const ids = url.searchParams.get('id')?.split(',') ?? []
    const body = (await request.json()) as Partial<{
      email: string
      name: string
      roleIds: string[]
    }>
    const updated = ids
      .map((id) => {
        const idx = users.findIndex((u) => u.id === id)
        if (idx === -1) return null
        users[idx] = { ...users[idx], ...body }
        return users[idx]
      })
      .filter(Boolean)
    return HttpResponse.json(updated)
  }),
  http.delete(`${API_BASE}/users`, ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const url = new URL(request.url)
    const idParam = url.searchParams.get('id')
    if (!idParam) return new HttpResponse(null, { status: 400 })
    const ids = idParam.split(',')
    const deleted: typeof users = []
    for (const id of ids) {
      const idx = users.findIndex((u) => u.id === id)
      if (idx !== -1) {
        deleted.push(users[idx])
        users.splice(idx, 1)
      }
    }
    return HttpResponse.json(deleted)
  }),

  // Roles - custom GET with q search (must be before createCrudHandlers)
  http.get(`${API_BASE}/roles`, ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') ?? '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10)
    const q = url.searchParams.get('q')?.trim()

    let filtered = [...roles]
    if (q) {
      const lower = q.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          (r.description ?? '').toLowerCase().includes(lower)
      )
    }

    const start = (page - 1) * pageSize
    const slice = filtered.slice(start, start + pageSize)
    return HttpResponse.json(
      pageResponse(slice, filtered.length, page, pageSize)
    )
  }),
  ...createCrudHandlers('/roles', roles, { name: '' }),

  // Permissions - custom GET with groupId_eq and q filter
  http.get(`${API_BASE}/permissions`, ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') ?? '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10)
    const groupIdEq = url.searchParams.get('groupId_eq')?.trim()
    const q = url.searchParams.get('q')?.trim()

    let filtered = [...permissions]
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

    const start = (page - 1) * pageSize
    const slice = filtered.slice(start, start + pageSize)
    return HttpResponse.json(
      pageResponse(slice, filtered.length, page, pageSize)
    )
  }),
  http.get(`${API_BASE}/permissions/:id`, ({ request, params }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const item = permissions.find((u) => u.id === params.id)
    if (!item) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(item)
  }),
  http.patch(`${API_BASE}/permissions/:id`, async ({ params, request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const idx = permissions.findIndex((u) => u.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as Partial<{
      name: string
      code: string
      groupId: string | null
    }>
    permissions[idx] = { ...permissions[idx], ...body }
    return HttpResponse.json(permissions[idx])
  }),
  http.patch(`${API_BASE}/permissions/bulk`, async ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const url = new URL(request.url)
    const ids = url.searchParams.get('id')?.split(',') ?? []
    const body = (await request.json()) as Partial<{
      name: string
      code: string
      groupId: string | null
    }>
    const updated: typeof permissions = []
    for (const id of ids) {
      const idx = permissions.findIndex((p) => p.id === id)
      if (idx !== -1) {
        permissions[idx] = { ...permissions[idx], ...body }
        updated.push(permissions[idx])
      }
    }
    return HttpResponse.json(updated)
  }),

  // Permission groups - custom GET with q search (must be before createCrudHandlers)
  http.get(`${API_BASE}/permission-groups`, ({ request }) => {
    if (shouldSimulate401(request)) {
      return new HttpResponse(null, { status: 401 })
    }
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') ?? '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10)
    const q = url.searchParams.get('q')?.trim()

    let filtered = [...permissionGroups]
    if (q) {
      const lower = q.toLowerCase()
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(lower) ||
          (g.description ?? '').toLowerCase().includes(lower)
      )
    }

    const start = (page - 1) * pageSize
    const slice = filtered.slice(start, start + pageSize)
    return HttpResponse.json(
      pageResponse(slice, filtered.length, page, pageSize)
    )
  }),
  ...createCrudHandlers('/permission-groups', permissionGroups, { name: '' }),
]
