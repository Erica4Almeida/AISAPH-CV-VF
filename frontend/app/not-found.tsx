import Link from 'next/link'
import { getT } from '@/lib/getT'

export default async function NotFound() {
  const t = await getT()

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <section style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 5%',
        background: 'var(--cinza-claro)',
        textAlign: 'center',
      }}>
        <div>
          <div style={{ fontSize: '5rem', marginBottom: '8px' }}>🚑</div>
          <p style={{
            fontFamily: 'var(--font-titulo)',
            fontSize: '0.75rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--vermelho)',
            marginBottom: '16px',
          }}>
            404
          </p>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: 'var(--azul)',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            {t.common.naoEncontrado}
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'var(--texto-suave)',
            maxWidth: '420px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}>
            {t.common.naoEncontradoTexto}
          </p>
          <Link href="/" className="btn btn-primary">
            {t.common.voltarInicio}
          </Link>
        </div>
      </section>
    </div>
  )
}
