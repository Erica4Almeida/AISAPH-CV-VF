'use client'
import { useState, useEffect } from 'react'

interface Slide {
  image: string
  label: string
  position?: string
}

export default function BannerCarousel({
  slides,
  titulo,
  subtitulo,
  btnLabel,
  btnHref,
}: {
  slides: Slide[]
  titulo: string
  subtitulo: string
  btnLabel: string
  btnHref: string
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="carousel">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="carousel-slide"
          style={{
            backgroundImage: `linear-gradient(rgba(18,78,124,0.65) 0%, rgba(18,78,124,0.80) 100%), url('${slide.image}')`,
            backgroundPosition: slide.position ?? 'center 25%',
            opacity: idx === current ? 1 : 0,
            zIndex: idx === current ? 1 : 0,
          }}
        />
      ))}

      <div className="container carousel-content">
        <p className="carousel-label">{slides[current].label}</p>
        <h1 className="carousel-h1">{titulo}</h1>
        <p className="carousel-subtitle">{subtitulo}</p>
        <a href={btnHref} className="btn btn-primary carousel-btn-cta">
          {btnLabel}
        </a>
      </div>

      <div className="carousel-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`carousel-dot${idx === current ? ' active' : ''}`}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(prev => (prev - 1 + slides.length) % slides.length)}
            aria-label="Anterior"
            className="carousel-arrow carousel-arrow-prev"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            onClick={() => setCurrent(prev => (prev + 1) % slides.length)}
            aria-label="Próximo"
            className="carousel-arrow carousel-arrow-next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </>
      )}
    </section>
  )
}
