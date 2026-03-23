import { useCustom } from '@refinedev/core'
import { API_BASE_URL } from '@/constants'
import type { DashboardStats } from '@/types/dashboard'

export function useDashboardStats() {
  const { query } = useCustom<DashboardStats>({
    url: `${API_BASE_URL}/dashboard/stats`,
    method: 'get',
  })

  return {
    data: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
