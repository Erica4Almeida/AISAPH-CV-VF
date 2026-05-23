import { NextRequest, NextResponse } from 'next/server'
import { criarProposta } from '@/services/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await criarProposta(body)
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar proposta'
    console.error('[POST /api/propostas]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
