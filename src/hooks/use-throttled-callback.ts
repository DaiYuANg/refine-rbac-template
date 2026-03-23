import { useEffect, useMemo, useRef } from 'react'
import { throttle } from 'lodash-es'

/**
 * Returns a throttled callback that invokes the given function at most once per `wait` ms.
 * Useful for form submit buttons to prevent rapid repeated submissions.
 *
 * Uses leading: true so the first click fires immediately.
 *
 * @param fn - Callback to throttle
 * @param wait - Wait time in milliseconds (default 300)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  fn: T,
  wait = 300
): T => {
  const fnRef = useRef(fn)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  const throttled = useMemo(() => {
    // fnRef is read when the throttled function is invoked (e.g. in event handler), not during render
    /* eslint-disable react-hooks/refs */
    return throttle(
      (...args: unknown[]) => {
        fnRef.current(...args)
      },
      wait,
      { leading: true, trailing: false }
    )
    /* eslint-enable react-hooks/refs */
  }, [wait])

  useEffect(
    () => () => {
      throttled.cancel()
    },
    [throttled]
  )

  return throttled as unknown as T
}
