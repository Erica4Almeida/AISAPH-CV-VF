import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNoticiaBySlug, getNoticias } from '@/services/api'
import { getT } from '@/lib/getT'
import BlocksRenderer from '@/components/BlocksRenderer'
import ShareButtons from '@/components/ui/ShareButtons'
import YoutubeEmbed from '@/components/ui/YoutubeEmbed'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatDate } from '@/lib/formatDate'
import NoticiaGaleria from '@/components/ui/NoticiaGaleria'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

export async function generateStaticParams() {
  const noticias = await getNoticias()
  return noticias.map(n => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const noticia = await getNoticiaBySlug(slug)
  if (!noticia) return { title: 'Notícia não encontrada' }
  return {
    title: noticia.titulo,
    description: noticia.resumo ?? '',
    openGraph: { title: `${noticia.titulo} | AISAPH-CV`, description: noticia.resumo ?? '' },
  }
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [noticia, t] = await Promise.all([getNoticiaBySlug(slug), getT()])

  if (!noticia) notFound()

  const imgUrl = noticia.imagem?.url
    ? noticia.imagem.url.startsWith('http') ? noticia.imagem.url : `${STRAPI_URL}${noticia.imagem.url}`
    : null

  const dataFormatada = formatDate(noticia.data_publicacao || noticia.publishedAt, t.common.dateLocale)

  return (
    <>
      <section style={{
        background: imgUrl
          ? `linear-gradient(rgba(18,78,124,0.72) 0%, rgba(18,78,124,0.85) 100%), url('${imgUrl}') center 25%/cover no-repeat`
          : 'var(--azul)',
        padding: '100px 0 80px',
        color: '#fff',
      }}>
        <div className="container container-md">
          <Breadcrumb items={[
            { label: 'Notícias', href: '/noticias' },
            { label: noticia.titulo },
          ]} />
          {dataFormatada && <p className="noticia-pub-date">{t.noticias.publicadoEm} {dataFormatada}</p>}
          <h1 className="noticia-h1">{noticia.titulo}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container container-md">
          {noticia.resumo && <p className="noticia-lead">{noticia.resumo}</p>}
          {noticia.conteudo ? <BlocksRenderer content={noticia.conteudo} /> : null}
          {noticia.video_url && (
            <YoutubeEmbed url={noticia.video_url} titulo={noticia.titulo} />
          )}

          {noticia.galeria && noticia.galeria.length > 0 && (
            <div className="noticia-galeria">
              <h3 className="noticia-galeria-titulo">Fotografias</h3>
              <NoticiaGaleria fotos={noticia.galeria} titulo={noticia.titulo} />
            </div>
          )}

          <ShareButtons titulo={noticia.titulo} />

          <div className="noticia-voltar-wrap">
            <Link href="/noticias" className="noticia-voltar">{t.noticias.voltar}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
