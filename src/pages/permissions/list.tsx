import { useState } from 'react'
import { useTable } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ListView,
  ListViewHeader,
} from '@/components/refine-ui/views/list-view'
import { PermissionListFilter } from '@/components/refine-ui/table/permission-list-filter'
import { ListPagination } from '@/components/shared/list-pagination'
import { ListToolbar } from '@/components/shared/list-toolbar'
import { ShowButton } from '@/components/refine-ui/buttons/show'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useListDisplayStore } from '@/stores/list-display-store'
import { SortableTableHead } from '@/components/shared/sortable-table-head'
import { ListFilterPanel } from '@/components/shared/list-filter-panel'
import {
  TableEmptyState,
  TableRowsSkeleton,
} from '@/components/shared/table-feedback'
import type { Permission } from '@/types/permission'

export const PermissionList = () => {
  const { t } = useTranslation()
  const [isFilterOpen, setIsFilterOpen] = useState(true)
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
  } = useTable<Permission>({
    resource: 'permissions',
    pagination: { currentPage: 1, pageSize: 10, mode: 'server' },
    sorters: { mode: 'server' },
    syncWithLocation: true,
  })
  const { showIdColumn } = useListDisplayStore()

  const permissions = Array.isArray(result?.data) ? result.data : []
  const total = result?.total ?? 0

  const colCount = (showIdColumn ? 1 : 0) + 3
  const hasActiveFilters = (filters?.length ?? 0) > 0

  return (
    <ListView>
      <ListViewHeader resource="permissions" canCreate={false} />
      <div className="rounded-lg border p-3 md:p-4">
        <ListToolbar />
        <ListFilterPanel
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          hasActiveFilters={hasActiveFilters}
          onReset={() => setFilters([], 'replace')}
          className="mt-3"
        >
          <PermissionListFilter
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
                {showIdColumn && <TableHead>ID</TableHead>}
                <SortableTableHead
                  field="name"
                  sorters={sorters}
                  onSort={setSorters}
                >
                  {t('permissions.name')}
                </SortableTableHead>
                <SortableTableHead
                  field="code"
                  sorters={sorters}
                  onSort={setSorters}
                >
                  {t('permissions.code')}
                </SortableTableHead>
                <TableHead className="w-[100px] text-right">
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colCount}>
                    <TableEmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((perm: Permission) => (
                  <TableRow
                    key={perm.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    {showIdColumn && (
                      <TableCell className="font-mono text-xs">
                        {perm.id}
                      </TableCell>
                    )}
                    <TableCell>
                      <ShowButton
                        resource="permissions"
                        recordItemId={perm.id}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-normal hover:bg-transparent hover:underline"
                      >
                        {perm.name}
                      </ShowButton>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {perm.code}
                    </TableCell>
                    <TableCell className="text-right">
                      <ShowButton
                        resource="permissions"
                        recordItemId={perm.id}
                        variant="outline"
                        size="sm"
                      />
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
