import type { Metadata } from 'next'
import HeroSection       from '@/components/home/HeroSection'
import Parceiros         from '@/components/home/Parceiros'
import CursosDestaque    from '@/components/home/CursosDestaque'
import PorqueEscolher    from '@/components/home/PorqueEscolher'
import Depoimentos       from '@/components/home/Depoimentos'
import InCompanyDestaque from '@/components/home/InCompanyDestaque'
import CallToAction      from '@/components/home/CallToAction'
import {
  getCursosDestaque,
  getDepoimentos,
  getParceiros,
  getHero,
  getDiferenciais,
  getConfiguracao,
} from '@/services/api'

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
  const [hero, cursos, depoimentos, parceiros, diferenciais, cfg] = await Promise.all([
    getHero(),
    getCursosDestaque(),
    getDepoimentos(),
    getParceiros(),
    getDiferenciais(),
    getConfiguracao(),
  ])

  return (
    <>
      <HeroSection hero={hero} />
      <Parceiros parceiros={parceiros} />
      <CursosDestaque cursos={cursos} />
      <PorqueEscolher diferenciais={diferenciais} />
      <Depoimentos depoimentos={depoimentos} />
      <InCompanyDestaque cfg={cfg} />
      <CallToAction cfg={cfg} />
    </>
  )
}
