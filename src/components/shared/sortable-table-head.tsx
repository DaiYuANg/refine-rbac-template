'use client'

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { TableHead } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { CrudSort } from '@refinedev/core'

export type SortableTableHeadProps = {
  children: React.ReactNode
  field: string
  sorters: CrudSort[]
  onSort: (sorters: CrudSort[]) => void
  className?: string
}

export const SortableTableHead = ({
  children,
  field,
  sorters,
  onSort,
  className,
}: SortableTableHeadProps) => {
  const current = sorters.find((s) => s.field === field)
  const order = current?.order ?? null

  const handleClick = () => {
    if (order === 'asc') {
      onSort([{ field, order: 'desc' }])
    } else if (order === 'desc') {
      onSort([])
    } else {
      onSort([{ field, order: 'asc' }])
    }
  }

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 font-medium hover:bg-transparent"
        onClick={handleClick}
      >
        {children}
        {order === 'asc' && <ArrowUp className="ml-1 size-4" />}
        {order === 'desc' && <ArrowDown className="ml-1 size-4" />}
        {!order && <ArrowUpDown className="ml-1 size-4 opacity-50" />}
      </Button>
    </TableHead>
  )
}
