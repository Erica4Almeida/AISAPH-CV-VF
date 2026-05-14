'use client'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function InCompanyForm() {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    empresa: '',
    nome_contato: '',
    email: '',
    telefone: '',
    numero_participantes: '',
    descricao: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/propostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          numero_participantes: Number(form.numero_participantes) || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `Erro ${res.status}`)
      }
      setStatus('success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.inCompany.erro
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  if (status === 'success') return (
    <div className="inco-form-success">
      <div className="inco-form-success-icon">✅</div>
      <h3 className="inco-form-success-title">{t.inCompany.sucessoTitulo}</h3>
      <p className="inco-form-success-text">{t.inCompany.sucessoTexto}</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="inco-form">
      <div className="inco-form-grid">
        {[
          { name: 'empresa',      label: t.inCompany.empresa,      type: 'text'  },
          { name: 'nome_contato', label: t.inCompany.nomeContato,  type: 'text'  },
          { name: 'email',        label: t.forms.email,            type: 'email' },
          { name: 'telefone',     label: t.inCompany.telefoneForm, type: 'tel'   },
        ].map(f => (
          <div key={f.name}>
            <label htmlFor={f.name} className="form-label">{f.label}</label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              required
              value={(form as any)[f.name]}
              onChange={set(f.name)}
              className="form-input"
            />
          </div>
        ))}
      </div>

      <div className="inco-form-row">
        <label htmlFor="numero_participantes" className="form-label">{t.inCompany.numParticipantes}</label>
        <input
          id="numero_participantes"
          name="numero_participantes"
          type="number"
          min="1"
          value={form.numero_participantes}
          onChange={set('numero_participantes')}
          className="form-input"
        />
      </div>

      <div className="inco-form-row-mb">
        <label htmlFor="descricao" className="form-label">{t.inCompany.necessidades}</label>
        <textarea
          id="descricao"
          name="descricao"
          required
          rows={5}
          value={form.descricao}
          onChange={set('descricao')}
          placeholder={t.inCompany.necessidadesPlaceholder}
          className="form-input form-textarea"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="form-submit"
      >
        {status === 'loading' ? t.forms.enviando : t.inCompany.enviar}
      </button>

      {status === 'error' && (
        <p className="form-error">{errorMsg || t.inCompany.erro}</p>
      )}
    </form>
  )
}
