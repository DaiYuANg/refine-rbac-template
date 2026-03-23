'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeMode = 'dark' | 'light' | 'system'
export type ThemeColor =
  | 'default'
  | 'zinc'
  | 'slate'
  | 'blue'
  | 'green'
  | 'violet'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: ThemeMode
  defaultColor?: ThemeColor
  storageKey?: string
}

type ThemeProviderState = {
  mode: ThemeMode
  color: ThemeColor
  setMode: (mode: ThemeMode) => void
  setColor: (color: ThemeColor) => void
}

const initialState: ThemeProviderState = {
  mode: 'system',
  color: 'default',
  setMode: () => null,
  setColor: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

const MODE_STORAGE_KEY = 'refine-ui-theme-mode'
const COLOR_STORAGE_KEY = 'refine-ui-theme-color'

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColor = 'default',
  storageKey,
  ...props
}: ThemeProviderProps) {
  const modeKey = storageKey ? `${storageKey}-mode` : MODE_STORAGE_KEY
  const colorKey = storageKey ? `${storageKey}-color` : COLOR_STORAGE_KEY

  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(modeKey) as ThemeMode) || defaultTheme
  )
  const [color, setColorState] = useState<ThemeColor>(
    () => (localStorage.getItem(colorKey) as ThemeColor) || defaultColor
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')
    root.removeAttribute('data-theme')

    const resolvedMode =
      mode === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : mode

    root.classList.add(resolvedMode)
    if (color === 'default') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', color)
    }
  }, [mode, color])

  const value = {
    mode,
    color,
    setMode: (m: ThemeMode) => {
      localStorage.setItem(modeKey, m)
      setModeState(m)
    },
    setColor: (c: ThemeColor) => {
      localStorage.setItem(colorKey, c)
      setColorState(c)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    console.error('useTheme must be used within a ThemeProvider')
  }

  return context
}

ThemeProvider.displayName = 'ThemeProvider'
