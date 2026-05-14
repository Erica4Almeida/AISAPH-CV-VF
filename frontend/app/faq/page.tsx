import type { Metadata } from 'next'
import { getFaqs } from '@/services/api'
import { getT } from '@/lib/getT'
import FaqAccordion from '@/components/shared/FaqAccordion'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Perguntas frequentes sobre cursos, inscrições e formações AISAPH-CV.',
  openGraph: {
    title: 'FAQ | AISAPH-CV',
    description: 'Perguntas frequentes sobre cursos, inscrições e formações AISAPH-CV.',
  },
}

export default async function FaqPage() {
  const [faqs, t] = await Promise.all([getFaqs(), getT()])

  return (
    <>
      <section className="page-hero">
        <div className="container container-sm">
          <p className="page-hero-tag">{t.faq.tag}</p>
          <h1 className="page-hero-h1">{t.faq.titulo}</h1>
          <p className="page-hero-subtitle">{t.faq.subtitulo}</p>
        </div>
      </section>

      <section className="section">
        <div className="container container-lg">
          {faqs.length > 0
            ? <FaqAccordion faqs={faqs} />
            : <p className="page-empty">{t.faq.semFaqs}</p>
          }
        </div>
      </section>
    </>
  )
}
