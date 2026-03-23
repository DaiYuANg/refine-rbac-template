import '@/i18n'
import '@/utils/date'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { env } from '@/config'
import App from '@/app'

if (env.isDev) {
  import('react-scan').then(({ scan }) => scan({ enabled: true }))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
