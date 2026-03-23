import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import type { Linter } from 'eslint'

export default defineConfig([
  globalIgnores([
    'dist',
    'public/mockServiceWorker.js',
    // External/integration components: shadcn/ui, refine-ui
    'src/components/ui/**',
    'src/components/refine-ui/**',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ] as Linter.Config[],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
