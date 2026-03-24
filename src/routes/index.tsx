import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageLoadingState } from '@/components/shared/loading-indicator'

const DashboardPage = lazy(() =>
  import('@/pages/dashboard').then((m) => ({ default: m.DashboardPage }))
)
const UserList = lazy(() =>
  import('@/pages/users/list').then((m) => ({ default: m.UserList }))
)
const UserCreate = lazy(() =>
  import('@/pages/users/create').then((m) => ({ default: m.UserCreate }))
)
const UserEdit = lazy(() =>
  import('@/pages/users/edit').then((m) => ({ default: m.UserEdit }))
)
const UserShow = lazy(() =>
  import('@/pages/users/show').then((m) => ({ default: m.UserShow }))
)
const RoleList = lazy(() =>
  import('@/pages/roles/list').then((m) => ({ default: m.RoleList }))
)
const RoleCreate = lazy(() =>
  import('@/pages/roles/create').then((m) => ({ default: m.RoleCreate }))
)
const RoleEdit = lazy(() =>
  import('@/pages/roles/edit').then((m) => ({ default: m.RoleEdit }))
)
const RoleShow = lazy(() =>
  import('@/pages/roles/show').then((m) => ({ default: m.RoleShow }))
)
const PermissionList = lazy(() =>
  import('@/pages/permissions/list').then((m) => ({
    default: m.PermissionList,
  }))
)
const PermissionShow = lazy(() =>
  import('@/pages/permissions/show').then((m) => ({
    default: m.PermissionShow,
  }))
)
const PermissionGroupList = lazy(() =>
  import('@/pages/permission-groups/list').then((m) => ({
    default: m.PermissionGroupList,
  }))
)
const PermissionGroupCreate = lazy(() =>
  import('@/pages/permission-groups/create').then((m) => ({
    default: m.PermissionGroupCreate,
  }))
)
const PermissionGroupEdit = lazy(() =>
  import('@/pages/permission-groups/edit').then((m) => ({
    default: m.PermissionGroupEdit,
  }))
)
const PermissionGroupShow = lazy(() =>
  import('@/pages/permission-groups/show').then((m) => ({
    default: m.PermissionGroupShow,
  }))
)

const PageFallback = () => {
  const { t } = useTranslation()

  return (
    <PageLoadingState title={t('loading.page')} className="max-w-4xl py-8" />
  )
}

export const AppRoutes = () => (
  <Suspense fallback={<PageFallback />}>
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path="users">
        <Route index element={<UserList />} />
        <Route path="create" element={<UserCreate />} />
        <Route path="edit/:id" element={<UserEdit />} />
        <Route path="show/:id" element={<UserShow />} />
      </Route>
      <Route path="roles">
        <Route index element={<RoleList />} />
        <Route path="create" element={<RoleCreate />} />
        <Route path="edit/:id" element={<RoleEdit />} />
        <Route path="show/:id" element={<RoleShow />} />
      </Route>
      <Route path="permissions">
        <Route index element={<PermissionList />} />
        <Route path="show/:id" element={<PermissionShow />} />
      </Route>
      <Route path="permission-groups">
        <Route index element={<PermissionGroupList />} />
        <Route path="create" element={<PermissionGroupCreate />} />
        <Route path="edit/:id" element={<PermissionGroupEdit />} />
        <Route path="show/:id" element={<PermissionGroupShow />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
)
