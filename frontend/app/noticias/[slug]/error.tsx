'use client'
import Link from 'next/link'

export default function NoticiaError() {
  return (
    <div style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--azul)', marginBottom: '16px' }}>Notícia não disponível</h1>
      <p style={{ color: '#5a6a85', marginBottom: '32px' }}>
        Não foi possível carregar esta notícia. Tente novamente ou veja todas as notícias.
      </p>
      <Link href="/noticias" className="btn btn-primary">Ver todas as notícias</Link>
    </div>
  )
}
