'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { Hero } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import CountUp from '@/components/ui/CountUp'

export default function HeroSection({ hero }: { hero?: Hero | null }) {
  const { t } = useLanguage()
  const badge     = hero?.badge           ?? ''
  const parte1    = hero?.titulo_parte1   ?? ''
  const destaque  = hero?.titulo_destaque ?? ''
  const parte2    = hero?.titulo_parte2   ?? ''
  const subtitulo = hero?.subtitulo       ?? ''

  const stats = hero ? [
    { num: hero.stat_1_num, unit: hero.stat_1_unit, label: hero.stat_1_label },
    { num: hero.stat_2_num, unit: hero.stat_2_unit, label: hero.stat_2_label },
    { num: hero.stat_3_num, unit: hero.stat_3_unit, label: hero.stat_3_label },
    { num: hero.stat_4_num, unit: hero.stat_4_unit, label: hero.stat_4_label },
  ] : []

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-blob" />

      <div className="hero-content">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            {badge}
          </div>

          <h1 className="hero-title">
            {parte1}{' '}
            <span className="hero-title-sub">{destaque}</span>{' '}
            {parte2}
          </h1>

          <p className="hero-subtitle">{subtitulo}</p>

          <div className="hero-ctas">
            <Link href="/inscricoes" className="btn btn-primary">{t.hero.inscricao}</Link>
            <Link href="/in-company" className="btn btn-primary">{t.hero.inCompany}</Link>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="hero-stat"
            style={{
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              animation: `fadeUp 0.9s ease ${i * 0.1}s both`,
            }}
          >
            <div className="hero-stat-num">
              <CountUp value={s.num} suffix={s.unit} />
            </div>
            <div className="hero-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
