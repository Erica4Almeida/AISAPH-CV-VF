import { NextRequest, NextResponse } from 'next/server'
import { criarInscricao } from '@/services/api'
import { enviarEmailInscricao } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await criarInscricao(body)

    // Envia email em background — não bloqueia a resposta ao utilizador
    enviarEmailInscricao(body).catch(err =>
      console.error('[EMAIL inscricao]', err instanceof Error ? err.message : err)
    )

    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar inscrição'
    console.error('[POST /api/inscricoes]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
