import { cookies } from 'next/headers'
import { translations, type Locale, type Translations } from '@/locales/translations'

export async function getT(): Promise<Translations> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('aisaph-locale')?.value as Locale | undefined
  const locale: Locale = raw && raw in translations ? raw : 'pt'
  return translations[locale] as Translations
}
