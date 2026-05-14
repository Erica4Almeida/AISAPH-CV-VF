import type { Metadata } from 'next'
import InCompanyForm from './InCompanyForms'
import BannerCarousel from '@/components/BannerCarousel'
import { getSetores, getEtapas, getConfiguracao } from '@/services/api'
import { getT } from '@/lib/getT'
import type { Setor, Etapa } from '@/types'

export const metadata: Metadata = {
  title: 'Formação In-Company',
  description: 'Soluções de formação sob medida para empresas, hotéis e instituições. Treinamos equipas de qualquer setor.',
  openGraph: {
    title: 'Formação In-Company | AISAPH-CV',
    description: 'Soluções de formação sob medida para empresas, hotéis e instituições.',
  },
}

export default async function InCompanyPage() {
  const [setores, etapas, cfg, t] = await Promise.all([
    getSetores(),
    getEtapas(),
    getConfiguracao(),
    getT(),
  ])

  const headerTitulo    = cfg?.incompany_header_titulo    ?? t.inCompany.propostaTitulo
  const headerSubtitulo = cfg?.incompany_header_subtitulo ?? t.inCompany.propostaSubtitulo

  return (
    <>
      <BannerCarousel
        slides={[
          { image: '/empresas-bg.jpg',     label: `${t.inCompany.tag} / ${t.nav.empresas}` },
          { image: '/instituicoes-bg.jpg', label: `${t.inCompany.tag} / ${t.nav.instituicoes}` },
          { image: '/empresas2-bg.jpg',    label: `${t.inCompany.tag}` },
        ]}
        titulo={headerTitulo}
        subtitulo={headerSubtitulo}
        btnLabel={t.inCompany.solicitar}
        btnHref="#formulario"
      />

      {setores.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-center-header">
              <p className="section-tag-red">{t.inCompany.areasTag}</p>
              <h2 className="section-h2">{t.inCompany.areasTitulo}</h2>
            </div>
            <div className="inco-setores-grid">
              {setores.map((s: Setor) => (
                <div key={s.id} className="inco-setor-card">
                  <div className="inco-setor-icon">{s.icone}</div>
                  <h3 className="inco-setor-title">{s.titulo}</h3>
                  <p className="inco-setor-desc">{s.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {etapas.length > 0 && (
        <section className="section" style={{ background: 'var(--cinza-claro)' }}>
          <div className="container">
            <div className="section-center-header">
              <h2 className="section-h2">{t.inCompany.comoFunciona}</h2>
            </div>
            <div className="inco-etapas-grid">
              {etapas.map((p: Etapa) => (
                <div key={p.id} className="inco-etapa-item">
                  <div className="inco-etapa-num">{p.numero}</div>
                  <h3 className="inco-etapa-title">{p.titulo}</h3>
                  <p className="inco-etapa-desc">{p.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="formulario">
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="section-center-header-48">
            <h2 className="section-h2">{t.inCompany.propostaTitulo}</h2>
            <p style={{ color: 'var(--texto-suave)', marginTop: '16px' }}>
              {t.inCompany.propostaSubtitulo}
            </p>
          </div>
          <InCompanyForm />
        </div>
      </section>
    </>
  )
}
