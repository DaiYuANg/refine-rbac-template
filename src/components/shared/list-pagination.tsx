'use client'

import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { type PageSize, PAGE_SIZES } from '@/constants/list'

export type ListPaginationProps = {
  currentPage: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: PageSize) => void
}

/** Show at most 5 page numbers around current */
const PAGE_WINDOW = 2

export function ListPagination({
  currentPage,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ListPaginationProps) {
  const { t } = useTranslation()
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  const startPage = Math.max(1, currentPage - PAGE_WINDOW)
  const endPage = Math.min(totalPages, currentPage + PAGE_WINDOW)
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  )

  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, total)

  return (
    <div className="flex flex-col items-end gap-4 sm:flex-row sm:justify-end sm:items-center">
      {onPageSizeChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              {pageSize} {t('pagination.perPage')}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {PAGE_SIZES.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => onPageSizeChange(size)}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <p className="text-sm text-muted-foreground text-right">
        {total === 0
          ? t('pagination.noItems')
          : t('pagination.range', { from, to, total })}
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text={t('pagination.previous')}
              onClick={() => canPrev && onPageChange(currentPage - 1)}
              disabled={!canPrev}
            />
          </PaginationItem>
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              text={t('pagination.next')}
              onClick={() => canNext && onPageChange(currentPage + 1)}
              disabled={!canNext}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
