import type { I18nProvider } from '@refinedev/core'
import i18n from '@/i18n'

export const i18nProvider: I18nProvider = {
  translate: (key, options, defaultMessage) => {
    // Refine may call translate(key, defaultMessage) - second arg is string as fallback
    const resolvedDefault =
      typeof options === 'string' ? options : (defaultMessage ?? key)
    const resolvedOptions =
      typeof options === 'object' && options !== null ? options : {}
    const result = i18n.t(key, {
      defaultValue: resolvedDefault,
      ...resolvedOptions,
    })
    return typeof result === 'string' ? result : String(result)
  },
  changeLocale: (lang) => i18n.changeLanguage(lang),
  getLocale: () => i18n.language?.split('-')[0] ?? 'en',
}
