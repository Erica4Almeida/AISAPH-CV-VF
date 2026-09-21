'use client'
import { useState, type FormEvent, type CSSProperties } from 'react'
import type { Curso, Turma } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

/* ── tipos ──────────────────────────────────────────────────────── */
interface FormState {
  nome: string; data_nascimento: string; documento_id: string; nif: string
  nacionalidade: string; sexo: string; telefone: string; email: string
  endereco: string; profissao: string; instituicao: string
  curso_interesse: string; turma_info: string; modalidade: string
  local_formacao: string; data_inicio_prevista: string; data_fim_prevista: string
  nivel_escolaridade: string; experiencia_aph: string; experiencia_aph_descricao: string
  certificacoes_anteriores: string; certificacoes_anteriores_info: string
  competencias: string[]
  declaracao_condicoes: boolean; declaracao_imagem: boolean; declaracao_normas: boolean
}
type Errors = Partial<Record<keyof FormState, string>>

const INITIAL: FormState = {
  nome: '', data_nascimento: '', documento_id: '', nif: '',
  nacionalidade: '', sexo: '', telefone: '', email: '',
  endereco: '', profissao: '', instituicao: '',
  curso_interesse: '', turma_info: '', modalidade: '',
  local_formacao: '', data_inicio_prevista: '', data_fim_prevista: '',
  nivel_escolaridade: '', experiencia_aph: '', experiencia_aph_descricao: '',
  certificacoes_anteriores: '', certificacoes_anteriores_info: '',
  competencias: [],
  declaracao_condicoes: false, declaracao_imagem: false, declaracao_normas: false,
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STEPS = ['Dados Pessoais', 'Curso', 'Educação', 'Declaração']
const categoriaOrdem: Record<string, number> = { basico: 1, avancado: 2, especializado: 3 }

/* ── estilos base (módulo) ──────────────────────────────────────── */
const sInp: CSSProperties = {
  width: '100%', padding: '10px 14px', border: '2px solid #e0e7ef',
  borderRadius: 'var(--radius,8px)', fontFamily: 'var(--font-corpo)',
  fontSize: '0.95rem', outline: 'none', transition: 'border-color .2s',
  background: '#fff', boxSizing: 'border-box',
}
const sLbl: CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.85rem',
  marginBottom: '6px', color: 'var(--azul)',
}
const sErr: CSSProperties = { color: 'var(--vermelho)', fontSize: '0.8rem', marginTop: '4px' }
const sGrid2: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }
const sSelectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23124E7C' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`
const sSel: CSSProperties = {
  ...sInp, cursor: 'pointer', appearance: 'none',
  backgroundImage: sSelectArrow, backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center', paddingRight: '40px',
}

function borderColor(err?: string) { return err ? 'var(--vermelho)' : '#e0e7ef' }

/* ── sub-componentes (FORA do InscricaoForm para evitar remount) ── */
function Field({ id, label, required, error, children }: {
  id: string; label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} style={sLbl}>
        {label}{required && <span style={{ color: 'var(--vermelho)', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <p style={sErr} role="alert">{error}</p>}
    </div>
  )
}

/* Para grupos de radio/checkbox: usa <p> em vez de <label htmlFor> */
function GroupLabel({ label, required, error }: { label: string; required?: boolean; error?: string }) {
  return (
    <>
      <p style={{ ...sLbl, marginBottom: 8 }}>
        {label}{required && <span style={{ color: 'var(--vermelho)', marginLeft: 2 }}>*</span>}
      </p>
      {error && <p style={sErr} role="alert">{error}</p>}
    </>
  )
}

function Radio({ name, value, label, checked, onChange }: {
  name: string; value: string; label: string; checked: boolean; onChange: () => void
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange}
        style={{ accentColor: 'var(--azul)', width: 16, height: 16 }} />
      {label}
    </label>
  )
}

