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
import { RoleListFilter } from '@/components/refine-ui/table/role-list-filter'
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
import type { Role } from '@/types/role'

export const RoleList = () => {
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
  } = useTable<Role>({
    resource: 'roles',
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
    resource: 'roles',
    action: 'delete',
  })
  const canBulkDelete = canDelete?.can ?? false

  const { mutate: deleteMany } = useDeleteMany()
  const [isDeleting, setIsDeleting] = useState(false)

  const roles = Array.isArray(result?.data) ? result.data : []
  const total = result?.total ?? 0

  const toggleSelectAll = () => {
    if (selectedIds.size === roles.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(roles.map((r) => String(r.id))))
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
      { resource: 'roles', ids },
      {
        onSuccess: () => {
          setSelectedIds(new Set())
          setIsDeleting(false)
          invalidate({ resource: 'roles', invalidates: ['list'] })
          open?.({
            type: 'success',
            message: t('notifications.deleteSuccess', { resource: 'Roles' }),
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
                t('notifications.deleteError', { resource: 'Roles' })
          open?.({ type: 'error', message: msg })
        },
      }
    )
  }

  const colCount = (showIdColumn ? 1 : 0) + 4
  const hasActiveFilters = (filters?.length ?? 0) > 0

  return (
    <ListView>
      <ListViewHeader resource="roles" />
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
          <RoleListFilter
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
                      roles.length > 0 && selectedIds.size === roles.length
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
                  {t('roles.name')}
                </SortableTableHead>
                <TableHead>{t('roles.description')}</TableHead>
                <TableHead className="w-[120px] text-right">
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colCount + 1}>
                    <TableEmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role: Role) => (
                  <TableRow
                    key={role.id}
                    className="transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted/60"
                    data-state={
                      selectedIds.has(String(role.id)) ? 'selected' : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(String(role.id))}
                        onCheckedChange={() => toggleSelect(String(role.id))}
                      />
                    </TableCell>
                    {showIdColumn && (
                      <TableCell className="font-mono text-xs">
                        {role.id}
                      </TableCell>
                    )}
                    <TableCell>
                      <ShowButton
                        resource="roles"
                        recordItemId={role.id}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-normal hover:bg-transparent hover:underline"
                      >
                        {role.name}
                      </ShowButton>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {role.description ?? '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ShowButton
                          resource="roles"
                          recordItemId={role.id}
                          variant="outline"
                          size="sm"
                        />
                        <EditButton
                          resource="roles"
                          recordItemId={role.id}
                          variant="outline"
                          size="sm"
                        />
                        <DeleteButton
                          resource="roles"
                          recordItemId={role.id}
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
