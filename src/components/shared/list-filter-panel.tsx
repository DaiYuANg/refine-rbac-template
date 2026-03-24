'use client'

import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

type ListFilterPanelProps = PropsWithChildren<{
  open: boolean
  onOpenChange: (open: boolean) => void
  hasActiveFilters?: boolean
  onReset?: () => void
  className?: string
}>

export const ListFilterPanel = ({
  children,
  open,
  onOpenChange,
  hasActiveFilters = false,
  onReset,
  className,
}: ListFilterPanelProps) => {
  const { t } = useTranslation()

  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className={className}>
      <div className="flex items-center justify-between gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="group gap-2">
            <SlidersHorizontal className="size-4" />
            {t('list.filters')}
            {hasActiveFilters && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {t('list.active')}
              </span>
            )}
            <ChevronDown
              className={cn(
                'size-4 transition-transform duration-200',
                open && 'rotate-180'
              )}
            />
          </Button>
        </CollapsibleTrigger>
        {hasActiveFilters && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            {t('list.clearFilters')}
          </Button>
        )}
      </div>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  )
}