function Check({ value, label, checked, onChange }: {
  value: string; label: string; checked: boolean; onChange: () => void
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
      <input type="checkbox" value={value} checked={checked} onChange={onChange}
        style={{ accentColor: 'var(--azul)', width: 16, height: 16 }} />
      {label}
    </label>
  )
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i <= step ? 'var(--azul)' : '#e0e7ef',
              color: i <= step ? '#fff' : '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.85rem', transition: 'background .3s',
              border: i === step ? '3px solid var(--vermelho)' : 'none',
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{
              fontSize: '0.72rem', marginTop: 4, textAlign: 'center',
              color: i === step ? 'var(--azul)' : '#94a3b8',
              fontWeight: i === step ? 700 : 400,
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: 4, background: '#e0e7ef', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2, background: 'var(--azul)',
          width: `${(step / (STEPS.length - 1)) * 100}%`,
          transition: 'width .4s ease',
        }} />
      </div>
    </div>
  )
}

function NavBtns({ step, onBack, onNext, isLast, loading }: {
  step: number; onBack: () => void; onNext?: () => void; isLast?: boolean; loading?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'space-between' }}>
      {step > 0 ? (
        <button type="button" onClick={onBack}
          style={{ padding: '12px 28px', borderRadius: 'var(--radius,8px)', border: '2px solid var(--azul)', background: 'transparent', color: 'var(--azul)', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
          ← Anterior
        </button>
      ) : <div />}
      {isLast ? (
        <button type="submit" className="btn btn-primary" disabled={loading}
          style={{ padding: '12px 32px', fontSize: '0.95rem' }}>
          {loading ? 'A enviar...' : 'Enviar Inscrição'}
        </button>
      ) : (
        <button type="button" onClick={onNext} className="btn btn-primary"
          style={{ padding: '12px 32px', fontSize: '0.95rem' }}>
          Próximo →
        </button>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════════════ */
export default function InscricaoForm({
  cursoPreSelecionado,
  turmaPreSelecionada,
  cursos = [],
  turmas = [],
}: {
  cursoPreSelecionado?: string
  turmaPreSelecionada?: string
  cursos?: Curso[]
  turmas?: Turma[]
}) {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>({
    ...INITIAL,
    curso_interesse: cursoPreSelecionado ?? '',
    turma_info: turmaPreSelecionada ?? '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  /* helpers */
  function setField(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(p => ({ ...p, [field]: e.target.value }))
      if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
    }
  }
  function toggleComp(v: string) {
    setForm(p => ({
      ...p,
      competencias: p.competencias.includes(v)
        ? p.competencias.filter(c => c !== v)
        : [...p.competencias, v],
    }))
  }

  /* validação por passo */
  function validateStep(s: number): boolean {
    const e: Errors = {}
    if (s === 0) {
      if (!form.nome.trim())          e.nome = 'Obrigatório'
      if (!form.data_nascimento)      e.data_nascimento = 'Obrigatório'
      if (!form.documento_id.trim())  e.documento_id = 'Obrigatório'
      if (!form.nif.trim())           e.nif = 'Obrigatório'
      if (!form.nacionalidade.trim()) e.nacionalidade = 'Obrigatório'
      if (!form.sexo)                 e.sexo = 'Obrigatório'
      if (!form.telefone.trim())      e.telefone = 'Obrigatório'
      if (!form.email.trim())         e.email = 'Obrigatório'
      else if (!EMAIL_RE.test(form.email)) e.email = 'Email inválido'
      if (!form.endereco.trim())      e.endereco = 'Obrigatório'
    }
    if (s === 1) {
      if (!form.curso_interesse.trim()) e.curso_interesse = 'Obrigatório'
      if (!form.modalidade)             e.modalidade = 'Obrigatório'
    }
    if (s === 2) {
      if (!form.nivel_escolaridade)       e.nivel_escolaridade = 'Obrigatório'
      if (!form.experiencia_aph)          e.experiencia_aph = 'Obrigatório'
      if (!form.certificacoes_anteriores) e.certificacoes_anteriores = 'Obrigatório'
    }
    if (s === 3) {
      if (!form.declaracao_condicoes) e.declaracao_condicoes = 'Obrigatório'
      if (!form.declaracao_imagem)    e.declaracao_imagem = 'Obrigatório'
      if (!form.declaracao_normas)    e.declaracao_normas = 'Obrigatório'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() { if (validateStep(step)) setStep(s => s + 1) }
  function back() { setErrors({}); setStep(s => s - 1) }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateStep(3)) return
    setStatus('loading')
    setServerError('')
    try {
      const payload = {
        ...form,
        competencias: form.competencias.join(', '),
        data_inicio_prevista: form.data_inicio_prevista || null,
        data_fim_prevista: form.data_fim_prevista || null,
      }
      const res = await fetch('/api/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? `Erro ${res.status}`)
      }
      setStatus('success')
    } catch (ex) {
      setServerError(ex instanceof Error ? ex.message : 'Erro ao enviar inscrição')
      setStatus('error')
    }
  }

  /* sucesso */
  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '48px', background: '#d5f5e3', borderRadius: '12px', border: '2px solid #2ecc71' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h3 style={{ color: '#1e8449', fontFamily: 'var(--font-titulo)', marginBottom: '12px' }}>
          Inscrição enviada com sucesso!
        </h3>
        <p style={{ color: '#27ae60' }}>Entraremos em contacto brevemente para confirmar a sua inscrição.</p>
      </div>
    )
  }

  /* dados para step 2 */
  const categorias = (Object.keys(categoriaOrdem) as string[])
    .sort((a, b) => categoriaOrdem[a] - categoriaOrdem[b])
  const grouped = categorias.reduce<Record<string, Curso[]>>((acc, cat) => {
    acc[cat] = cursos.filter(c => c.categoria === cat)
    return acc
  }, {})
  const turmasFiltradas = turmas.filter(tr => tr.curso?.titulo === form.curso_interesse)
  function formatarTurma(turma: Turma): string {
    const inicio = new Date(turma.data_inicio + 'T00:00:00')
    const dataStr = inicio.toLocaleDateString(t.common.dateLocale, { day: '2-digit', month: 'short', year: 'numeric' })
    return turma.local ? `${dataStr} – ${turma.local}` : dataStr
  }

  /* ── render ───────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} noValidate
      style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>

      <h2 style={{ color: 'var(--azul)', marginBottom: '4px', fontFamily: 'var(--font-titulo)' }}>
        Ficha de Inscrição
      </h2>
      <p style={{ color: '#5a6a85', fontSize: '0.85rem', marginBottom: '28px' }}>
        Formação em Atendimento Pré-Hospitalar — AISAPH-CV
      </p>

      <ProgressBar step={step} />

      {/* ── PASSO 1 — DADOS PESSOAIS ──────────────────────────── */}
      {step === 0 && (
        <div style={{ display: 'grid', gap: 16 }}>
          <Field id="nome" label="Nome completo" required error={errors.nome}>
            <input id="nome" type="text" value={form.nome} onChange={setField('nome')}
              style={{ ...sInp, borderColor: borderColor(errors.nome) }} />
          </Field>

          <div style={sGrid2}>
            <Field id="data_nascimento" label="Data de nascimento" required error={errors.data_nascimento}>
              <input id="data_nascimento" type="date" value={form.data_nascimento} onChange={setField('data_nascimento')}
                style={{ ...sInp, borderColor: borderColor(errors.data_nascimento) }} />
            </Field>

            <div>
              <GroupLabel label="Sexo" required error={errors.sexo} />
              <div style={{ display: 'flex', gap: 20, paddingTop: 4 }}>
                <Radio name="sexo" value="feminino" label="Feminino"
                  checked={form.sexo === 'feminino'} onChange={() => { setForm(p => ({ ...p, sexo: 'feminino' })); setErrors(p => ({ ...p, sexo: undefined })) }} />
                <Radio name="sexo" value="masculino" label="Masculino"
                  checked={form.sexo === 'masculino'} onChange={() => { setForm(p => ({ ...p, sexo: 'masculino' })); setErrors(p => ({ ...p, sexo: undefined })) }} />
              </div>
            </div>
          </div>

          <div style={sGrid2}>
            <Field id="documento_id" label="CNI / Passaporte" required error={errors.documento_id}>
              <input id="documento_id" type="text" value={form.documento_id} onChange={setField('documento_id')}
                style={{ ...sInp, borderColor: borderColor(errors.documento_id) }} />
            </Field>
            <Field id="nif" label="NIF" required error={errors.nif}>
              <input id="nif" type="text" value={form.nif} onChange={setField('nif')}
                style={{ ...sInp, borderColor: borderColor(errors.nif) }} />
            </Field>
          </div>

          <div style={sGrid2}>
            <Field id="nacionalidade" label="Nacionalidade" required error={errors.nacionalidade}>
              <input id="nacionalidade" type="text" value={form.nacionalidade} onChange={setField('nacionalidade')}
                style={{ ...sInp, borderColor: borderColor(errors.nacionalidade) }} />
            </Field>
            <Field id="telefone" label="Telefone / WhatsApp" required error={errors.telefone}>
              <input id="telefone" type="tel" placeholder="+238 " value={form.telefone} onChange={setField('telefone')}
                style={{ ...sInp, borderColor: borderColor(errors.telefone) }} />
            </Field>
          </div>

          <Field id="email" label="Email" required error={errors.email}>
            <input id="email" type="email" value={form.email} onChange={setField('email')}
              style={{ ...sInp, borderColor: borderColor(errors.email) }} />
          </Field>

          <Field id="endereco" label="Endereço completo / Referência" required error={errors.endereco}>
            <input id="endereco" type="text" value={form.endereco} onChange={setField('endereco')}
              style={{ ...sInp, borderColor: borderColor(errors.endereco) }} />
          </Field>

          <div style={sGrid2}>
            <Field id="profissao" label="Profissão / Ocupação actual">
              <input id="profissao" type="text" value={form.profissao} onChange={setField('profissao')} style={sInp} />
            </Field>
            <Field id="instituicao" label="Instituição / Organização">
              <input id="instituicao" type="text" value={form.instituicao} onChange={setField('instituicao')} style={sInp} />
            </Field>
          </div>

          <NavBtns step={step} onBack={back} onNext={next} />
        </div>
      )}

      {/* ── PASSO 2 — CURSO ───────────────────────────────────── */}
      {step === 1 && (
        <div style={{ display: 'grid', gap: 16 }}>
          <Field id="curso_interesse" label="Curso pretendido" required error={errors.curso_interesse}>
            {cursos.length > 0 ? (
              <select id="curso_interesse" value={form.curso_interesse}
                onChange={e => { setForm(p => ({ ...p, curso_interesse: e.target.value, turma_info: '' })); setErrors(p => ({ ...p, curso_interesse: undefined })) }}
                style={{ ...sSel, borderColor: borderColor(errors.curso_interesse) }}>
                <option value="">— Selecione um curso —</option>
                {categorias.map(cat => {
                  const items = grouped[cat]
                  if (!items?.length) return null
                  const catLabel = t.cursos.categorias[cat as keyof typeof t.cursos.categorias]
                  return (
                    <optgroup key={cat} label={catLabel}>
                      {items.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
                    </optgroup>
                  )
                })}
              </select>
            ) : (
              <input id="curso_interesse" type="text" placeholder="Nome do curso" value={form.curso_interesse}
                onChange={setField('curso_interesse')}
                style={{ ...sInp, borderColor: borderColor(errors.curso_interesse) }} />
            )}
          </Field>

          {turmasFiltradas.length > 0 && (
            <Field id="turma_info" label="Turma disponível">
              <select id="turma_info" value={form.turma_info} onChange={setField('turma_info')} style={sSel}>
                <option value="">— Selecione uma turma —</option>
                {turmasFiltradas.map(tr => {
                  const label = formatarTurma(tr)
                  return <option key={tr.id} value={label}>{label}</option>
                })}
              </select>
            </Field>
          )}

          <div>
            <GroupLabel label="Modalidade" required error={errors.modalidade} />
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { value: 'presencial', label: 'Presencial' },
                { value: 'semi_presencial', label: 'Semi Presencial' },
                { value: 'online', label: 'Online' },
              ].map(opt => (
                <Radio key={opt.value} name="modalidade" value={opt.value} label={opt.label}
                  checked={form.modalidade === opt.value}
                  onChange={() => { setForm(p => ({ ...p, modalidade: opt.value })); setErrors(p => ({ ...p, modalidade: undefined })) }} />
              ))}
            </div>
          </div>

          <Field id="local_formacao" label="Local da formação">
            <input id="local_formacao" type="text" value={form.local_formacao} onChange={setField('local_formacao')} style={sInp} />
          </Field>

          <div style={sGrid2}>
            <Field id="data_inicio_prevista" label="Data prevista de início">
              <input id="data_inicio_prevista" type="date" value={form.data_inicio_prevista} onChange={setField('data_inicio_prevista')} style={sInp} />
            </Field>
            <Field id="data_fim_prevista" label="Data prevista de término">
              <input id="data_fim_prevista" type="date" value={form.data_fim_prevista} onChange={setField('data_fim_prevista')} style={sInp} />
            </Field>
          </div>

          <NavBtns step={step} onBack={back} onNext={next} />
        </div>
      )}

      {/* ── PASSO 3 — EDUCAÇÃO & COMPETÊNCIAS ─────────────────── */}
      {step === 2 && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <GroupLabel label="Nível de escolaridade actual" required error={errors.nivel_escolaridade} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
              {[
                { value: 'basico', label: 'Ensino Básico' },
                { value: 'secundario', label: 'Ensino Secundário' },
                { value: 'tecnico', label: 'Ensino Técnico / Profissional' },
                { value: 'superior', label: 'Ensino Superior' },
                { value: 'outro', label: 'Outro' },
              ].map(opt => (
                <Radio key={opt.value} name="nivel_escolaridade" value={opt.value} label={opt.label}
                  checked={form.nivel_escolaridade === opt.value}
                  onChange={() => { setForm(p => ({ ...p, nivel_escolaridade: opt.value })); setErrors(p => ({ ...p, nivel_escolaridade: undefined })) }} />
              ))}
            </div>
          </div>

          <div>
            <GroupLabel label="Experiência prévia em APH ou socorrismo?" required error={errors.experiencia_aph} />
            <div style={{ display: 'flex', gap: 24 }}>
              <Radio name="experiencia_aph" value="sim" label="Sim"
                checked={form.experiencia_aph === 'sim'}
                onChange={() => { setForm(p => ({ ...p, experiencia_aph: 'sim' })); setErrors(p => ({ ...p, experiencia_aph: undefined })) }} />
              <Radio name="experiencia_aph" value="nao" label="Não"
                checked={form.experiencia_aph === 'nao'}
                onChange={() => { setForm(p => ({ ...p, experiencia_aph: 'nao', experiencia_aph_descricao: '' })); setErrors(p => ({ ...p, experiencia_aph: undefined })) }} />
            </div>
            {form.experiencia_aph === 'sim' && (
              <div style={{ marginTop: 10 }}>
                <label htmlFor="exp_desc" style={sLbl}>Descreva brevemente:</label>
                <textarea id="exp_desc" rows={2} value={form.experiencia_aph_descricao}
                  onChange={setField('experiencia_aph_descricao')}
                  style={{ ...sInp, resize: 'vertical' }} />
              </div>
            )}
          </div>

          <div>
            <GroupLabel label="Certificações anteriores na área?" required error={errors.certificacoes_anteriores} />
            <div style={{ display: 'flex', gap: 24 }}>
              <Radio name="cert" value="nao" label="Não"
                checked={form.certificacoes_anteriores === 'nao'}
                onChange={() => { setForm(p => ({ ...p, certificacoes_anteriores: 'nao', certificacoes_anteriores_info: '' })); setErrors(p => ({ ...p, certificacoes_anteriores: undefined })) }} />
              <Radio name="cert" value="sim" label="Sim"
                checked={form.certificacoes_anteriores === 'sim'}
                onChange={() => { setForm(p => ({ ...p, certificacoes_anteriores: 'sim' })); setErrors(p => ({ ...p, certificacoes_anteriores: undefined })) }} />
            </div>
            {form.certificacoes_anteriores === 'sim' && (
              <div style={{ marginTop: 10 }}>
                <label htmlFor="cert_info" style={sLbl}>Indique (curso, instituição, ano):</label>
                <input id="cert_info" type="text" value={form.certificacoes_anteriores_info}
                  onChange={setField('certificacoes_anteriores_info')} style={sInp} />
              </div>
            )}
          </div>

          <div>
            <p style={{ ...sLbl, marginBottom: 10 }}>
              Competências em emergência pré-hospitalar: <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
              {['Comunicação clara e eficaz', 'Capacidade de decisão rápida', 'Trabalho em equipa', 'Controlo emocional', 'Conhecimento técnico em SBV'].map(opt => (
                <Check key={opt} value={opt} label={opt}
                  checked={form.competencias.includes(opt)}
                  onChange={() => toggleComp(opt)} />
              ))}
            </div>
          </div>

          <NavBtns step={step} onBack={back} onNext={next} />
        </div>
      )}

      {/* ── PASSO 4 — DECLARAÇÃO ──────────────────────────────── */}
      {step === 3 && (
        <div style={{ display: 'grid', gap: 16 }}>
          <p style={{ color: '#5a6a85', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 8 }}>
            Antes de submeter a sua inscrição, por favor confirme as seguintes declarações:
          </p>

          {([
            { field: 'declaracao_condicoes' as const, label: 'Declaro estar em boas condições físicas e mentais para participar da formação.' },
            { field: 'declaracao_imagem' as const,    label: 'Autorizo o uso da minha imagem para fins pedagógicos e institucionais.' },
            { field: 'declaracao_normas' as const,    label: 'Comprometo-me a cumprir as normas da Academia e participar activamente das actividades.' },
          ]).map(({ field, label }) => (
            <div key={field} style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px', border: `2px solid ${errors[field] ? 'var(--vermelho)' : '#e0e7ef'}` }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1.5 }}>
                <input type="checkbox" checked={form[field]}
                  onChange={e => { setForm(p => ({ ...p, [field]: e.target.checked })); setErrors(p => ({ ...p, [field]: undefined })) }}
                  style={{ accentColor: 'var(--azul)', width: 18, height: 18, marginTop: 2, flexShrink: 0 }} />
                {label}<span style={{ color: 'var(--vermelho)', marginLeft: 2 }}>*</span>
              </label>
              {errors[field] && <p style={{ ...sErr, marginLeft: 30 }}>{errors[field]}</p>}
            </div>
          ))}

          <NavBtns step={step} onBack={back} isLast loading={status === 'loading'} />

          {status === 'error' && (
            <p style={{ color: 'var(--vermelho)', textAlign: 'center' }} role="alert">
              {serverError || 'Erro ao enviar. Tente novamente.'}
            </p>
          )}
        </div>
      )}
    </form>
  )
}
