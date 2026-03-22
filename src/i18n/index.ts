import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import zh from '@/locales/zh.json'
import en from '@/locales/en.json'

export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const
export type Locale = (typeof SUPPORTED_LANGUAGES)[number]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'rbac_locale',
    },
    // zh-CN / zh-TW -> zh, en-US -> en
    load: 'languageOnly',
  })

export default i18n
