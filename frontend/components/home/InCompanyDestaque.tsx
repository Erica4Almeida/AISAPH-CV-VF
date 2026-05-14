import Link from 'next/link'
import type { Configuracao } from '@/types'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

export default function InCompanyDestaque({ cfg }: { cfg: Configuracao | null }) {
  if (!cfg) return null

  const servicos: string[] = Array.isArray(cfg.incompany_servicos) ? cfg.incompany_servicos : []
  const imagemSrc = cfg.incompany_imagem_url
    ? cfg.incompany_imagem_url.startsWith('http')
      ? cfg.incompany_imagem_url
      : `${STRAPI_URL}${cfg.incompany_imagem_url}`
    : null

  return (
    <section id="incompany" className="incompany-section">
      <div className="incompany-grid">
        {imagemSrc && (
          <div className="incompany-img-wrap">
            <img
              src={imagemSrc}
              alt={cfg.incompany_titulo || 'Formação In-Company AISAPH-CV'}
              className="incompany-img"
            />
            <div className="incompany-img-overlay" />
            {cfg.incompany_badge_num && (
              <div className="incompany-badge">
                <span className="incompany-badge-num">{cfg.incompany_badge_num}</span>
                {cfg.incompany_badge_label && (
                  <span className="incompany-badge-label">{cfg.incompany_badge_label}</span>
                )}
              </div>
            )}
          </div>
        )}

        <div>
          {cfg.incompany_tag && <p className="section-tag">{cfg.incompany_tag}</p>}
          <h2 className="section-title" style={{ marginBottom: '20px' }}>
            {cfg.incompany_titulo || 'Formação In-Company'}
          </h2>
          {cfg.incompany_descricao && (
            <p className="incompany-desc">{cfg.incompany_descricao}</p>
          )}

          {servicos.length > 0 && (
            <ul className="incompany-lista">
              {servicos.map(s => (
                <li key={s} className="incompany-lista-item">
                  <span className="incompany-lista-arrow">▸</span>
                  {s}
                </li>
              ))}
            </ul>
          )}

          <Link href="/in-company" className="btn btn-primary">
            {cfg.incompany_btn_proposta || 'Solicitar Proposta'}
          </Link>
        </div>
      </div>
    </section>
  )
}
