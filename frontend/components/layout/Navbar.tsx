'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Locale } from '@/locales/translations'

const LOCALES: Locale[] = ['pt', 'en', 'fr', 'es']

const LOCALE_COUNTRY: Record<Locale, string> = {
  pt: 'pt',
  en: 'gb',
  fr: 'fr',
  es: 'es',
}

function FlagImg({ locale }: { locale: Locale }) {
  return (
    <img
      src={`https://flagcdn.com/20x15/${LOCALE_COUNTRY[locale]}.png`}
      srcSet={`https://flagcdn.com/40x30/${LOCALE_COUNTRY[locale]}.png 2x`}
      width={20}
      height={15}
      alt={locale.toUpperCase()}
      style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '2px' }}
    />
  )
}

interface NavItem {
  href?: string
  label: string
  dropdown?: { href: string; label: string }[]
}

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage()
  const router = useRouter()
  const [scrolled, setScrolled]             = useState(false)
  const [open, setOpen]                     = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [langOpen, setLangOpen]             = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const langRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const showDropdown = (label: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setActiveDropdown(label)
  }

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => setActiveDropdown(null), 220)
  }

  const links: NavItem[] = [
    { href: '/cursos', label: t.nav.cursos },
    {
      label: t.nav.sobreNos,
      dropdown: [
        { href: '/sobre',               label: t.nav.sobre              },
        { href: '/politica-utilizacao', label: t.nav.politicaUtilizacao },
        { href: '/termos-condicoes',    label: t.nav.termosCondicoes    },
        { href: '/protecao-dados',      label: t.nav.protecaoDados      },
      ],
    },
    {
      label: t.nav.clientes,
      dropdown: [
        { href: '/in-company', label: t.nav.empresas    },
        { href: '/in-company', label: t.nav.instituicoes },
      ],
    },
    { href: '/galeria',    label: t.nav.galeria    },
    { href: '/noticias',   label: t.nav.noticias   },
    { href: '/inscricoes', label: t.nav.inscricoes  },
    { href: '/contato',    label: t.nav.contato     },
  ]

  return (
    <>
      <nav
        className="nav"
        style={{ boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.2)' : 'none' }}
      >
        <Link href="/" className="nav-logo">
          <img src="/logo.png" alt="AISAPH-CV" style={{ height: '40px', width: 'auto' }} />
          <span className="nav-logo-text">AISAPH-CV</span>
        </Link>

        <div className="nav-desktop">
          <ul className="nav-links">
            {links.map(item => (
              <li
                key={item.label}
                onMouseEnter={() => item.dropdown && showDropdown(item.label)}
                onMouseLeave={() => item.dropdown && scheduleHide()}
              >
                {item.href ? (
                  <Link href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ) : (
                  <button className="nav-link">
                    {item.label}
                    <span className="nav-link-chevron">▾</span>
                  </button>
                )}

                {item.dropdown && activeDropdown === item.label && (
                  <ul
                    className="nav-dropdown"
                    onMouseEnter={() => showDropdown(item.label)}
                    onMouseLeave={scheduleHide}
                  >
                    {item.dropdown.map(sub => (
                      <li key={sub.label}>
                        <Link
                          href={sub.href}
                          onClick={() => setActiveDropdown(null)}
                          className="nav-dropdown-item"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div ref={langRef} className="nav-lang-selector">
            <button onClick={() => setLangOpen(prev => !prev)} className="nav-lang-btn">
              <FlagImg locale={locale} />
              <span>{locale.toUpperCase()}</span>
              <span className="nav-lang-chevron">{langOpen ? '▴' : '▾'}</span>
            </button>

            {langOpen && (
              <ul className="nav-lang-dropdown">
                {LOCALES.map(l => (
                  <li key={l}>
                    <button
                      onClick={() => { setLocale(l); setLangOpen(false); router.refresh() }}
                      className={`nav-lang-option${l === locale ? ' active' : ''}`}
                    >
                      <FlagImg locale={l} />
                      <span>{l.toUpperCase()}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="nav-hamburger"
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="nav-mobile-menu">
          {links.map(item => (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="nav-mobile-link"
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className="nav-mobile-accordion"
                  >
                    {item.label}
                    <span className="nav-mobile-accordion-chevron">
                      {mobileExpanded === item.label ? '▲' : '▼'}
                    </span>
                  </button>
                  {mobileExpanded === item.label && item.dropdown?.map(sub => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => { setOpen(false); setMobileExpanded(null) }}
                      className="nav-mobile-sub-link"
                    >
                      — {sub.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          ))}

          <div className="nav-mobile-lang-section">
            <p className="nav-mobile-lang-label">Idioma / Language</p>
            <div className="nav-mobile-lang-btns">
              {LOCALES.map(l => (
                <button
                  key={l}
                  onClick={() => { setLocale(l); setOpen(false); router.refresh() }}
                  className={`nav-mobile-lang-btn${locale === l ? ' active' : ''}`}
                >
                  <FlagImg locale={l} />
                  <span>{l.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
