'use client'

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type RbacBadgeItem = {
  id: string
  label: string
  href?: string
  code?: string
  description?: string
  source?: string
}

type RbacBadgeGroupProps = {
  title: string
  items: RbacBadgeItem[]
  emptyText?: string
}

export const RbacBadgeGroup = ({
  title,
  items,
  emptyText,
}: RbacBadgeGroupProps) => {
  const { t } = useTranslation()

  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {items.length === 0 ? (
        <span className="text-sm text-muted-foreground">
          {emptyText ?? t('common.noData')}
        </span>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const badge = (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-xs transition-colors',
                  item.href && 'hover:bg-muted'
                )}
              >
                <ShieldCheck className="size-3" />
                <span>{item.label}</span>
                {item.code && (
                  <span className="font-mono text-muted-foreground">
                    {item.code}
                  </span>
                )}
              </span>
            )

            const content = (
              <div className="max-w-[260px] space-y-1">
                <p className="font-medium">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
                {item.source && (
                  <p className="text-xs text-muted-foreground">{item.source}</p>
                )}
              </div>
            )

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  {item.href ? <Link to={item.href}>{badge}</Link> : badge}
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>{content}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      )}
    </div>
  )
}
