import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import '../styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import CookieBanner from '@/components/layout/CookieBanner'
import ScrollToTop from '@/components/ui/ScrollToTop'
import NavigationProgress from '@/components/ui/NavigationProgress'
import ScrollProgress from '@/components/ui/ScrollProgress'
import Providers from '@/components/Providers'
import { getConfiguracao } from '@/services/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aisaph.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AISAPH-CV | Formação em Socorrismo e APH em Cabo Verde',
    template: '%s | AISAPH-CV',
  },
  description:
    'Academia Internacional de Socorrismo e Atendimento Pré-Hospitalar de Cabo Verde. Certificações nacionais e internacionais, instrutores experientes, foco prático.',
  keywords: [
    'socorrismo Cabo Verde',
    'formação APH',
    'primeiros socorros',
    'certificação emergência',
    'atendimento pré-hospitalar',
    'AISAPH-CV',
  ],
  authors: [{ name: 'AISAPH-CV' }],
  openGraph: {
    type: 'website',
    locale: 'pt_CV',
    siteName: 'AISAPH-CV',
    title: 'AISAPH-CV | Formação em Socorrismo e APH',
    description: 'Formação Internacional em Socorrismo e APH – Credibilidade que Salva Vidas.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AISAPH-CV',
    description: 'Formação Internacional em Socorrismo e APH – Credibilidade que Salva Vidas.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cfg, store] = await Promise.all([getConfiguracao(), cookies()])
  const cookieLocale = store.get('aisaph-locale')?.value
  const lang = ['en', 'fr', 'es'].includes(cookieLocale ?? '') ? cookieLocale! : 'pt'

  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <Providers>
          <NavigationProgress />
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer cfg={cfg} />
          {cfg?.contato_whatsapp_href && (
            <WhatsAppButton href={cfg.contato_whatsapp_href} />
          )}
          <ScrollToTop />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  )
}
