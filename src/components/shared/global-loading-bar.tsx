'use client'

import { useGlobalLoadingStore } from '@/stores/global-loading-store'

/**
 * Thin progress bar at top of viewport when any API request is in progress.
 * Uses shadcn design tokens for consistency.
 */
export function GlobalLoadingBar() {
  const count = useGlobalLoadingStore((s) => s.count)
  const visible = count > 0

  if (!visible) return null

  return (
    <div
      role="progressbar"
      aria-valuetext="Loading"
      className="fixed left-0 top-0 z-[9999] h-0.5 w-full overflow-hidden bg-primary/20"
    >
      <div
        className="h-full w-1/3 min-w-[100px] bg-primary"
        style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
      />
    </div>
  )
}
