'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

const STORAGE_KEY = 'aisaph-cookies'

export default function CookieBanner() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    document.cookie = `${STORAGE_KEY}=accepted;path=/;max-age=31536000;SameSite=Lax`
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-accent" />
      <div className="cookie-banner-body">
        <div className="cookie-banner-header">
          <span>🍪</span>
          <span className="cookie-banner-title">Cookies</span>
        </div>
        <p className="cookie-banner-text">
          {t.common.cookiesTexto}
          <Link href="/politica-utilizacao" className="cookie-banner-link">
            Política de Utilização
          </Link>
          {' e '}
          <Link href="/protecao-dados" className="cookie-banner-link">
            Proteção de Dados
          </Link>
          .
        </p>
        <div className="cookie-banner-btns">
          <button onClick={decline} className="cookie-btn-decline">
            {t.common.cookiesRecusar}
          </button>
          <button onClick={accept} className="cookie-btn-accept">
            {t.common.cookiesAceitar}
          </button>
        </div>
      </div>
    </div>
  )
}
