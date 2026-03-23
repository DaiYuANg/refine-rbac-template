import type { AuditLogProvider } from '@refinedev/core'
import { API_BASE_URL } from '@/constants'
import { httpClient } from '../data-provider'

/**
 * Audit log provider for Refine.
 * CRUD operations (create, update, delete) are automatically logged when this provider is provided.
 * Uses shared httpClient for auth headers and interceptors.
 *
 * @see https://refine.dev/core/docs/guides-concepts/audit-logs/
 */
export const auditLogProvider: AuditLogProvider = {
  create: async (params) => {
    const { resource, action, author, data, previousData, meta } = params

    await httpClient.post(`${API_BASE_URL}/audit-logs`, {
      resource,
      action,
      author,
      data,
      previousData,
      meta,
    })

    return { success: true }
  },

  get: async (params) => {
    const { resource, action, meta, author } = params

    const searchParams = new URLSearchParams()
    if (resource) searchParams.set('resource', resource)
    if (action) searchParams.set('action', action)
    if (meta && typeof meta === 'object') {
      Object.entries(meta).forEach(([k, v]) => {
        if (v != null) searchParams.set(`meta.${k}`, String(v))
      })
    }
    if (author && typeof author === 'object' && author.id) {
      searchParams.set('authorId', String(author.id))
    }

    const query = searchParams.toString()
    const url = `${API_BASE_URL}/audit-logs${query ? `?${query}` : ''}`

    const { data } = await httpClient.get<{ items?: unknown[] } | unknown[]>(
      url
    )

    // Support both PageResponse { items } and plain array
    const items = Array.isArray(data) ? data : (data?.items ?? [])
    return items
  },

  update: async (params) => {
    const { id, name, ...rest } = params

    await httpClient.patch(`${API_BASE_URL}/audit-logs/${id}`, {
      name,
      ...rest,
    })

    return { success: true }
  },
}
