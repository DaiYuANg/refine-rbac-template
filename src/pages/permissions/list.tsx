import { useState } from 'react'
import { useList } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ListView,
  ListViewHeader,
} from '@/components/refine-ui/views/list-view'
import { PermissionListFilter } from '@/components/refine-ui/table/permission-list-filter'
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
import type { CrudFilters } from '@refinedev/core'
import type { Permission } from '@/types/permission'

export function PermissionList() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<CrudFilters>([])

  const { query, result } = useList<Permission>({
    resource: 'permissions',
    pagination: { currentPage: 1, pageSize: 10, mode: 'server' },
    filters,
  })

  const permissions = Array.isArray(result?.data) ? result.data : []
  const isLoading = query.isLoading

  return (
    <ListView>
      <ListViewHeader resource="permissions" canCreate={false} />
      <div className="flex flex-col gap-4">
        <PermissionListFilter filters={filters} onFiltersChange={setFilters} />
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
                <TableHead>ID</TableHead>
                <TableHead>{t('permissions.name')}</TableHead>
                <TableHead>{t('permissions.code')}</TableHead>
                <TableHead>{t('permissions.groupId')}</TableHead>
                <TableHead className="w-[100px] text-right">
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((perm: Permission) => (
                  <TableRow key={perm.id}>
                    <TableCell className="font-mono text-xs">
                      {perm.id}
                    </TableCell>
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
                    <TableCell className="text-muted-foreground">
                      {perm.groupId ?? '-'}
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
    </ListView>
  )
}
