import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getNoticias } from '@/services/api'
import { getT } from '@/lib/getT'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import type { Noticia } from '@/types'
import { formatDate } from '@/lib/formatDate'

export const metadata: Metadata = {
  title: 'Notícias',
  description: 'Fique a par das últimas novidades, eventos e actividades da AISAPH-CV.',
  openGraph: {
    title: 'Notícias | AISAPH-CV',
    description: 'Últimas novidades da AISAPH-CV.',
  },
}

import { mediaUrl } from '@/lib/media'

function getImageUrl(noticia: Noticia): string | null {
  return mediaUrl(noticia.imagem?.url) || null
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
              {noticias.map((n: Noticia, i: number) => {
                const imgUrl = getImageUrl(n)
                const dataFormatada = formatDate(n.data_publicacao || n.publishedAt, t.common.dateLocale)
                return (
                  <AnimateOnScroll key={n.id} variant="fade-up" delay={i % 3 * 100}>
                    <Link href={`/noticias/${n.slug}`} className="noticia-link">
                      <article className="noticia-card">
                        {imgUrl && (
                          <div className="noticia-img-wrap">
                            <Image
                              src={imgUrl}
                              alt={n.titulo}
                              fill
                              style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
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
                          <span className="noticia-ver">
                          {t.noticias.verNoticia}
                          <svg className="noticia-ver-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </span>
                        </div>
                      </article>
                    </Link>
                  </AnimateOnScroll>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
