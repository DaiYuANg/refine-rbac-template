import { Refine, Authenticated } from '@refinedev/core'
import routerProvider from '@refinedev/react-router'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import {
  dataProviderInstance,
  authProvider,
  accessControlProvider,
  notificationProvider,
  i18nProvider,
} from '@/providers'
import { ReactQueryDevtoolsPanel } from '@/components/shared/react-query-devtools-panel'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Layout } from '@/components/refine-ui/layout/layout'
import { resources } from '@/constants'
import { ROUTES } from '@/constants/routes'
import { LoginPage } from '@/pages/login'
import { AppRoutes } from '@/routes'

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProviderInstance}
        authProvider={authProvider}
        accessControlProvider={accessControlProvider}
        notificationProvider={notificationProvider}
        i18nProvider={i18nProvider}
        routerProvider={routerProvider}
        resources={resources}
        options={{
          syncWithLocation: true,
          title: {
            icon: <LayoutDashboard className="size-6" />,
            text: 'RBAC Template',
          },
        }}
      >
        <TooltipProvider>
          <Toaster />
          <ReactQueryDevtoolsPanel />
          <Routes>
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route
              element={
                <Authenticated
                  key="authenticated"
                  fallback={<Navigate to={ROUTES.login} replace />}
                >
                  <Layout>
                    <Outlet />
                  </Layout>
                </Authenticated>
              }
            >
              <Route path="*" element={<AppRoutes />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </Refine>
    </BrowserRouter>
  )
}

export default App
