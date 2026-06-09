import type { Metadata } from 'next'
import { getPoliticaUtilizacao } from '@/services/api'
import { getT } from '@/lib/getT'
import { formatDate } from '@/lib/formatDate'

export const metadata: Metadata = {
  title: 'Política de Utilização',
  description: 'Política de utilização do website AISAPH-CV.',
}

export default async function PoliticaUtilizacaoPage() {
  const [data, t] = await Promise.all([getPoliticaUtilizacao(), getT()])

  return (
    <>
      <section className="legal-hero">
        <div className="container container-md">
          <p className="legal-hero-tag">{t.common.legal}</p>
          <h1 className="legal-hero-h1">{t.nav.politicaUtilizacao}</h1>
          {data?.data_atualizacao && (
            <p className="legal-hero-date">
              {t.common.ultimaAtualizacao} {formatDate(data.data_atualizacao, t.common.dateLocale)}
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
