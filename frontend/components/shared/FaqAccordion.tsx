'use client'
import { useState } from 'react'
import type { Faq } from '@/types'

interface Props {
  faqs: Faq[]
}

export default function FaqAccordion({ faqs }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (faqs.length === 0) return null

  return (
    <div className="faq-list">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id
        return (
          <div key={faq.id} className={`faq-item${isOpen ? ' open' : ''}`}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              className="faq-btn"
            >
              <span>{faq.pergunta}</span>
              <span aria-hidden="true" className="faq-icon">+</span>
            </button>

            <div className="faq-collapse">
              <div className="faq-answer">{faq.resposta}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
