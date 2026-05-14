'use client'
import Link from 'next/link'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{
      paddingTop: '68px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      textAlign: 'center',
      padding: '68px 5% 80px',
    }}>
      <p style={{
        fontFamily: 'var(--font-titulo)',
        fontSize: '0.75rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'var(--vermelho)',
      }}>
        Erro
      </p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--azul)' }}>
        Algo correu mal
      </h1>
      <p style={{ color: 'var(--texto-suave)', maxWidth: '480px', lineHeight: 1.7 }}>
        Não foi possível carregar esta página. O servidor pode estar temporariamente indisponível.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
        <button onClick={reset} className="btn btn-primary">
          Tentar novamente
        </button>
        <Link href="/" className="btn btn-outline">
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
