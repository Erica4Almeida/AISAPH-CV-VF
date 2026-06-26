'use client'
import Link from 'next/link'
import Image from 'next/image'
import type { Curso } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Translations } from '@/locales/translations'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import { mediaUrl } from '@/lib/media'

interface Props { cursos: Curso[] }

const categoriaOrdem: Record<string, number> = {
  basico: 1,
  avancado: 2,
  especializado: 3,
}

export default function CursosDestaque({ cursos }: Props) {
  const { t } = useLanguage()
  if (!cursos || cursos.length === 0) return null

  const ordenados = [...cursos].sort(
    (a, b) => (categoriaOrdem[a.categoria] ?? 99) - (categoriaOrdem[b.categoria] ?? 99),
  )

  return (
    <section id="cursos" className="cursos-destaque">
      <div className="cursos-destaque-header">
        <p className="section-tag">{t.home.cursosTag}</p>
        <h2 className="section-title" style={{ marginBottom: '20px' }}>
          {t.home.cursosTitulo}
        </h2>
        <p className="cursos-destaque-subtitle">{t.home.cursosSubtitulo}</p>
      </div>

      <div className="cursos-grid">
        {ordenados.map((c, i) => (
          <AnimateOnScroll key={c.id} variant="fade-up" delay={i * 120}>
            <CourseCard curso={c} t={t} />
          </AnimateOnScroll>
        ))}
      </div>

      <div className="cursos-destaque-footer">
        <Link href="/cursos" className="btn btn-primary">{t.home.verTodos}</Link>
      </div>
    </section>
  )
}

function CourseCard({ curso, t }: { curso: Curso; t: Translations }) {
  const img = curso.imagem
  const catLabel = t.cursos.categorias[curso.categoria as keyof typeof t.cursos.categorias]

  return (
    <article className="curso-card reveal">
      {img && (
        <div className="curso-card-img">
          <Image
            src={mediaUrl(img.url)}
            alt={img.alternativeText || curso.titulo}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
          />
        </div>
      )}

      <p className="curso-card-cat">{catLabel}</p>

      <h3 className="curso-card-title">{curso.titulo}</h3>

      <p className="curso-card-desc">{curso.descricao?.slice(0, 120) + '...'}</p>

      <div className="curso-card-meta">
        <div className="curso-card-meta-item">
          <strong className="curso-card-meta-strong">{curso.carga_horaria}</strong>
          {t.cursos.cargaHoraria}
        </div>
        <div className="curso-card-meta-item">
          <strong className="curso-card-meta-strong">{curso.publico_alvo}</strong>
          {t.cursos.publicoAlvo}
        </div>
      </div>

      <Link href={`/cursos#${curso.categoria}`} className="curso-card-link">
        {t.home.saibaMais}
      </Link>
    </article>
  )
}
