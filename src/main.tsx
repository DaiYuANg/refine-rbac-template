import '@/i18n'
import '@/utils/date'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { env } from '@/config'
import App from '@/app'
import { worker } from '@/mocks'

if (env.isDev) {
  import('react-scan').then(({ scan }) => scan({ enabled: true }))
}

function mount() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

if (env.useMock) {
  worker.start({ onUnhandledRequest: 'bypass', quiet: true }).then(mount)
} else {
  mount()
}
