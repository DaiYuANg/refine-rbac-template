'use client'

import { WifiOff } from 'lucide-react'
import { useHealthCheckStore } from '@/stores/health-check-store'
import {
  useHealthCheckPolling,
  checkHealth,
} from '@/hooks/use-health-check-polling'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const NetworkErrorOverlay = () => {
  useHealthCheckPolling()
  const isUp = useHealthCheckStore((s) => s.isUp)
  const lastError = useHealthCheckStore((s) => s.lastError)

  if (isUp) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <Card className="mx-4 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <WifiOff className="size-6 text-destructive" aria-hidden />
          </div>
          <h2 className="text-lg font-semibold">网络异常</h2>
          <p className="text-sm text-muted-foreground">
            无法连接到服务器，请检查网络连接后重试。
          </p>
          {lastError && (
            <p className="text-xs text-muted-foreground">{lastError}</p>
          )}
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => void checkHealth()}
            variant="outline"
          >
            重试
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
