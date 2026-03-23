/**
 * Re-exports from framer-motion with project defaults.
 * Use for component-level animations (stagger, layout, gestures).
 * Page transitions are handled by View Transitions API via Link viewTransition.
 */

export {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  useMotionValue,
  useTransform,
} from 'framer-motion'

export type { HTMLMotionProps, Variants } from 'framer-motion'
