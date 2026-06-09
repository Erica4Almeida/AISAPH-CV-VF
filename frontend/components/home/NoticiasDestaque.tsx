import Link from 'next/link'
import Image from 'next/image'
import type { Noticia } from '@/types'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import { formatDate } from '@/lib/formatDate'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

function getImgUrl(n: Noticia): string | null {
  if (!n.imagem?.url) return null
  return n.imagem.url.startsWith('http') ? n.imagem.url : `${STRAPI_URL}${n.imagem.url}`
}


export default function NoticiasDestaque({ noticias }: { noticias: Noticia[] }) {
  if (!noticias || noticias.length === 0) return null

  return (
    <section className="noticias-destaque-section">
      <div className="container">
        <AnimateOnScroll variant="fade-up">
          <div className="noticias-destaque-header">
            <p className="section-tag">Novidades</p>
            <h2 className="section-title">Últimas Notícias</h2>
          </div>
        </AnimateOnScroll>

        <div className="noticias-destaque-grid">
          {noticias.map((n, i) => {
            const imgUrl = getImgUrl(n)
            const data = formatDate(n.data_publicacao || n.publishedAt)
            return (
              <AnimateOnScroll key={n.id} variant="fade-up" delay={i * 120}>
                <Link href={`/noticias/${n.slug}`} className="nd-card-link">
                  <article className="nd-card">
                    {imgUrl && (
                      <div className="nd-card-img">
                        <Image
                          src={imgUrl}
                          alt={n.titulo}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="nd-card-body">
                      {data && <p className="nd-card-data">{data}</p>}
                      <h3 className="nd-card-titulo">{n.titulo}</h3>
                      {n.resumo && (
                        <p className="nd-card-resumo">
                          {n.resumo.length > 110 ? n.resumo.slice(0, 110) + '…' : n.resumo}
                        </p>
                      )}
                      <span className="nd-card-ver">
                        Ler mais
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s' }}>
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

        <AnimateOnScroll variant="fade-up" delay={200}>
          <div className="noticias-destaque-footer">
            <Link href="/noticias" className="btn btn-outline">Ver todas as notícias</Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
