'use client'

import React from 'react'
import { useTheme } from './theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Monitor, Check, Palette } from 'lucide-react'
import type { ThemeMode, ThemeColor } from './theme-provider'

type ModeOption = {
  value: ThemeMode
  label: string
  icon: React.ReactNode
}

type ColorOption = {
  value: ThemeColor
  label: string
}

const modeOptions: ModeOption[] = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
]

const colorOptions: ColorOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'slate', label: 'Slate' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'violet', label: 'Violet' },
]

export function ThemeSelect() {
  const { mode, color, setMode, setColor } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <Palette className="absolute h-4 w-4 scale-0 opacity-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
          <Monitor className="h-3.5 w-3.5" />
          Mode
        </DropdownMenuLabel>
        {modeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setMode(option.value)}
            className="flex cursor-pointer items-center gap-2"
          >
            {option.icon}
            <span>{option.label}</span>
            {mode === option.value && (
              <Check className="ml-auto h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
          <Palette className="h-3.5 w-3.5" />
          Color
        </DropdownMenuLabel>
        {colorOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setColor(option.value)}
            className="flex cursor-pointer items-center gap-2"
          >
            <span>{option.label}</span>
            {color === option.value && (
              <Check className="ml-auto h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

ThemeSelect.displayName = 'ThemeSelect'
