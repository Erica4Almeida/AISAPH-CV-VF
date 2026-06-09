'use client'
import type { Diferencial } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

export default function PorqueEscolher({ diferenciais }: { diferenciais: Diferencial[] }) {
  const { t } = useLanguage()
  if (diferenciais.length === 0) return null

  return (
    <section id="porque" className="porque">
      <div className="porque-watermark">AISAPH</div>

      <div className="porque-inner">
        <div className="porque-header">
          <p className="section-tag light">{t.home.porqueTag}</p>
          <h2
            className="section-title light"
            style={{ marginBottom: '14px', fontSize: 'clamp(1.7rem, 3.5vw, 2.6rem)' }}
          >
            {t.home.porqueTitulo}
          </h2>
          <p className="porque-subtitle">{t.home.porqueSubtitulo}</p>
        </div>

        <div className="porque-grid">
          {diferenciais.map((item, i) => (
            <AnimateOnScroll key={item.id} variant="fade-up" delay={i * 100}>
              <PorqueItem item={item} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

function PorqueItem({ item }: { item: Diferencial }) {
  return (
    <div className="porque-item">
      <div className="icon-clip porque-item-icon">{item.emoji}</div>
      <h3 className="porque-item-title">{item.titulo}</h3>
      <p className="porque-item-desc">{item.descricao}</p>
    </div>
  )
}
