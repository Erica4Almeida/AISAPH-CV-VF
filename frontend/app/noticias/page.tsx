import type { Metadata } from 'next'
import Link from 'next/link'
import { getNoticias } from '@/services/api'
import { getT } from '@/lib/getT'
import type { Noticia } from '@/types'
import { mediaUrl } from '@/lib/media'

export const metadata: Metadata = {
  title: 'Notícias',
  description: 'Fique a par das últimas novidades, eventos e actividades da AISAPH-CV.',
  openGraph: {
    title: 'Notícias | AISAPH-CV',
    description: 'Últimas novidades da AISAPH-CV.',
  },
}

function getImageUrl(noticia: Noticia): string | null {
  return mediaUrl(noticia.imagem?.url) || null
}

function formatDate(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function NoticiasPage() {
  const [noticias, t] = await Promise.all([getNoticias(), getT()])

  return (
    <>
      <section className="page-hero">
        <div className="container container-sm">
          <p className="page-hero-tag">{t.noticias.tag}</p>
          <h1 className="page-hero-h1">{t.noticias.titulo}</h1>
          <p className="page-hero-subtitle">{t.noticias.subtitulo}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {noticias.length === 0 ? (
            <p className="page-empty">{t.noticias.semNoticias}</p>
          ) : (
            <div className="noticias-grid">
              {noticias.map((n: Noticia) => {
                const imgUrl = getImageUrl(n)
                const dataFormatada = formatDate(n.data_publicacao || n.publishedAt, t.common.dateLocale)
                return (
                  <Link key={n.id} href={`/noticias/${n.slug}`} className="noticia-link">
                    <article className="noticia-card">
                      {imgUrl && (
                        <div className="noticia-img-wrap">
                          <img src={imgUrl} alt={n.titulo} className="noticia-img" />
                        </div>
                      )}
                      <div className="noticia-body">
                        {dataFormatada && <p className="noticia-data">{dataFormatada}</p>}
                        <h2 className="noticia-titulo">{n.titulo}</h2>
                        {n.resumo && (
                          <p className="noticia-resumo">
                            {n.resumo.length > 140 ? n.resumo.slice(0, 140) + '…' : n.resumo}
                          </p>
                        )}
                        <span className="noticia-ver">{t.noticias.verNoticia}</span>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
