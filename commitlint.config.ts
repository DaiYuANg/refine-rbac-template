/**
 * Commitlint - enforce Conventional Commits.
 * @see https://commitlint.js.org/reference/configuration
 */
import type { UserConfig } from '@commitlint/types'

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
}

export default config
