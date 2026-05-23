import type { Metadata } from 'next'
import { getProtecaoDados } from '@/services/api'
import { getT } from '@/lib/getT'

export const metadata: Metadata = {
  title: 'Política de Proteção de Dados',
  description: 'Política de proteção de dados pessoais da AISAPH-CV.',
}

export default async function ProtecaoDadosPage() {
  const [data, t] = await Promise.all([getProtecaoDados(), getT()])

  return (
    <>
      <section className="legal-hero">
        <div className="container container-md">
          <p className="legal-hero-tag">{t.common.legal}</p>
          <h1 className="legal-hero-h1">{t.nav.protecaoDados}</h1>
          {data?.data_atualizacao && (
            <p className="legal-hero-date">
              {t.common.ultimaAtualizacao} {new Date(data.data_atualizacao).toLocaleDateString(t.common.dateLocale)}
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container container-md">
          {data?.conteudo ? (
            <div className="legal-content" dangerouslySetInnerHTML={{ __html: data.conteudo }} />
          ) : (
            <p className="legal-empty">{t.common.emBreve}</p>
          )}
        </div>
      </section>
    </>
  )
}
