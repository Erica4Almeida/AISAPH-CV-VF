'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { Depoimento } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import { mediaUrl } from '@/lib/media'

const PER_PAGE = 3
const MAX_CHARS = 150

export default function Depoimentos({ depoimentos }: { depoimentos: Depoimento[] }) {
  const { t } = useLanguage()
  const [page, setPage] = useState(0)

  if (!depoimentos?.length) return null

  const totalPages = Math.ceil(depoimentos.length / PER_PAGE)
  const current = depoimentos.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  return (
    <section className="dep-section">
      <div className="dep-header">
        <p className="section-tag center">{t.home.depTag}</p>
        <h2 className="section-title" style={{ marginBottom: '12px' }}>{t.home.depTitulo}</h2>
        <p className="dep-subtitle">{t.home.depSubtitulo}</p>
      </div>

      <div className="dep-container">
        <div className="dep-grid">
          {current.map((d, i) => (
            <DepCard key={`${page}-${i}`} depoimento={d} t={t} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="dep-nav">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="dep-nav-btn"
              aria-label="Anterior"
            >
              ‹
            </button>

            <div className="dep-dots">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`dep-dot${i === page ? ' active' : ''}`}
                  aria-label={`Página ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="dep-nav-btn"
              aria-label="Próximo"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function DepCard({ depoimento: d, t }: { depoimento: Depoimento; t: ReturnType<typeof useLanguage>['t'] }) {
  const [expanded, setExpanded] = useState(false)

  const iniciais = d.nome
    .trim()
    .split(' ')
    .filter(p => p.length > 0)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('')

  const texto = d.texto.trim()
  const isTruncable = texto.length > MAX_CHARS
  const display = expanded || !isTruncable ? texto : texto.slice(0, MAX_CHARS) + '…'

  return (
    <div className="dep-card">
      <span className="dep-card-quote">"</span>

      <div className="dep-card-body">
        <p className="dep-card-text">{display}</p>
        {isTruncable && (
          <button onClick={() => setExpanded(e => !e)} className="dep-card-expand-btn">
            {expanded ? t.common.verMenos : t.common.verMais}
          </button>
        )}
      </div>

      <div className="dep-card-author">
        {d.foto ? (
          <Image
            src={mediaUrl(d.foto.url)}
            alt={d.nome}
            width={36} height={36}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div className="dep-card-avatar-initials">{iniciais}</div>
        )}
        <div className="dep-card-author-info">
          <div className="dep-card-author-name">{d.nome.trim()}</div>
          {(d.cargo || d.empresa) && (
            <div className="dep-card-author-role">
              {d.cargo}{d.empresa ? ` · ${d.empresa}` : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
