import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCursoBySlug, getCursos } from '@/services/api'
import { getT } from '@/lib/getT'
import CourseCard from '@/components/cursos/CourseCard'
import Breadcrumb from '@/components/ui/Breadcrumb'
import type { CursoCategoria } from '@/types'
import { mediaUrl as imgSrc } from '@/lib/media'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aisaph.com'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const curso = await getCursoBySlug(slug)
    if (!curso) return { title: 'Curso não encontrado' }
    const desc = curso.descricao?.replace(/<[^>]*>/g, '').slice(0, 160) ?? ''
    return {
      title: curso.titulo,
      description: desc,
      openGraph: {
        title: `${curso.titulo} | AISAPH-CV`,
        description: desc,
        ...(curso.imagem ? { images: [{ url: imgSrc(curso.imagem.url) }] } : {}),
      },
    }
  } catch {
    return { title: 'Curso | AISAPH-CV' }
  }
}

export default async function CursoDetailPage({ params }: Props) {
  const { slug } = await params
  const [curso, t] = await Promise.all([getCursoBySlug(slug), getT()])
  if (!curso) notFound()

  const relacionados = (await getCursos(curso.categoria as CursoCategoria))
    .filter(c => c.slug !== curso.slug)
    .slice(0, 3)

  const { titulo, descricao, carga_horaria, publico_alvo, certificacao, categoria, imagem } = curso
  const img = imagem
  const catLabel = t.cursos.categorias[categoria as keyof typeof t.cursos.categorias] ?? categoria

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: titulo,
    description: descricao?.replace(/<[^>]*>/g, '').slice(0, 500) ?? '',
    url: `${SITE_URL}/cursos/${curso.slug}`,
    provider: { '@type': 'Organization', name: 'AISAPH-CV', sameAs: SITE_URL },
    ...(carga_horaria ? { timeRequired: carga_horaria } : {}),
    ...(img ? { image: imgSrc(img.url) } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{
        background: img
          ? `linear-gradient(135deg,rgba(10,61,98,0.92) 0%,rgba(10,61,98,0.75) 100%), url('${imgSrc(img.url)}') center 25%/cover no-repeat`
          : 'var(--azul)',
        padding: '120px 0 80px',
        color: '#fff',
      }}>
        <div className="container container-lg">
          <Breadcrumb items={[
            { label: 'Cursos', href: '/cursos' },
            { label: titulo },
          ]} />
          <div className="curso-cat-badge">{catLabel}</div>
          <h1 className="curso-hero-h1">{titulo}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="curso-detail-grid">
            <div>
              <h2 className="curso-detail-h2">{t.cursos.sobreCurso}</h2>
              <div className="curso-detail-text" dangerouslySetInnerHTML={{ __html: descricao ?? '' }} />

              {img && (
                <div className="curso-detail-img-wrap">
                  <Image
                    src={imgSrc(img.url)}
                    fill
                    alt={titulo}
                    sizes="(max-width: 900px) 100vw, 60vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="curso-detail-img-overlay">
                    <span className="curso-detail-img-label">{titulo}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="curso-sidebar">
              <h3 className="curso-sidebar-title">{t.cursos.detalhes}</h3>
              {[
                { label: t.cursos.cargaHoraria, value: carga_horaria },
                { label: t.cursos.publicoAlvo,  value: publico_alvo },
                { label: t.cursos.certificacao, value: certificacao },
                { label: t.cursos.categoria,    value: catLabel },
              ].map(item => (
                <div key={item.label} className="curso-sidebar-item">
                  <div className="curso-sidebar-label">{item.label}</div>
                  <div className="curso-sidebar-value">{item.value}</div>
                </div>
              ))}
              <div className="curso-sidebar-btns">
                <Link href={`/inscricoes?curso=${encodeURIComponent(titulo)}`}
                  className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  {t.cursos.inscrever}
                </Link>
                <Link href="/contato" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                  {t.cursos.tirarDuvidas}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="section" style={{ background: 'var(--cinza-claro)' }}>
          <div className="container">
            <h2 className="section-h2" style={{ textAlign: 'center', marginBottom: '40px' }}>
              Outros cursos que podem interessar
            </h2>
            <div className="cursos-resultado-grid">
              {relacionados.map((c, i) => (
                <CourseCard key={c.id} curso={c} priority={i === 0} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
