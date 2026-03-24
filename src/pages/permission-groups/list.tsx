import { useState } from 'react'
import {
  useTable,
  useDeleteMany,
  useInvalidate,
  useNotification,
  useCan,
} from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ListView,
  ListViewHeader,
} from '@/components/refine-ui/views/list-view'
import { PermissionGroupListFilter } from '@/components/refine-ui/table/permission-group-list-filter'
import { ListPagination } from '@/components/shared/list-pagination'
import { ListToolbar } from '@/components/shared/list-toolbar'
import { ShowButton } from '@/components/refine-ui/buttons/show'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { useListDisplayStore } from '@/stores/list-display-store'
import { BulkDeleteButton } from '@/components/shared/bulk-delete-button'
import { SortableTableHead } from '@/components/shared/sortable-table-head'
import { ListFilterPanel } from '@/components/shared/list-filter-panel'
import {
  TableEmptyState,
  TableRowsSkeleton,
} from '@/components/shared/table-feedback'
import { normalizeApiError } from '@/types/errors'
import type { PermissionGroup } from '@/types/permission-group'

export const PermissionGroupList = () => {
  const { t } = useTranslation()
  const {
    tableQuery: { isLoading },
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    sorters,
    setSorters,
    result,
  } = useTable<PermissionGroup>({
    resource: 'permission-groups',
    pagination: { currentPage: 1, pageSize: 10, mode: 'server' },
    sorters: { mode: 'server' },
    syncWithLocation: true,
  })
  const { showIdColumn } = useListDisplayStore()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const invalidate = useInvalidate()
  const { open } = useNotification()

  const { data: canDelete } = useCan({
    resource: 'permission-groups',
    action: 'delete',
  })
  const canBulkDelete = canDelete?.can ?? false

  const { mutate: deleteMany } = useDeleteMany()
  const [isDeleting, setIsDeleting] = useState(false)

  const groups = Array.isArray(result?.data) ? result.data : []
  const total = result?.total ?? 0

  const toggleSelectAll = () => {
    if (selectedIds.size === groups.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(groups.map((g) => String(g.id))))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setIsDeleting(true)
    deleteMany(
      { resource: 'permission-groups', ids },
      {
        onSuccess: () => {
          setSelectedIds(new Set())
          setIsDeleting(false)
          invalidate({
            resource: 'permission-groups',
            invalidates: ['list'],
          })
          open?.({
            type: 'success',
            message: t('notifications.deleteSuccess', {
              resource: 'Permission Groups',
            }),
          })
        },
        onError: (err) => {
          setIsDeleting(false)
          const normalized = normalizeApiError(err)
          const msg =
            normalized.kind === 'forbidden' ||
            normalized.kind === 'unauthorized'
              ? t('buttons.notAccessTitle')
              : normalized.message ||
                t('notifications.deleteError', {
                  resource: 'Permission Groups',
                })
          open?.({ type: 'error', message: msg })
        },
      }
    )
  }

  const colCount = (showIdColumn ? 1 : 0) + 4
  const hasActiveFilters = (filters?.length ?? 0) > 0

  return (
    <ListView>
      <ListViewHeader resource="permission-groups" />
      <div className="rounded-lg border p-3 md:p-4">
        <ListToolbar
          bulkActions={
            <BulkDeleteButton
              count={selectedIds.size}
              onConfirm={handleBulkDelete}
              isLoading={isDeleting}
              hidden={!canBulkDelete}
            />
          }
        />
        <ListFilterPanel
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          hasActiveFilters={hasActiveFilters}
          onReset={() => setFilters([], 'replace')}
          className="mt-3"
        >
          <PermissionGroupListFilter
            filters={filters}
            onFiltersChange={(f) => setFilters(f, 'replace')}
          />
        </ListFilterPanel>
      </div>
      <div className="rounded-md border">
        {isLoading ? (
          <TableRowsSkeleton rows={6} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      groups.length > 0 && selectedIds.size === groups.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                {showIdColumn && <TableHead>ID</TableHead>}
                <SortableTableHead
                  field="name"
                  sorters={sorters}
                  onSort={setSorters}
                >
                  {t('permissionGroups.name')}
                </SortableTableHead>
                <TableHead>{t('permissionGroups.description')}</TableHead>
                <TableHead className="w-[120px] text-right">
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colCount + 1}>
                    <TableEmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group: PermissionGroup) => (
                  <TableRow
                    key={group.id}
                    className="transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted/60"
                    data-state={
                      selectedIds.has(String(group.id)) ? 'selected' : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(String(group.id))}
                        onCheckedChange={() => toggleSelect(String(group.id))}
                      />
                    </TableCell>
                    {showIdColumn && (
                      <TableCell className="font-mono text-xs">
                        {group.id}
                      </TableCell>
                    )}
                    <TableCell>
                      <ShowButton
                        resource="permission-groups"
                        recordItemId={group.id}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-normal hover:bg-transparent hover:underline"
                      >
                        {group.name}
                      </ShowButton>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {group.description ?? '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ShowButton
                          resource="permission-groups"
                          recordItemId={group.id}
                          variant="outline"
                          size="sm"
                        />
                        <EditButton
                          resource="permission-groups"
                          recordItemId={group.id}
                          variant="outline"
                          size="sm"
                        />
                        <DeleteButton
                          resource="permission-groups"
                          recordItemId={group.id}
                          size="sm"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="mt-4">
        <ListPagination
          currentPage={currentPage}
          total={total}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </ListView>
  )
}
