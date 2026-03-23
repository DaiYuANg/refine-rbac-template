'use client'

import { useTranslation } from 'react-i18next'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export type ListPaginationProps = {
  currentPage: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

/** Show at most 5 page numbers around current */
const PAGE_WINDOW = 2

export function ListPagination({
  currentPage,
  total,
  pageSize,
  onPageChange,
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
    <div className="flex flex-col items-end gap-4 sm:flex-row sm:justify-end">
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
