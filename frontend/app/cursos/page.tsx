'use client'
import { useEffect, useState } from 'react'
import CourseCard from '@/components/cursos/CourseCard'
import { CourseCardSkeleton } from '@/components/ui/Skeleton'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Curso, CursoCategoria } from '@/types'

type Filtro = CursoCategoria | ''

export default function CursosPage() {
  const { t } = useLanguage()
  const [cursos, setCursos]     = useState<Curso[]>([])
  const [filtro, setFiltro]     = useState<Filtro>('')
  const [pesquisa, setPesquisa] = useState('')
  const [visiveis, setVisiveis] = useState(12)
  const [status, setStatus]     = useState<'loading' | 'ok' | 'error'>('loading')

  const cursosFiltrados = cursos.filter(c =>
    pesquisa === '' || c.titulo.toLowerCase().includes(pesquisa.toLowerCase())
  )
  const cursosVisiveis = cursosFiltrados.slice(0, visiveis)
  const temMais = cursosFiltrados.length > visiveis

  const FILTROS: { value: Filtro; label: string }[] = [
    { value: '',              label: t.cursos.todos                   },
    { value: 'basico',        label: t.cursos.categorias.basico       },
    { value: 'avancado',      label: t.cursos.categorias.avancado     },
    { value: 'especializado', label: t.cursos.categorias.especializado },
  ]

  useEffect(() => {
    setStatus('loading')
    setVisiveis(12)
    const url = filtro
      ? `/api/cursos?destaque=false&categoria=${filtro}`
      : '/api/cursos?destaque=false'
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status}`)
        return res.json() as Promise<Curso[]>
      })
      .then(data => { setCursos(data); setStatus('ok') })
      .catch(() => setStatus('error'))
  }, [filtro])

  useEffect(() => { setVisiveis(12) }, [pesquisa])

  return (
    <div className="cursos-page">
      <section className="cursos-hero">
        <div className="container cursos-hero-container">
          <p className="cursos-hero-tag">{t.cursos.formacoes}</p>
          <h1 className="cursos-hero-h1">{t.cursos.cursosFormacoes}</h1>
          <p className="cursos-hero-subtitle">{t.cursos.heroSubtitulo}</p>
        </div>

        <div className="cursos-pesquisa-wrap">
          <input
            id="pesquisa-cursos"
            name="pesquisa"
            type="search"
            placeholder={t.cursos.pesquisar}
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            className="cursos-pesquisa-input"
          />
        </div>

        <div className="filtros-container">
          {FILTROS.map(f => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={`cursos-filtro-btn${filtro === f.value ? ' active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {status === 'error' && (
            <div className="cursos-error">
              <p>{t.cursos.loadError}</p>
              <button onClick={() => setFiltro(f => f)} className="cursos-error-btn">
                {t.cursos.tenteNovamente}
              </button>
            </div>
          )}

          {status !== 'error' && (
            <div className="cursos-resultado-grid">
              {status === 'loading'
                ? Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)
                : cursosFiltrados.length > 0
                  ? cursosVisiveis.map((c, i) => <CourseCard key={c.id} curso={c} priority={i < 3} />)
                  : <div className="cursos-empty">{t.common.nenhumCurso}</div>
              }
            </div>
          )}

          {status === 'ok' && temMais && (
            <div className="cursos-carregar-wrap">
              <button onClick={() => setVisiveis(v => v + 12)} className="cursos-carregar-btn">
                {t.cursos.carregarMais} ({cursosFiltrados.length - visiveis})
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
