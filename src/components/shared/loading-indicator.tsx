'use client'

import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type InlineLoadingIndicatorProps = {
  label?: string
  className?: string
}

export const InlineLoadingIndicator = ({
  label,
  className,
}: InlineLoadingIndicatorProps) => (
  <span className={cn('inline-flex items-center gap-2 text-sm', className)}>
    <Loader2 className="size-4 animate-spin" aria-hidden />
    {label && <span>{label}</span>}
  </span>
)

type PageLoadingStateProps = {
  title?: string
  subtitle?: string
  className?: string
}

export const PageLoadingState = ({
  title,
  subtitle,
  className,
}: PageLoadingStateProps) => {
  const { t } = useTranslation()

  return (
    <div className={cn('mx-auto w-full max-w-3xl space-y-4 p-4', className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <InlineLoadingIndicator label={title ?? t('loading.page')} />
      </div>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}

type TableLoadingStateProps = {
  rows?: number
}

export const TableLoadingState = ({ rows = 6 }: TableLoadingStateProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <InlineLoadingIndicator label={t('loading.tableData')} />
      </div>
      {Array.from({ length: rows }).map((_, idx) => (
        <Skeleton key={idx} className="h-10 w-full" />
      ))}
    </div>
  )
}
