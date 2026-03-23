import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import TurboConsole from 'unplugin-turbo-console/vite'
import { compression } from 'vite-plugin-compression2'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(command === 'serve' ? [TurboConsole()] : []),
    compression(),
    VitePWA({ registerType: 'autoUpdate' }),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|scheduler)/,
              priority: 20,
            },
            {
              name: 'refine-vendor',
              test: /node_modules[\\/]@refinedev/,
              priority: 18,
            },
            {
              name: 'recharts-vendor',
              test: /node_modules[\\/]recharts/,
              priority: 16,
            },
            {
              name: 'ui-vendor',
              test: /node_modules[\\/](radix-ui|@radix-ui|lucide-react|cmdk)/,
              priority: 14,
            },
            { name: 'vendor', test: /node_modules/, priority: 10 },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
}))
