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
import { Skeleton } from '@/components/ui/skeleton'
import { useListDisplayStore } from '@/stores/list-display-store'
import { SortableTableHead } from '@/components/shared/sortable-table-head'
import type { Permission } from '@/types/permission'

export function PermissionList() {
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

  return (
    <ListView>
      <ListViewHeader resource="permissions" canCreate={false} />
      <div className="flex flex-col gap-4">
        <ListToolbar />
        <PermissionListFilter
          filters={filters}
          onFiltersChange={(f) => setFilters(f, 'replace')}
        />
      </div>
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
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
                  <TableCell
                    colSpan={colCount}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((perm: Permission) => (
                  <TableRow key={perm.id}>
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
