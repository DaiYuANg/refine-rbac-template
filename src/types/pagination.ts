export type PageRequest = {
  page: number // 1-based
  pageSize: number
}

export type PageResponse<T> = {
  items: T[]
  total: number
  page: number // 1-based
  pageSize: number
}
