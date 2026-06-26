'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import type { GaleriaFoto, StrapiMedia } from '@/types'

import { mediaUrl as buildUrl } from '@/lib/media'

function mediaUrl(media: StrapiMedia): string {
  return buildUrl(media.url)
}

type ImageItem = {
  src: string
  alt: string
  titulo?: string
  descricao?: string
}

type Group = {
  titulo: string | null
  images: Array<ImageItem & { flatIdx: number }>
}

function buildGroups(fotos: GaleriaFoto[]): { allImages: ImageItem[]; groups: Group[] } {
  const allImages: ImageItem[] = []
  const groups: Group[] = []

  for (const foto of fotos) {
    const medias: StrapiMedia[] = Array.isArray(foto.imagem)
      ? (foto.imagem as StrapiMedia[]).filter(m => m?.url)
      : foto.imagem?.url ? [foto.imagem as StrapiMedia] : []

    if (medias.length === 0) continue

    const hasTitulo = !!foto.titulo
    const groupImages: Array<ImageItem & { flatIdx: number }> = []

    for (const media of medias) {
      const item: ImageItem = {
        src: mediaUrl(media),
        alt: media.alternativeText || foto.titulo || 'Foto AISAPH-CV',
        titulo: foto.titulo || undefined,
        descricao: foto.descricao,
      }
      allImages.push(item)
      groupImages.push({ ...item, flatIdx: allImages.length - 1 })
    }

    const lastGroup = groups[groups.length - 1]
    if (!hasTitulo && lastGroup && lastGroup.titulo === null) {
      lastGroup.images.push(...groupImages)
    } else {
      groups.push({ titulo: foto.titulo || null, images: groupImages })
    }
  }

  return { allImages, groups }
}

export default function GaleriaGrid({ fotos }: { fotos: GaleriaFoto[] }) {
  const { t } = useLanguage()
  const [lightbox, setLightbox] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const { allImages, groups } = buildGroups(fotos)

  const fechar = useCallback(() => setLightbox(null), [])

  const navegar = useCallback((delta: number) => {
    setLightbox(prev => {
      if (prev === null) return null
      return (prev + delta + allImages.length) % allImages.length
    })
  }, [allImages.length])

  useEffect(() => {
    if (lightbox === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') fechar()
      if (e.key === 'ArrowRight') navegar(1)
      if (e.key === 'ArrowLeft') navegar(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, fechar, navegar])

  if (allImages.length === 0) {
    return <p className="galeria-empty">{t.galeria.vazia}</p>
  }

  const fotoAtiva = lightbox !== null ? allImages[lightbox] : null

  return (
    <>
      <div className="galeria-grid">
        {groups.map((group, gIdx) => (
          <div key={gIdx}>
            {group.titulo && (
              <h3 className="galeria-group-title">{group.titulo}</h3>
            )}
            <div className="galeria-thumbs">
              {group.images.map(img => (
                <div
                  key={img.flatIdx}
                  className="foto-cell"
                  onClick={() => setLightbox(img.flatIdx)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox(img.flatIdx) } }}
                  role="button"
                  tabIndex={0}
                  aria-label={img.titulo || 'Ver foto'}
                >
                  <Image
                    src={img.src}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    alt={img.alt}
                    style={{ objectFit: 'cover' }}
                    priority={img.flatIdx < 6}
                  />
                  <div className="foto-overlay">
                    {img.descricao && (
                      <p className="foto-overlay-desc">{img.descricao}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {fotoAtiva && (
        <div
          className="lb-backdrop"
          onClick={fechar}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return
            const delta = touchStartX.current - e.changedTouches[0].clientX
            if (Math.abs(delta) > 50) navegar(delta > 0 ? 1 : -1)
            touchStartX.current = null
          }}
        >
          <button onClick={fechar} aria-label="Fechar" className="lb-close">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {allImages.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); navegar(-1) }}
              aria-label="Anterior"
              className="lb-arrow lb-arrow-prev"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div className="lb-content" onClick={e => e.stopPropagation()}>
            <img src={fotoAtiva.src} alt={fotoAtiva.alt} className="lb-img" />
            {(fotoAtiva.titulo || fotoAtiva.descricao) && (
              <div className="lb-caption">
                {fotoAtiva.titulo && (
                  <p className="lb-caption-title">{fotoAtiva.titulo}</p>
                )}
                {fotoAtiva.descricao && (
                  <p className="lb-caption-desc">{fotoAtiva.descricao}</p>
                )}
              </div>
            )}
            <p className="lb-counter">{(lightbox ?? 0) + 1} / {allImages.length}</p>
          </div>

          {allImages.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); navegar(1) }}
              aria-label="Próxima"
              className="lb-arrow lb-arrow-next"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}
