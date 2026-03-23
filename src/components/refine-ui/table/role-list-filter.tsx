'use client'

import { useState, useEffect, useCallback } from 'react'
import { useList } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CrudFilters } from '@refinedev/core'
import type { Role } from '@/types/role'

export type RoleListFilterProps = {
  filters?: CrudFilters
  onFiltersChange: (filters: CrudFilters) => void
}

const QUERY_FIELD = 'q'

function getFilterValue(filters?: CrudFilters): string {
  const f = filters?.find((x) => 'field' in x && x.field === QUERY_FIELD) as
    | { field: string; operator: string; value: string }
    | undefined
  return f?.value ?? ''
}

export function RoleListFilter({
  filters,
  onFiltersChange,
}: RoleListFilterProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(() => getFilterValue(filters))

  const currentFilter = getFilterValue(filters)

  useEffect(() => {
    setInputValue(currentFilter)
  }, [currentFilter])

  const { result: suggestionsResult } = useList<Role>({
    resource: 'roles',
    filters: inputValue.trim()
      ? [{ field: QUERY_FIELD, operator: 'eq', value: inputValue.trim() }]
      : undefined,
    pagination: { currentPage: 1, pageSize: 5, mode: 'server' },
    queryOptions: {
      enabled: open && inputValue.trim().length >= 1,
    },
  })

  const suggestions = Array.isArray(suggestionsResult?.data)
    ? suggestionsResult.data
    : []

  const applyFilter = useCallback(
    (value: string) => {
      const v = value.trim()
      if (!v) {
        onFiltersChange([])
      } else {
        onFiltersChange([{ field: QUERY_FIELD, operator: 'eq', value: v }])
      }
      setOpen(false)
    },
    [onFiltersChange]
  )

  const clearFilter = useCallback(() => {
    setInputValue('')
    onFiltersChange([])
    setOpen(false)
  }, [onFiltersChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      applyFilter(inputValue)
    }
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const hasActiveFilter = currentFilter.length > 0

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('roles.searchPlaceholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              className="pl-9 pr-9"
            />
            {hasActiveFilter && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clearFilter()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-[280px] overflow-hidden">
            {suggestions.length === 0 && !inputValue.trim() ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {t('roles.typeToSearch')}
              </p>
            ) : (
              <ScrollArea className="h-auto max-h-[280px]">
                <div className="p-1">
                  {suggestions.length > 0 && (
                    <div className="py-1">
                      <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {t('roles.suggestions')}
                      </p>
                      {suggestions.map((role: Role) => (
                        <button
                          key={role.id}
                          type="button"
                          className="flex w-full flex-col rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => applyFilter(role.name)}
                        >
                          <span>{role.name}</span>
                          {role.description && (
                            <span className="text-xs text-muted-foreground">
                              {role.description}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {inputValue.trim() && (
                    <div className="border-t py-1">
                      <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {t('common.search')}
                      </p>
                      <button
                        type="button"
                        className="flex w-full rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => applyFilter(inputValue)}
                      >
                        {t('roles.searchByKeyword', { keyword: inputValue })}
                      </button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {hasActiveFilter && (
        <Button variant="ghost" size="sm" onClick={clearFilter}>
          {t('buttons.cancel')}
        </Button>
      )}
    </div>
  )
}
