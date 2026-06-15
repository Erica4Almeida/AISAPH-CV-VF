import type { Metadata } from 'next'
import Link from 'next/link'
import { getSobre } from '@/services/api'
import { getT } from '@/lib/getT'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import CountUp from '@/components/ui/CountUp'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Conheça a missão, visão e história da AISAPH-CV — formação internacional em socorrismo e APH em Cabo Verde.',
  openGraph: {
    title: 'Sobre Nós | AISAPH-CV',
    description: 'Conheça a missão, visão e história da AISAPH-CV.',
  },
}

export default async function SobrePage() {
  const [sobre, t] = await Promise.all([getSobre(), getT()])

  const historiaConteudo = sobre?.historia_conteudo ?? null
  const missaoValores = [
    { icon: '🎯', titulo: t.sobre.missao,  texto: sobre?.missao  ?? '' },
    { icon: '🌍', titulo: t.sobre.visao,   texto: sobre?.visao   ?? '' },
    { icon: '💡', titulo: t.sobre.valores, texto: sobre?.valores ?? '' },
  ]
  const estatisticas = sobre ? [
    { num: sobre.stat_1_num, label: sobre.stat_1_label },
    { num: sobre.stat_2_num, label: sobre.stat_2_label },
    { num: sobre.stat_3_num, label: sobre.stat_3_label },
    { num: sobre.stat_4_num, label: sobre.stat_4_label },
  ] : []
  const certificacoes: string[] = Array.isArray(sobre?.certificacoes) ? (sobre.certificacoes as string[]) : []

  return (
    <>
      <section className="sobre-hero">
        <div className="container container-md">
          <p className="page-hero-tag">{t.sobre.tag}</p>
          <h1 className="page-hero-h1">{t.sobre.titulo}</h1>
          <p className="sobre-hero-subtitle">{t.sobre.subtitulo}</p>
        </div>
      </section>

      <AnimateOnScroll variant="fade-up">
      <section className="section">
        <div className="container">
          <div className="sobre-grid">
            <div>
              <p className="sobre-historia-tag">{t.sobre.nossaHistoria}</p>
              <h2 className="sobre-historia-h2">
                {sobre?.historia_titulo ?? 'Formação, Capacitação e Certificação de Excelência'}
              </h2>
              {historiaConteudo ? (
                <div className="sobre-historia-p"
                  dangerouslySetInnerHTML={{ __html: historiaConteudo }} />
              ) : (
                <>
                  <p className="sobre-historia-p">
                    A AISAPH-CV atua em Cabo Verde e em parceria com outros países através de unidades
                    administrativas e centros de formação, sempre com o propósito de elevar os padrões
                    de resposta às urgências e emergências pré-hospitalares.
                  </p>
                  <p className="sobre-historia-p">
                    O nosso compromisso é claro: formar, capacitar e certificar profissionais em
                    socorrismo e atendimento pré-hospitalar. Contamos com instrutores bilíngues e
                    altamente qualificados, apaixonados por transmitir conhecimento prático e relevante.
                  </p>
                  <p className="sobre-historia-p">
                    As nossas atividades abrangem desde formação profissional e educação comunitária,
                    até consultoria técnica, assessoria em segurança, investigação científica e
                    desenvolvimento de protocolos personalizados.
                  </p>
                </>
              )}
              <div className="sobre-historia-cta">
                <Link href="/inscricoes" className="btn btn-primary">{t.sobre.junteSeNos}</Link>
              </div>
            </div>

            <div className="sobre-stats">
              {estatisticas.map(e => (
                <div key={e.label} className="sobre-stat">
                  <div className="sobre-stat-num"><CountUp value={e.num} /></div>
                  <div className="sobre-stat-label">{e.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      <AnimateOnScroll variant="fade-up" delay={100}>
      <section className="section" style={{ background: 'var(--cinza-claro)' }}>
        <div className="container">
          <div className="section-center-header">
            <h2 className="section-h2">{t.sobre.missaoVisaoValores}</h2>
          </div>
          <div className="sobre-mvv-grid">
            {missaoValores.map(item => (
              <div key={item.titulo} className="sobre-mvv-card">
                <div className="sobre-mvv-icon">{item.icon}</div>
                <h3 className="sobre-mvv-title">{item.titulo}</h3>
                <div className="sobre-mvv-text" dangerouslySetInnerHTML={{ __html: item.texto }} />
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {certificacoes.length > 0 && (
      <AnimateOnScroll variant="fade-up" delay={100}>
        <section className="section">
          <div className="container">
            <div className="section-center-header">
              <p className="section-tag-red">{t.sobre.credenciamentos}</p>
              <h2 className="section-h2">{t.sobre.certificacoes}</h2>
            </div>
            <div className="sobre-cert-list">
              {certificacoes.map(cert => (
                <div key={cert} className="sobre-cert-item">
                  <span className="sobre-cert-check">✓</span>{cert}
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimateOnScroll>
      )}
    </>
  )
}
