import { type FormEvent, useState } from 'react'
import { Authenticated, useLogin } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeSelect } from '@/components/refine-ui/theme/theme-select'
import { LanguageToggle } from '@/components/refine-ui/i18n/language-toggle'
import { ROUTES } from '@/constants/routes'
import i18n from '@/i18n'
import { cn } from '@/lib/utils'

function LoginForm() {
  const { t } = useTranslation()
  const { mutate: login, isPending } = useLogin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    login({ username, password })
  }

  return (
    <div
      className={cn(
        'relative flex min-h-svh w-full flex-col items-center justify-center bg-muted/30 p-4'
      )}
    >
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <LanguageToggle />
        <ThemeSelect />
      </div>
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <LayoutDashboard className="size-10 text-primary" />
          <h1 className="text-xl font-semibold">{t('app.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('login.title')}</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="login-username" className="text-sm font-medium">
              {t('login.username')}
            </label>
            <Input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder={t('login.placeholderUsername')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="text-sm font-medium">
              {t('login.password')}
            </label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={t('login.placeholderPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t('login.loggingIn') : t('login.login')}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t('login.demoHint')}
        </p>
      </div>
    </div>
  )
}

/** 未登录默认入口；已登录访问 /login 时回到首页。 */
export function LoginPage() {
  return (
    <Authenticated
      key="login-page-guard"
      loading={
        <div className="flex min-h-svh items-center justify-center text-muted-foreground">
          {i18n.t('common.loading')}
        </div>
      }
      fallback={<LoginForm />}
    >
      <Navigate to={ROUTES.home} replace />
    </Authenticated>
  )
}
