import type { Metadata } from 'next'
import { getConfiguracao } from '@/services/api'
import { getT } from '@/lib/getT'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Entre em contacto com a AISAPH-CV. Telefone, WhatsApp e localização.',
  openGraph: {
    title: 'Contacto | AISAPH-CV',
    description: 'Entre em contacto com a AISAPH-CV. Telefone, WhatsApp e localização.',
  },
}

export default async function ContatoPage() {
  const [cfg, t] = await Promise.all([getConfiguracao(), getT()])

  const telefone     = cfg?.contato_telefone     ?? ''
  const rawTelHref   = cfg?.contato_telefone_href ?? ''
  const telefoneHref = rawTelHref.startsWith('tel:') || rawTelHref.startsWith('http')
    ? rawTelHref
    : telefone ? `tel:${telefone.replace(/\s/g, '')}` : '#'
  const whatsapp     = cfg?.contato_whatsapp     ?? ''
  const whatsappHref = cfg?.contato_whatsapp_href ?? (whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : '#')
  const email        = cfg?.contato_email        ?? ''
  const localizacao  = cfg?.contato_localizacao  ?? ''
  const mapsEmbed    = cfg?.contato_maps_embed   ?? ''
  const isEmbedUrl   = mapsEmbed.startsWith('https://www.google.com/maps/embed')
  const mapsLink     = mapsEmbed || (localizacao ? `https://maps.google.com/?q=${encodeURIComponent(localizacao)}` : '')

  const contactos = [
    ...(localizacao ? [{ icon: '📍', titulo: t.contato.localizacao, linha: localizacao, href: null }] : []),
    ...(telefone    ? [{ icon: '📞', titulo: t.contato.telefone,    linha: telefone,    href: telefoneHref }] : []),
    ...(whatsapp    ? [{ icon: '💬', titulo: t.contato.whatsapp,    linha: whatsapp,    href: whatsappHref }] : []),
  ]

  return (
    <>
      <section className="page-hero">
        <div className="container container-sm">
          <p className="page-hero-tag">{t.contato.tag}</p>
          <h1 className="page-hero-h1">{t.contato.titulo}</h1>
          <p className="page-hero-subtitle">{t.contato.subtitulo}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contato-grid">
            <div className="contato-cards">
              {contactos.map(c => (
                <div key={c.titulo} className="contato-card-item">
                  <div className="contato-card-icon">{c.icon}</div>
                  <div>
                    <div className="contato-card-label">{c.titulo}</div>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="contato-card-link"
                      >
                        {c.linha}
                      </a>
                    ) : (
                      <span className="contato-card-text">{c.linha}</span>
                    )}
                  </div>
                </div>
              ))}

              {whatsapp && (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
                  className="contato-whatsapp-btn"
                >
                  💬 {t.contato.iniciarWhatsapp}
                </a>
              )}

              {email && (
                <a href={`mailto:${email}`} className="contato-email-btn">
                  ✉ {email}
                </a>
              )}
            </div>

            {mapsLink && (
              <div className="contato-map-col">
                {isEmbedUrl && (
                  <div className="contato-map-wrap">
                    <iframe
                      src={mapsEmbed}
                      width="100%"
                      height="420"
                      className="contato-map-iframe"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localização AISAPH-CV"
                    />
                  </div>
                )}
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="contato-map-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {t.contato.abrirMaps}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
