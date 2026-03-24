'use client'

import { useTranslation } from 'react-i18next'
import { Inbox } from 'lucide-react'
import { TableLoadingState } from '@/components/shared/loading-indicator'

type TableRowsSkeletonProps = {
  rows?: number
}

export const TableRowsSkeleton = ({ rows = 6 }: TableRowsSkeletonProps) => (
  <TableLoadingState rows={rows} />
)

type TableEmptyStateProps = {
  title?: string
  description?: string
}

export const TableEmptyState = ({
  title,
  description,
}: TableEmptyStateProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <div className="rounded-full border bg-muted/40 p-3">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">{title ?? t('common.noData')}</p>
      <p className="text-xs text-muted-foreground">
        {description ?? t('list.emptyHint')}
      </p>
    </div>
  )
}
