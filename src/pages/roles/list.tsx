import { useState } from 'react'
import { useList } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ListView,
  ListViewHeader,
} from '@/components/refine-ui/views/list-view'
import { RoleListFilter } from '@/components/refine-ui/table/role-list-filter'
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
import { Skeleton } from '@/components/ui/skeleton'
import type { CrudFilters } from '@refinedev/core'
import type { Role } from '@/types/role'

export function RoleList() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<CrudFilters>([])

  const { query, result } = useList<Role>({
    resource: 'roles',
    pagination: { currentPage: 1, pageSize: 10, mode: 'server' },
    filters,
  })

  const roles = Array.isArray(result?.data) ? result.data : []
  const isLoading = query.isLoading

  return (
    <ListView>
      <ListViewHeader resource="roles" />
      <div className="flex flex-col gap-4">
        <RoleListFilter filters={filters} onFiltersChange={setFilters} />
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
                <TableHead>{t('roles.name')}</TableHead>
                <TableHead>{t('roles.description')}</TableHead>
                <TableHead className="w-[120px] text-right">
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role: Role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-mono text-xs">
                      {role.id}
                    </TableCell>
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
    </ListView>
  )
}
