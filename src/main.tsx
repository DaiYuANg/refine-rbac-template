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

if (env.isDev) {
  const loadReactDevTools = () => {
    const script = document.createElement('script')
    script.src = 'http://localhost:8097'
    script.async = true
    script.onload = () => {
      console.log('✅ React DevTools loaded')
    }
    script.onerror = () => {
      console.warn(
        '⚠️ React DevTools not available. Make sure to run: npm run devtools'
      )
    }

    // 延迟加载，确保 React 已初始化
    setTimeout(() => {
      document.head.appendChild(script)
    }, 1000)
  }

  loadReactDevTools()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
