'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import type { StrapiMedia } from '@/types'

import { mediaUrl } from '@/lib/media'

function getSrc(foto: StrapiMedia) {
  return mediaUrl(foto.url)
}

export default function NoticiaGaleria({ fotos, titulo }: { fotos: StrapiMedia[]; titulo: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const touchStart = useRef<number | null>(null)

  const fechar = useCallback(() => setLightbox(null), [])

  const navegar = useCallback((delta: number) => {
    setLightbox(prev => prev === null ? null : (prev + delta + fotos.length) % fotos.length)
  }, [fotos.length])

  useEffect(() => {
    if (lightbox === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     fechar()
      if (e.key === 'ArrowRight') navegar(1)
      if (e.key === 'ArrowLeft')  navegar(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [lightbox, fechar, navegar])

  return (
    <>
      <div className="noticia-galeria-grid">
        {fotos.map((foto, i) => {
          const src = getSrc(foto)
          return (
            <div
              key={foto.url}
              className="noticia-galeria-item"
              onClick={() => setLightbox(i)}
              role="button"
              tabIndex={0}
              aria-label="Ver foto"
              onKeyDown={e => { if (e.key === 'Enter') setLightbox(i) }}
            >
              <Image
                src={src}
                alt={foto.alternativeText || titulo}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i < 3}
              />
            </div>
          )
        })}
      </div>

      {lightbox !== null && (
        <div
          className="lb-backdrop"
          onClick={fechar}
          onTouchStart={e => { touchStart.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchStart.current === null) return
            const delta = touchStart.current - e.changedTouches[0].clientX
            if (Math.abs(delta) > 50) navegar(delta > 0 ? 1 : -1)
            touchStart.current = null
          }}
        >
          <button onClick={fechar} aria-label="Fechar" className="lb-close">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {fotos.length > 1 && (
            <button onClick={e => { e.stopPropagation(); navegar(-1) }} aria-label="Anterior" className="lb-arrow lb-arrow-prev">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}

          <div className="lb-content" onClick={e => e.stopPropagation()}>
            <img src={getSrc(fotos[lightbox])} alt={fotos[lightbox].alternativeText || titulo} className="lb-img" />
            <p className="lb-counter">{lightbox + 1} / {fotos.length}</p>
          </div>

          {fotos.length > 1 && (
            <button onClick={e => { e.stopPropagation(); navegar(1) }} aria-label="Próxima" className="lb-arrow lb-arrow-next">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}
