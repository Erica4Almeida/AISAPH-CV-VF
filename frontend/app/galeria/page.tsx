import type { Metadata } from 'next'
import { getGaleriaFotos } from '@/services/api'
import { getT } from '@/lib/getT'
import GaleriaGrid from '@/components/galeria/GaleriaGrid'

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Galeria de fotografias das formações e actividades da AISAPH-CV.',
  openGraph: {
    title: 'Galeria | AISAPH-CV',
    description: 'Momentos das nossas formações em Cabo Verde.',
  },
}

export default async function GaleriaPage() {
  const [fotos, t] = await Promise.all([getGaleriaFotos(), getT()])

  return (
    <>
      <section className="galeria-hero">
        <div className="container container-sm">
          <p className="galeria-hero-tag">{t.galeria.tag}</p>
          <h1 className="galeria-hero-h1">{t.galeria.titulo}</h1>
          <p className="galeria-hero-subtitle">{t.galeria.subtitulo}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <GaleriaGrid fotos={fotos} />
        </div>
      </section>
    </>
  )
}
