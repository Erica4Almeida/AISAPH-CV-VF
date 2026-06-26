'use client'
import Link from 'next/link'
import Image from 'next/image'
import type { Curso } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

import { mediaUrl } from '@/lib/media'

export default function CourseCard({ curso, priority }: { curso: Curso; priority?: boolean }) {
  const { t } = useLanguage()
  const img = curso.imagem
  const cat = curso.categoria

  return (
    <article className="cc-article">
      {img ? (
        <div className="cc-img">
          <Image
            src={mediaUrl(img.url)}
            alt={img.alternativeText || curso.titulo}
            fill
            priority={priority}
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div className={`cc-stripe cc-stripe-${cat}`} />
      )}

      <div className="cc-body">
        <span className={`cc-cat cc-cat-${cat}`}>
          {t.cursos.categorias[cat as keyof typeof t.cursos.categorias]}
        </span>

        <h3 className="cc-title">{curso.titulo}</h3>

        <p className="cc-desc">{curso.descricao?.slice(0, 130)}...</p>

        <div className="cc-meta">
          <strong>{curso.carga_horaria}</strong>
        </div>

        <Link href={`/cursos/${curso.slug}`} className="cc-link">
          {t.cursos.verCurso}
          <svg className="cc-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </article>
  )
}
