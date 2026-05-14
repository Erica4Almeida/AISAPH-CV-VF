'use client'
import { useState, type FormEvent } from 'react'
import type { Curso, Turma } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface FormState {
  nome: string
  email: string
  telefone: string
  curso_interesse: string
  turma_info: string
  mensagem: string
}

interface FieldErrors {
  nome?: string
  email?: string
  telefone?: string
  curso_interesse?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\+\-\(\)]{7,20}$/

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 'var(--radius, 8px)',
  fontFamily: 'var(--font-corpo)',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  border: '2px solid #e0e7ef',
  background: '#fff',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-titulo)',
  fontWeight: 600,
  fontSize: '0.9rem',
  marginBottom: '8px',
  color: 'var(--azul)',
}

const errorStyle: React.CSSProperties = {
  color: 'var(--vermelho)',
  fontSize: '0.82rem',
  marginTop: '6px',
}

const categoriaOrdem: Record<string, number> = {
  basico: 1, avancado: 2, especializado: 3,
}

function formatarTurma(turma: Turma, dateLocale: string): string {
  const inicio = new Date(turma.data_inicio + 'T00:00:00')
  const dataStr = inicio.toLocaleDateString(dateLocale, { day: '2-digit', month: 'short', year: 'numeric' })
  return turma.local ? `${dataStr} – ${turma.local}` : dataStr
}

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

  const [form, setForm] = useState<FormState>({
    nome: '',
    email: '',
    telefone: '',
    curso_interesse: cursoPreSelecionado ?? '',
    turma_info: turmaPreSelecionada ?? '',
    mensagem: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  function validate(form: FormState): FieldErrors {
    const errors: FieldErrors = {}
    if (!form.nome.trim())
      errors.nome = t.forms.validNome
    if (!form.email.trim())
      errors.email = t.forms.validEmail
    else if (!EMAIL_RE.test(form.email))
      errors.email = t.forms.validEmailFormat
    if (!form.telefone.trim())
      errors.telefone = t.forms.validTelefone
    else if (!PHONE_RE.test(form.telefone))
      errors.telefone = t.forms.validTelefoneFormat
    if (!form.curso_interesse.trim())
      errors.curso_interesse = t.forms.validCurso
    return errors
  }

  function setField(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      if (fieldErrors[field as keyof FieldErrors]) {
        setFieldErrors(prev => ({ ...prev, [field]: undefined }))
      }
    }
  }

  function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError?: string) {
    e.target.style.borderColor = hasError ? 'var(--vermelho)' : 'var(--azul)'
  }

  function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError?: string) {
    e.target.style.borderColor = hasError ? 'var(--vermelho)' : '#e0e7ef'
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setStatus('loading')
    setServerError('')
    try {
      const res = await fetch('/api/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? `Erro ${res.status}`)
      }
      setStatus('success')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t.forms.erroEnvio)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        textAlign: 'center', padding: '48px',
        background: '#d5f5e3', borderRadius: '12px',
        border: '2px solid #2ecc71',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h3 style={{ color: '#1e8449', fontFamily: 'var(--font-titulo)', marginBottom: '12px' }}>
          {t.forms.sucessoTitulo}
        </h3>
        <p style={{ color: '#27ae60' }}>{t.forms.sucessoTexto}</p>
      </div>
    )
  }

  const categorias = Object.keys(categoriaOrdem).sort(
    (a, b) => categoriaOrdem[a] - categoriaOrdem[b],
  ) as (keyof typeof categoriaOrdem)[]

  const grouped = categorias.reduce<Record<string, Curso[]>>((acc, cat) => {
    acc[cat] = cursos.filter(c => c.categoria === cat)
    return acc
  }, {})

  const hasCursos = cursos.length > 0

  const turmasFiltradas = turmas.filter(
    tr => tr.curso?.titulo === form.curso_interesse,
  )

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        background: '#fff',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h2 style={{ color: 'var(--azul)', marginBottom: '32px', fontFamily: 'var(--font-titulo)' }}>
        {t.forms.reservar}
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="nome" style={labelStyle}>{t.forms.nome}</label>
        <input
          id="nome"
          name="nome"
          type="text"
          value={form.nome}
          onChange={setField('nome')}
          onFocus={e => focusBorder(e, fieldErrors.nome)}
          onBlur={e => blurBorder(e, fieldErrors.nome)}
          style={{ ...inputBase, borderColor: fieldErrors.nome ? 'var(--vermelho)' : '#e0e7ef' }}
        />
        {fieldErrors.nome && <p style={errorStyle} role="alert">{fieldErrors.nome}</p>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="email" style={labelStyle}>{t.forms.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={setField('email')}
          onFocus={e => focusBorder(e, fieldErrors.email)}
          onBlur={e => blurBorder(e, fieldErrors.email)}
          style={{ ...inputBase, borderColor: fieldErrors.email ? 'var(--vermelho)' : '#e0e7ef' }}
        />
        {fieldErrors.email && <p style={errorStyle} role="alert">{fieldErrors.email}</p>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="telefone" style={labelStyle}>{t.forms.telefone}</label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          value={form.telefone}
          onChange={setField('telefone')}
          onFocus={e => focusBorder(e, fieldErrors.telefone)}
          onBlur={e => blurBorder(e, fieldErrors.telefone)}
          style={{ ...inputBase, borderColor: fieldErrors.telefone ? 'var(--vermelho)' : '#e0e7ef' }}
        />
        {fieldErrors.telefone && <p style={errorStyle} role="alert">{fieldErrors.telefone}</p>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="curso_interesse" style={labelStyle}>{t.forms.cursoInteresse}</label>
        {hasCursos ? (
          <select
            id="curso_interesse"
            name="curso_interesse"
            value={form.curso_interesse}
            onChange={e => {
              setForm(prev => ({ ...prev, curso_interesse: e.target.value, turma_info: '' }))
              if (fieldErrors.curso_interesse) setFieldErrors(prev => ({ ...prev, curso_interesse: undefined }))
            }}
            onFocus={e => focusBorder(e, fieldErrors.curso_interesse)}
            onBlur={e => blurBorder(e, fieldErrors.curso_interesse)}
            style={{
              ...inputBase,
              borderColor: fieldErrors.curso_interesse ? 'var(--vermelho)' : '#e0e7ef',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23124E7C' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              paddingRight: '44px',
            }}
          >
            <option value="">{t.forms.selecione}</option>
            {categorias.map(cat => {
              const items = grouped[cat]
              if (!items || items.length === 0) return null
              const catLabel = t.cursos.categorias[cat as keyof typeof t.cursos.categorias]
              return (
                <optgroup key={cat} label={catLabel}>
                  {items.map(c => (
                    <option key={c.id} value={c.titulo}>
                      {c.titulo}
                    </option>
                  ))}
                </optgroup>
              )
            })}
          </select>
        ) : (
          <input
            id="curso_interesse"
            name="curso_interesse"
            type="text"
            placeholder={t.forms.cursoPlaceholder}
            value={form.curso_interesse}
            onChange={setField('curso_interesse')}
            onFocus={e => focusBorder(e, fieldErrors.curso_interesse)}
            onBlur={e => blurBorder(e, fieldErrors.curso_interesse)}
            style={{ ...inputBase, borderColor: fieldErrors.curso_interesse ? 'var(--vermelho)' : '#e0e7ef' }}
          />
        )}
        {fieldErrors.curso_interesse && (
          <p style={errorStyle} role="alert">{fieldErrors.curso_interesse}</p>
        )}
      </div>

      {turmasFiltradas.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="turma_info" style={labelStyle}>{t.forms.turmaLabel}</label>
          <select
            id="turma_info"
            name="turma_info"
            value={form.turma_info}
            onChange={setField('turma_info')}
            onFocus={e => focusBorder(e)}
            onBlur={e => blurBorder(e)}
            style={{
              ...inputBase,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23124E7C' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              paddingRight: '44px',
            }}
          >
            <option value="">{t.forms.turmaSelecione}</option>
            {turmasFiltradas.map(tr => {
              const label = formatarTurma(tr, t.common.dateLocale)
              return (
                <option key={tr.id} value={label}>{label}</option>
              )
            })}
          </select>
        </div>
      )}

      <div style={{ marginBottom: '28px' }}>
        <label htmlFor="mensagem" style={labelStyle}>{t.forms.mensagem}</label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          value={form.mensagem}
          onChange={setField('mensagem')}
          onFocus={e => focusBorder(e)}
          onBlur={e => blurBorder(e)}
          style={{ ...inputBase, resize: 'vertical' }}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === 'loading'}
        style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px' }}
      >
        {status === 'loading' ? t.forms.enviando : t.forms.reservar}
      </button>

      {status === 'error' && (
        <p style={{ color: 'var(--vermelho)', marginTop: '16px', textAlign: 'center' }} role="alert">
          {serverError || t.forms.erroEnvio}
        </p>
      )}
    </form>
  )
}
