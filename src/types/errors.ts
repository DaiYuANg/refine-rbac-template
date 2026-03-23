/**
 * Typed error model for centralized error handling.
 * Business pages must not parse backend error structures directly.
 */

export type ApiErrorKind =
  | 'unauthorized'
  | 'forbidden'
  | 'validation'
  | 'not_found'
  | 'unknown'

export interface NormalizedApiError {
  kind: ApiErrorKind
  message: string
  statusCode?: number
  fieldErrors?: Record<string, string[]>
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    const status = axiosError.response?.status
    const data = axiosError.response?.data
    const message =
      (data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : null) ??
      (data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : null) ??
      axiosError.message ??
      'Unknown error'

    if (status === 401) {
      return { kind: 'unauthorized', message, statusCode: status }
    }
    if (status === 403) {
      return { kind: 'forbidden', message, statusCode: status }
    }
    if (status === 404) {
      return { kind: 'not_found', message, statusCode: status }
    }
    if (status === 400 || status === 422) {
      const fieldErrors =
        data && typeof data === 'object' && 'errors' in data
          ? (data as { errors: Record<string, string[]> }).errors
          : undefined
      return {
        kind: 'validation',
        message,
        statusCode: status,
        fieldErrors,
      }
    }
    return {
      kind: 'unknown',
      message,
      statusCode: status,
    }
  }

  const message =
    error instanceof Error ? error.message : String(error ?? 'Unknown error')
  return { kind: 'unknown', message }
}
