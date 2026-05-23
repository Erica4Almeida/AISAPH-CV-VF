'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Locale, type Translations } from '@/locales/translations'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'pt',
  setLocale: () => {},
  t: translations.pt,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt')

  useEffect(() => {
    const saved = localStorage.getItem('aisaph-locale') as Locale | null
    if (saved && saved in translations) setLocaleState(saved)
  }, [])

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem('aisaph-locale', l)
    document.cookie = `aisaph-locale=${l};path=/;max-age=31536000;SameSite=Lax`
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] as Translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
