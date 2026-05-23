import { NextRequest, NextResponse } from 'next/server'
import { criarInscricao } from '@/services/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await criarInscricao(body)
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar inscrição'
    console.error('[POST /api/inscricoes]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
