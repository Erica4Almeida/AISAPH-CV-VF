import { NextRequest, NextResponse } from 'next/server'
import { criarInscricao } from '@/services/api'
import { enviarEmailInscricao, enviarEmailConfirmacao } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await criarInscricao(body)

    // DEBUG TEMPORÁRIO — expõe erros de email na resposta
    const emailErrors: Record<string, string> = {}
    try { await enviarEmailInscricao(body) } catch (err) {
      emailErrors.inscricao = err instanceof Error ? `${err.message}\n${err.stack}` : String(err)
    }
    try { await enviarEmailConfirmacao(body) } catch (err) {
      emailErrors.confirmacao = err instanceof Error ? `${err.message}\n${err.stack}` : String(err)
    }

    return NextResponse.json({ result, _emailErrors: emailErrors }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao processar inscrição'
    console.error('[POST /api/inscricoes]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
