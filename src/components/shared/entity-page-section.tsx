'use client'

import type { PropsWithChildren } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

type EntityPageBodyProps = PropsWithChildren<{
  className?: string
}>

export const EntityPageBody = ({
  children,
  className,
}: EntityPageBodyProps) => (
  <div className={cn('flex flex-col gap-6 max-w-3xl', className)}>
    {children}
  </div>
)

type EntitySectionProps = PropsWithChildren<{
  title?: string
  description?: string
  className?: string
  contentClassName?: string
}>

export const EntitySection = ({
  title,
  description,
  children,
  className,
  contentClassName,
}: EntitySectionProps) => (
  <Card className={className}>
    {(title || description) && (
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    )}
    <CardContent
      className={cn(!title && !description && 'pt-6', contentClassName)}
    >
      {children}
    </CardContent>
  </Card>
)
