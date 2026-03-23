import { useState } from 'react'
import { useList } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ListView,
  ListViewHeader,
} from '@/components/refine-ui/views/list-view'
import { UserListFilter } from '@/components/refine-ui/table/user-list-filter'
import { ListPagination } from '@/components/shared/list-pagination'
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
import type { User } from '@/types/user'

export function UserList() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<CrudFilters>([])
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10 })

  const handleFiltersChange = (newFilters: CrudFilters) => {
    setFilters(newFilters)
    setPagination((p) => ({ ...p, currentPage: 1 }))
  }

  const { query, result } = useList<User>({
    resource: 'users',
    pagination: {
      ...pagination,
      mode: 'server',
    },
    filters,
  })

  const users = Array.isArray(result?.data) ? result.data : []
  const total = result?.total ?? 0
  const isLoading = query.isLoading

  return (
    <ListView>
      <ListViewHeader resource="users" />
      <div className="flex flex-col gap-4">
        <UserListFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
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
                <TableHead>ID</TableHead>
                <TableHead>{t('users.name')}</TableHead>
                <TableHead>{t('users.email')}</TableHead>
                <TableHead className="w-[120px] text-right">
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">
                      {user.id}
                    </TableCell>
                    <TableCell>
                      <ShowButton
                        resource="users"
                        recordItemId={user.id}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-normal hover:bg-transparent hover:underline"
                      >
                        {user.name}
                      </ShowButton>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ShowButton
                          resource="users"
                          recordItemId={user.id}
                          variant="outline"
                          size="sm"
                        />
                        <EditButton
                          resource="users"
                          recordItemId={user.id}
                          variant="outline"
                          size="sm"
                        />
                        <DeleteButton
                          resource="users"
                          recordItemId={user.id}
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
          currentPage={pagination.currentPage}
          total={total}
          pageSize={pagination.pageSize}
          onPageChange={(page) =>
            setPagination((p) => ({ ...p, currentPage: page }))
          }
        />
      </div>
    </ListView>
  )
}
