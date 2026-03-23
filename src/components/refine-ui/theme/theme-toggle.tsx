'use client'

import { useTheme } from '@/components/refine-ui/theme/theme-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Moon, Sun, Monitor } from 'lucide-react'

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, setMode } = useTheme()

  const cycleTheme = () => {
    switch (mode) {
      case 'light':
        setMode('dark')
        break
      case 'dark':
        setMode('system')
        break
      case 'system':
        setMode('light')
        break
      default:
        setMode('light')
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      className={cn(
        'rounded-full',
        'border-sidebar-border',
        'bg-transparent',
        className,
        'h-10',
        'w-10'
      )}
    >
      <Sun
        className={cn(
          'h-[1.2rem]',
          'w-[1.2rem]',
          'rotate-0',
          'scale-100',
          'transition-all',
          'duration-200',
          {
            '-rotate-90 scale-0': mode === 'dark' || mode === 'system',
          }
        )}
      />
      <Moon
        className={cn(
          'absolute',
          'h-[1.2rem]',
          'w-[1.2rem]',
          'rotate-90',
          'scale-0',
          'transition-all',
          'duration-200',
          {
            'rotate-0 scale-100': mode === 'dark',
            'rotate-90 scale-0': mode === 'light' || mode === 'system',
          }
        )}
      />
      <Monitor
        className={cn(
          'absolute',
          'h-[1.2rem]',
          'w-[1.2rem]',
          'rotate-0',
          'scale-0',
          'transition-all',
          'duration-200',
          {
            'scale-100': mode === 'system',
            'scale-0': mode === 'light' || mode === 'dark',
          }
        )}
      />
      <span className="sr-only">Toggle theme (Light → Dark → System)</span>
    </Button>
  )
}

ThemeToggle.displayName = 'ThemeToggle'
