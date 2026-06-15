import type { Metadata } from 'next'
import HeroSection       from '@/components/home/HeroSection'
import Parceiros         from '@/components/home/Parceiros'
import CursosDestaque    from '@/components/home/CursosDestaque'
import PorqueEscolher    from '@/components/home/PorqueEscolher'
import Depoimentos       from '@/components/home/Depoimentos'
import InCompanyDestaque from '@/components/home/InCompanyDestaque'
import CallToAction      from '@/components/home/CallToAction'
import AnimateOnScroll     from '@/components/ui/AnimateOnScroll'
import NoticiasDestaque    from '@/components/home/NoticiasDestaque'
import {
  getCursosDestaque,
  getDepoimentos,
  getParceiros,
  getHero,
  getDiferenciais,
  getConfiguracao,
  getNoticias,
} from '@/services/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aisaph.com'

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'AISAPH-CV',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Academia Internacional de Socorrismo e Atendimento Pré-Hospitalar de Cabo Verde.',
  address: { '@type': 'PostalAddress', addressCountry: 'CV' },
  sameAs: [SITE_URL],
}

export const metadata: Metadata = {
  title: 'AISAPH-CV | Formação em Socorrismo e APH em Cabo Verde',
  description: 'Academia Internacional de Socorrismo e Atendimento Pré-Hospitalar de Cabo Verde. Certificações nacionais e internacionais, instrutores experientes, foco prático.',
  openGraph: {
    title: 'AISAPH-CV | Formação em Socorrismo e APH',
    description: 'Formação Internacional em Socorrismo e APH – Credibilidade que Salva Vidas.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default async function HomePage() {
  const [hero, cursos, depoimentos, parceiros, diferenciais, cfg, noticias] = await Promise.all([
    getHero(),
    getCursosDestaque(),
    getDepoimentos(),
    getParceiros(),
    getDiferenciais(),
    getConfiguracao(),
    getNoticias(true),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <HeroSection hero={hero} />
      <AnimateOnScroll variant="fade-up">
        <Parceiros parceiros={parceiros} />
      </AnimateOnScroll>
      <AnimateOnScroll variant="fade-up">
        <CursosDestaque cursos={cursos} />
      </AnimateOnScroll>
      <AnimateOnScroll variant="fade-up">
        <PorqueEscolher diferenciais={diferenciais} />
      </AnimateOnScroll>
      <AnimateOnScroll variant="fade-up">
        <Depoimentos depoimentos={depoimentos} />
      </AnimateOnScroll>
      <NoticiasDestaque noticias={noticias.slice(0, 3)} />
      <AnimateOnScroll variant="fade-up">
        <InCompanyDestaque cfg={cfg} />
      </AnimateOnScroll>
      <AnimateOnScroll variant="fade-up">
        <CallToAction cfg={cfg} />
      </AnimateOnScroll>
    </>
  )
}
