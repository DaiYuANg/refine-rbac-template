'use client'

import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n'

const LOCALE_LABELS: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
}

type LanguageToggleProps = {
  className?: string
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { i18n } = useTranslation()

  const currentLocale = (i18n.language?.split('-')[0] || 'en') as Locale
  const resolvedLocale = ['zh', 'en'].includes(currentLocale)
    ? currentLocale
    : 'en'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'rounded-full border-sidebar-border bg-transparent h-10 w-10',
            className
          )}
        >
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(['zh', 'en'] as const).map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => i18n.changeLanguage(locale)}
            className={cn(resolvedLocale === locale && 'bg-accent')}
          >
            {LOCALE_LABELS[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

LanguageToggle.displayName = 'LanguageToggle'
