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
        </Link>
      </div>
    </article>
  )
}
