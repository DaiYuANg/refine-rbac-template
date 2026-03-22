import { lazy, Suspense, type ComponentType } from 'react'
import { env } from '@/config'

type DevtoolsProps = {
  initialIsOpen?: boolean
  buttonPosition?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'relative'
}

let LazyDevtools: ComponentType<DevtoolsProps> = () => null

if (env.isDev) {
  LazyDevtools = lazy(() =>
    import('@tanstack/react-query-devtools').then((m) => ({
      default: m.ReactQueryDevtools,
    }))
  )
}

/**
 * TanStack Query DevTools — only bundled / loaded in development (env.isDev).
 * Must render under Refine’s QueryClientProvider (inside Refine).
 */
export function ReactQueryDevtoolsPanel() {
  if (!env.isDev) return null

  return (
    <Suspense fallback={null}>
      <LazyDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </Suspense>
  )
}
