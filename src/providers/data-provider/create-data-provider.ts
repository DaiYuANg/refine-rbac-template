/**
 * Custom Data Provider - see README for spec.
 * - 1-based pagination (enforced in adapter)
 * - Shared httpClient with auth + error normalization
 * - Backend-agnostic via adapters
 */

import type {
  DataProvider,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  CreateParams,
  CreateResponse,
  CreateManyParams,
  CreateManyResponse,
  UpdateParams,
  UpdateResponse,
  UpdateManyParams,
  UpdateManyResponse,
  DeleteOneParams,
  DeleteOneResponse,
  DeleteManyParams,
  DeleteManyResponse,
  GetManyParams,
  GetManyResponse,
  CustomParams,
  CustomResponse,
  BaseRecord,
} from '@refinedev/core'
import {
  buildRestRbacListQuery,
  fromRestRbacListResponse,
} from './adapters/rest-rbac'
import type { PageRequest } from './types'
import type { AxiosInstance } from 'axios'

export interface CreateDataProviderOptions {
  apiUrl: string
  httpClient: AxiosInstance
}

export function createDataProvider(
  options: CreateDataProviderOptions
): DataProvider {
  const { apiUrl, httpClient } = options
  const base = apiUrl.replace(/\/$/, '')

  const resourceUrl = (resource: string, id?: BaseRecord['id']) =>
    id !== undefined ? `${base}/${resource}/${id}` : `${base}/${resource}`

  return {
    getApiUrl: () => base,

    getList: async <TData extends BaseRecord = BaseRecord>(
      params: GetListParams
    ): Promise<GetListResponse<TData>> => {
      const { resource, pagination, filters, sorters } = params
      const {
        currentPage = 1,
        pageSize = 10,
        mode = 'server',
      } = pagination ?? {}
      const pageRequest: PageRequest = { page: currentPage, pageSize }

      let url = resourceUrl(resource)
      if (mode === 'server') {
        const query = buildRestRbacListQuery({
          resource,
          pagination: pageRequest,
          filters,
          sorters,
        })
        url = `${url}?${query}`
      }

      const { data } = await httpClient.get<
        | TData[]
        | { items: TData[]; total: number; page?: number; pageSize?: number }
      >(url)
      return fromRestRbacListResponse(data ?? [])
    },

    getOne: async <TData extends BaseRecord = BaseRecord>(
      params: GetOneParams
    ): Promise<GetOneResponse<TData>> => {
      const { resource, id } = params
      const { data } = await httpClient.get<TData>(resourceUrl(resource, id))
      return { data }
    },

    getMany: async <TData extends BaseRecord = BaseRecord>(
      params: GetManyParams
    ): Promise<GetManyResponse<TData>> => {
      const { resource, ids } = params
      const query = new URLSearchParams({ id: ids.join(',') }).toString()
      const { data } = await httpClient.get<TData[]>(
        `${resourceUrl(resource)}?${query}`
      )
      return { data: Array.isArray(data) ? data : [] }
    },

    create: async <TData extends BaseRecord = BaseRecord, TVariables = object>(
      params: CreateParams<TVariables>
    ): Promise<CreateResponse<TData>> => {
      const { resource, variables } = params
      const { data } = await httpClient.post<TData>(
        resourceUrl(resource),
        variables
      )
      return { data }
    },

    createMany: async <
      TData extends BaseRecord = BaseRecord,
      TVariables = object,
    >(
      params: CreateManyParams<TVariables>
    ): Promise<CreateManyResponse<TData>> => {
      const { resource, variables } = params
      const { data } = await httpClient.post<TData[]>(
        `${resourceUrl(resource)}/bulk`,
        { items: variables }
      )
      return { data: Array.isArray(data) ? data : [] }
    },

    update: async <TData extends BaseRecord = BaseRecord, TVariables = object>(
      params: UpdateParams<TVariables>
    ): Promise<UpdateResponse<TData>> => {
      const { resource, id, variables } = params
      const { data } = await httpClient.patch<TData>(
        resourceUrl(resource, id),
        variables
      )
      return { data }
    },

    updateMany: async <
      TData extends BaseRecord = BaseRecord,
      TVariables = object,
    >(
      params: UpdateManyParams<TVariables>
    ): Promise<UpdateManyResponse<TData>> => {
      const { resource, ids, variables } = params
      const query = new URLSearchParams({ id: ids.join(',') }).toString()
      const { data } = await httpClient.patch<TData[]>(
        `${resourceUrl(resource)}/bulk?${query}`,
        variables
      )
      return { data: Array.isArray(data) ? data : [] }
    },

    deleteOne: async <
      TData extends BaseRecord = BaseRecord,
      TVariables = object,
    >(
      params: DeleteOneParams<TVariables>
    ): Promise<DeleteOneResponse<TData>> => {
      const { resource, id } = params
      const { data } = await httpClient.delete<TData>(resourceUrl(resource, id))
      return { data: data ?? ({} as TData) }
    },

    deleteMany: async <
      TData extends BaseRecord = BaseRecord,
      TVariables = object,
    >(
      params: DeleteManyParams<TVariables>
    ): Promise<DeleteManyResponse<TData>> => {
      const { resource, ids } = params
      const query = new URLSearchParams({ id: ids.join(',') }).toString()
      const { data } = await httpClient.delete<TData[]>(
        `${resourceUrl(resource)}?${query}`
      )
      return { data: Array.isArray(data) ? data : [] }
    },

    custom: async <
      TData extends BaseRecord = BaseRecord,
      TQuery = unknown,
      TPayload = unknown,
    >(
      params: CustomParams<TQuery, TPayload>
    ): Promise<CustomResponse<TData>> => {
      const { url, method, payload, query, headers } = params
      let fullUrl = url.startsWith('http') ? url : url
      if (query && Object.keys(query).length > 0) {
        const qs = new URLSearchParams(
          Object.fromEntries(
            Object.entries(query).map(([k, v]) => [k, String(v)])
          )
        ).toString()
        fullUrl = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${qs}`
      }

      let response
      switch (method) {
        case 'post':
        case 'put':
        case 'patch':
          response = await httpClient[method]<TData>(fullUrl, payload, {
            headers,
          })
          break
        case 'delete':
          response = await httpClient.delete<TData>(fullUrl, {
            data: payload,
            headers,
          })
          break
        default:
          response = await httpClient.get<TData>(fullUrl, { headers })
      }

      return { data: response.data }
    },
  }
}
