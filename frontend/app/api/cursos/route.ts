import { NextRequest, NextResponse } from 'next/server'
import { getCursos } from '@/services/api'
import type { CursoCategoria } from '@/types'

const VALID: CursoCategoria[] = ['basico', 'avancado', 'especializado']

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('categoria')
  const categoria = VALID.includes(raw as CursoCategoria) ? (raw as CursoCategoria) : undefined

  const destaqueParam = req.nextUrl.searchParams.get('destaque')
  const destaque = destaqueParam === 'true' ? true : destaqueParam === 'false' ? false : undefined

  try {
    const cursos = await getCursos(categoria, destaque)
    return NextResponse.json(cursos)
  } catch {
    return NextResponse.json({ error: 'Não foi possível carregar os cursos' }, { status: 500 })
  }
}
