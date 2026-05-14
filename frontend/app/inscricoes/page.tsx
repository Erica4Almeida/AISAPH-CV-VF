import type { Metadata } from 'next'
import { getTurmas, getCursos } from '@/services/api'
import { getT } from '@/lib/getT'
import type { Turma } from '@/types'
import InscricaoForm from './InscricaoForm'

export const metadata: Metadata = {
  title: 'Calendário & Inscrições',
  description: 'Reserve a sua vaga nas próximas turmas da AISAPH-CV e obtenha certificação reconhecida.',
  openGraph: {
    title: 'Calendário & Inscrições | AISAPH-CV',
    description: 'Reserve a sua vaga nas próximas turmas da AISAPH-CV.',
  },
}

function formatarData(iso: string, dateLocale: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(dateLocale, {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export default async function InscricoesPage({
  searchParams,
}: {
  searchParams: Promise<{ curso?: string; turma?: string }>
}) {
  const { curso: cursoParam, turma: turmaParam } = await searchParams
  const [turmas, cursos, t] = await Promise.all([getTurmas(), getCursos('', false), getT()])

  const turmaPreSelecionada = turmaParam
    ? turmas.find(t => String(t.id) === turmaParam)
    : undefined

  function formatarTurmaStr(turma: Turma): string {
    const inicio = new Date(turma.data_inicio + 'T00:00:00')
    const dataStr = inicio.toLocaleDateString(t.common.dateLocale, { day: '2-digit', month: 'short', year: 'numeric' })
    return turma.local ? `${dataStr} – ${turma.local}` : dataStr
  }

  function TurmaCard({ turma }: { turma: Turma }) {
    const inicio = new Date(turma.data_inicio + 'T00:00:00')
    const mes = inicio.toLocaleDateString(t.common.dateLocale, { month: 'short' }).toUpperCase()
    const dia = inicio.getDate()

    return (
      <div className="turma-card">
        <div className="turma-data-box">
          <div className="turma-data-mes">{mes}</div>
          <div className="turma-data-dia">{dia}</div>
        </div>

        <div className="turma-info">
          <h3 className="turma-titulo-text">{turma.curso?.titulo ?? 'Curso'}</h3>
          <div className="turma-meta">
            <span>📅 {formatarData(turma.data_inicio, t.common.dateLocale)}{turma.data_fim ? ` → ${formatarData(turma.data_fim, t.common.dateLocale)}` : ''}</span>
            {turma.local && <span>📍 {turma.local}</span>}
            {turma.vagas_disponiveis != null && (
              <span style={{ color: turma.vagas_disponiveis <= 5 ? 'var(--vermelho)' : 'inherit' }}>
                🪑 {turma.vagas_disponiveis} {t.inscricoes.vagasDisponiveis}
              </span>
            )}
          </div>
        </div>

        <a href={`?curso=${encodeURIComponent(turma.curso?.titulo ?? '')}&turma=${turma.id}#inscricao`} className="turma-btn">
          {t.inscricoes.inscrever}
        </a>
      </div>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-hero-h1">{t.inscricoes.titulo}</h1>
          <p className="page-hero-subtitle">{t.inscricoes.subtitulo}</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--cinza-claro)' }}>
        <div className="container">
          <div className="insc-turmas-header">
            <p className="section-tag-red">{t.inscricoes.proximasTurmas}</p>
            <h2 className="section-h2">{t.inscricoes.datas}</h2>
          </div>

          {turmas.length === 0 ? (
            <div className="insc-empty">
              <div className="insc-empty-icon">📅</div>
              <p>{t.inscricoes.semTurmas}</p>
            </div>
          ) : (
            <div className="insc-turmas-lista">
              {turmas.map(turma => <TurmaCard key={turma.id} turma={turma} />)}
            </div>
          )}
        </div>
      </section>

      <section className="section" id="inscricao">
        <div className="container" style={{ maxWidth: '680px' }}>
          <InscricaoForm
            cursos={cursos}
            turmas={turmas}
            cursoPreSelecionado={cursoParam}
            turmaPreSelecionada={turmaPreSelecionada ? formatarTurmaStr(turmaPreSelecionada) : undefined}
          />
        </div>
      </section>
    </>
  )
}
