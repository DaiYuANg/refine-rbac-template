'use client'

import { WifiOff } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHealthCheckStore } from '@/stores/health-check-store'
import {
  useHealthCheckPolling,
  checkHealth,
} from '@/hooks/use-health-check-polling'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { InlineLoadingIndicator } from '@/components/shared/loading-indicator'

export const NetworkErrorOverlay = () => {
  const { t } = useTranslation()
  useHealthCheckPolling()
  const isUp = useHealthCheckStore((s) => s.isUp)
  const lastError = useHealthCheckStore((s) => s.lastError)
  const [isRetrying, setIsRetrying] = useState(false)

  if (isUp) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <Card
        className="mx-4 w-full max-w-md border-destructive/25"
        style={{ animation: 'network-error-breathe 1.8s ease-in-out infinite' }}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <WifiOff
              className="size-6 text-destructive"
              style={{
                animation: 'network-error-shake 1.6s ease-in-out infinite',
              }}
              aria-hidden
            />
          </div>
          <h2 className="text-lg font-semibold">{t('networkError.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('networkError.description')}
          </p>
          {lastError && (
            <p className="text-xs text-muted-foreground">{lastError}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-3 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2">
            <div className="mb-2">
              <InlineLoadingIndicator
                label={t('networkError.reconnecting')}
                className="text-destructive"
              />
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-destructive/15"
              style={{
                animation: 'network-error-breathe 1.8s ease-in-out infinite',
              }}
            >
              <div
                className="h-full w-1/3 min-w-[70px] bg-destructive/70"
                style={{ animation: 'shimmer 1.2s ease-in-out infinite' }}
              />
            </div>
          </div>
          {isRetrying && (
            <div className="mb-3 rounded-md border bg-muted/40 px-3 py-2">
              <InlineLoadingIndicator
                label={t('loading.checkingNetwork')}
                className="text-muted-foreground"
              />
            </div>
          )}
          <Button
            className="w-full"
            onClick={() => {
              setIsRetrying(true)
              void checkHealth().finally(() => {
                setIsRetrying(false)
              })
            }}
            variant="outline"
            disabled={isRetrying}
          >
            {isRetrying ? (
              <InlineLoadingIndicator label={t('loading.retrying')} />
            ) : (
              t('buttons.retry')
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
