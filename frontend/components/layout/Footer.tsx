'use client'
import Link from 'next/link'
import type { Configuracao } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer({ cfg }: { cfg: Configuracao | null }) {
  const { t } = useLanguage()

  const navLinks = [
    { label: t.common.inicio,     href: '/'          },
    { label: t.nav.sobreNos,      href: '/sobre'     },
    { label: t.nav.cursos,        href: '/cursos'    },
    { label: t.nav.clientes,      href: '/in-company'},
    { label: t.nav.galeria,       href: '/galeria'   },
    { label: t.nav.noticias,      href: '/noticias'  },
    { label: t.common.calendario, href: '/inscricoes'},
    { label: t.common.faq,        href: '/faq'       },
    { label: t.nav.contato,       href: '/contato'   },
  ]

  const email        = cfg?.contato_email      ?? ''
  const telefone     = cfg?.contato_telefone   ?? ''
  const rawTelHref   = cfg?.contato_telefone_href ?? ''
  const telefoneHref = rawTelHref.startsWith('tel:') || rawTelHref.startsWith('http')
    ? rawTelHref
    : telefone ? `tel:${telefone.replace(/\s/g, '')}` : '#'
  const whatsapp     = cfg?.contato_whatsapp   ?? ''
  const whatsappHref = cfg?.contato_whatsapp_href ?? (whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : '#')
  const localizacao  = cfg?.contato_localizacao ?? ''
  const descricao    = cfg?.footer_descricao   ?? 'Academia Internacional de Socorrismo e Atendimento Pré-Hospitalar de Cabo Verde. Credibilidade que salva vidas.'

  const contactos = [
    ...(email       ? [{ icon: '✉',  label: email,     href: `mailto:${email}` }] : []),
    ...(telefone    ? [{ icon: '📞', label: telefone,  href: telefoneHref       }] : []),
    ...(whatsapp    ? [{ icon: '💬', label: `WhatsApp: ${whatsapp}`, href: whatsappHref }] : []),
    ...(localizacao ? [{ icon: '📍', label: localizacao, href: '/contato'      }] : []),
  ]

  const sociais = [
    ...(cfg?.social_facebook  ? [{ label: 'Facebook',  href: cfg.social_facebook,  icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    )}] : []),
    ...(cfg?.social_instagram ? [{ label: 'Instagram', href: cfg.social_instagram, icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
    )}] : []),
    ...(cfg?.social_linkedin  ? [{ label: 'LinkedIn',  href: cfg.social_linkedin,  icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
    )}] : []),
  ]

  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="footer-brand">AISAPH-CV</div>
          <p className="footer-desc">{descricao}</p>
          {contactos.length > 0 && (
            <div className="footer-contacts">
              {contactos.map(c => (
                <a key={c.label} href={c.href} className="footer-contact-link">
                  <span>{c.icon}</span><span>{c.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="footer-heading">{t.footer.navegacao}</h4>
          <ul className="footer-nav-list">
            {navLinks.map(n => (
              <li key={n.label}>
                <Link href={n.href} className="footer-nav-link">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">{t.footer.redes}</h4>
          {sociais.length > 0 && (
            <div className="footer-socials">
              {sociais.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="footer-social-btn" aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        <div />
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} AISAPH-CV. {t.footer.direitos}</span>
        <span>{t.footer.academia}</span>
      </div>
    </footer>
  )
}
