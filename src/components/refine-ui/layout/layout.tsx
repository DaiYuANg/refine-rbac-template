'use client'

import type { PropsWithChildren } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Sidebar } from '@/components/refine-ui/layout/sidebar'
import { Header } from '@/components/refine-ui/layout/header'
import { cn } from '@/lib/utils'

export function Layout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main
          className={cn(
            '@container/main',
            'relative',
            'w-full',
            'min-w-0',
            'flex',
            'flex-col',
            'flex-1',
            'overflow-auto',
            'px-2',
            'pt-4',
            'md:p-4',
            'lg:px-6',
            'lg:pt-6'
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

Layout.displayName = 'Layout'
