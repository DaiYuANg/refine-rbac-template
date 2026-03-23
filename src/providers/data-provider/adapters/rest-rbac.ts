/**
 * Adapter for backends implementing the REST API contract (see README).
 * Uses AGENTS.md data structures: PageRequest, PageResponse.
 * No simple-rest (_start/_end, X-Total-Count).
 */

import type { CrudFilter, CrudSort } from '@refinedev/core'
import type { PageRequest } from '../types'

const OP_SUFFIX: Record<string, string> = {
  eq: '_eq',
  ne: '_ne',
  gte: '_gte',
  lte: '_lte',
  contains: '_like',
}

function mapOperator(op: string): string {
  return OP_SUFFIX[op] ?? ''
}

function buildFilters(filters?: CrudFilter[]): Record<string, string | number> {
  const out: Record<string, string | number> = {}
  if (!filters?.length) return out
  for (const f of filters) {
    if ('key' in f && (f.operator === 'or' || f.operator === 'and')) continue
    if ('field' in f) {
      const { field, operator, value } = f
      if (field === 'q') {
        out.q = value
        continue
      }
      const suffix = mapOperator(operator)
      out[`${field}${suffix}`] = value
    }
  }
  return out
}

function buildSort(sorters?: CrudSort[]): { sort?: string; order?: string } {
  if (!sorters?.length) return {}
  const sort = sorters.map((s) => s.field).join(',')
  const order = sorters.map((s) => s.order).join(',')
  return { sort, order }
}

export interface RestRbacListParams {
  resource: string
  pagination: PageRequest
  filters?: CrudFilter[]
  sorters?: CrudSort[]
}

/** Build query string: page, pageSize (1-based), filters, sort */
export function buildRestRbacListQuery(params: RestRbacListParams): string {
  const { pagination, filters, sorters } = params
  const query: Record<string, string | number> = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...buildFilters(filters),
    ...buildSort(sorters),
  }
  return new URLSearchParams(
    Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)]))
  ).toString()
}

/** Parse backend PageResponse or array → Refine GetListResponse */
export function fromRestRbacListResponse<T>(
  data: T[] | { items?: T[]; total?: number; page?: number; pageSize?: number }
): { data: T[]; total: number } {
  if (Array.isArray(data)) {
    return { data, total: data.length }
  }
  return { data: data.items ?? [], total: data.total ?? 0 }
}
