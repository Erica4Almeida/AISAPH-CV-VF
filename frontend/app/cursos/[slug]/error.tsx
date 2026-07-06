'use client'
import Link from 'next/link'

export default function CursoError() {
  return (
    <div style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--azul)', marginBottom: '16px' }}>Curso não disponível</h1>
      <p style={{ color: '#5a6a85', marginBottom: '32px' }}>
        Não foi possível carregar este curso. Tente novamente ou veja todos os cursos disponíveis.
      </p>
      <Link href="/cursos" className="btn btn-primary">Ver todos os cursos</Link>
    </div>
  )
}
