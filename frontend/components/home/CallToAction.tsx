import Link from 'next/link'
import type { Configuracao } from '@/types'

export default function CallToAction({ cfg }: { cfg: Configuracao | null }) {
  const titulo    = cfg?.cta_titulo        ?? ''
  const subtitulo = cfg?.cta_subtitulo     ?? ''
  const btnPrim   = cfg?.cta_btn_primario  ?? ''
  const btnSec    = cfg?.cta_btn_secundario ?? ''

  if (!titulo) return null

  return (
    <section className="cta">
      <div className="cta-stripes" />

      <div className="cta-inner">
        {cfg?.cta_tag && <p className="section-tag center light">{cfg.cta_tag}</p>}

        <h2 className="cta-title">{titulo}</h2>

        {subtitulo && <p className="cta-subtitle">{subtitulo}</p>}

        <div className="cta-btns">
          {btnPrim && <Link href="/inscricoes" className="btn-white">{btnPrim}</Link>}
          {btnSec  && <Link href="/in-company" className="btn-outline-white">{btnSec}</Link>}
        </div>
      </div>
    </section>
  )
}
