import type {
  Curso,
  CursoCategoria,
  Depoimento,
  Diferencial,
  Etapa,
  Configuracao,
  Setor,
  Turma,
  Parceiro,
  Faq,
  Sobre,
  Hero,
  GaleriaFoto,
  Noticia,
  InscricaoPayload,
  PropostaPayload,
} from '@/types'

const BASE_URL = process.env.STRAPI_INTERNAL_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'
const API_TOKEN = process.env.STRAPI_API_TOKEN ?? ''

function buildHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  }
}

async function getLocale(): Promise<string> {
  try {
    const { cookies } = await import('next/headers')
    const store = await cookies()
    const val = store.get('aisaph-locale')?.value ?? ''
    return ['en', 'fr', 'es'].includes(val) ? val : 'pt'
  } catch {
    return 'pt'
  }
}

async function fetchOnce<T>(
  path: string,
  params: Record<string, string>,
  fallback: T,
  revalidate = 300,
): Promise<{ ok: boolean; data: T }> {
  const url = new URL(`${BASE_URL}/api${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url.toString(), {
      headers: buildHeaders(),
      next: { revalidate },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return { ok: false, data: fallback }
    return { ok: true, data: await res.json() as T }
  } catch {
    clearTimeout(timer)
    return { ok: false, data: fallback }
  }
}

async function get<T>(
  path: string,
  params: Record<string, string> = {},
  fallback: T,
  options?: { noLocale?: boolean; revalidate?: number },
): Promise<T> {
  const locale = options?.noLocale ? 'pt' : await getLocale()
  const revalidate = options?.revalidate ?? 300

  if (locale !== 'pt') {
    const result = await fetchOnce<T>(path, { ...params, locale }, fallback, revalidate)
    if (result.ok) {
      // Strapi devolve 200 com array vazio quando não existe tradução nesse locale
      const d = result.data as { data?: unknown[] } | unknown
      const isEmpty = d !== null && typeof d === 'object' && 'data' in (d as object)
        && Array.isArray((d as { data: unknown[] }).data)
        && (d as { data: unknown[] }).data.length === 0
      if (!isEmpty) return result.data
    }
  }

  const result = await fetchOnce<T>(path, params, fallback, revalidate)
  return result.data
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ data: body }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST ${path} → ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

export async function getCursos(categoria?: CursoCategoria | '', destaque?: boolean): Promise<Curso[]> {
  const params: Record<string, string> = { populate: 'imagem', sort: 'titulo:asc', 'pagination[limit]': '500' }
  if (categoria) params['filters[categoria][$eq]'] = categoria
  if (destaque !== undefined) params['filters[destaque][$eq]'] = String(destaque)
  const res = await get<{ data: Curso[] }>('/cursos', params, { data: [] })
  return res.data
}

export async function getCursosDestaque(): Promise<Curso[]> {
  const res = await get<{ data: Curso[] }>(
    '/cursos',
    { 'filters[destaque][$eq]': 'true', populate: 'imagem', 'pagination[limit]': '3' },
    { data: [] },
  )
  return res.data
}

export async function getCursoBySlug(slug: string): Promise<Curso | null> {
  const res = await get<{ data: Curso[] }>(
    '/cursos',
    { 'filters[slug][$eq]': slug, populate: 'imagem' },
    { data: [] },
  )
  return res.data[0] ?? null
}

export async function getDepoimentos(): Promise<Depoimento[]> {
  const res = await get<{ data: Depoimento[] }>(
    '/depoimentos',
    {
      populate: 'foto',
      'filters[destaque][$eq]': 'true',
      'pagination[limit]': '25',
      sort: 'ordem:asc',
    },
    { data: [] },
    { noLocale: true },
  )
  return res.data
}

export async function getTurmas(): Promise<Turma[]> {
  const today = new Date().toISOString().split('T')[0]
  const res = await get<{ data: Turma[] }>(
    '/turmas',
    {
      'populate[curso][fields][0]': 'titulo',
      'populate[curso][fields][1]': 'slug',
      'filters[data_inicio][$gte]': today,
      sort: 'data_inicio:asc',
    },
    { data: [] },
    { noLocale: true },
  )
  return res.data
}

export async function getParceiros(): Promise<Parceiro[]> {
  const res = await get<{ data: Parceiro[] }>(
    '/parceiros',
    { populate: 'logo', sort: 'ordem:asc' },
    { data: [] },
    { noLocale: true },
  )
  return res.data
}

export async function getFaqs(): Promise<Faq[]> {
  const res = await get<{ data: Faq[] }>('/faqs', { sort: 'ordem:asc' }, { data: [] })
  return res.data
}

export async function getSobre(): Promise<Sobre | null> {
  const res = await get<{ data: Sobre | null }>('/sobre', {}, { data: null })
  return res.data
}

export async function getHero(): Promise<Hero | null> {
  const res = await get<{ data: Hero | null }>('/hero', {}, { data: null })
  return res.data
}

export async function getDiferenciais(): Promise<Diferencial[]> {
  const res = await get<{ data: Diferencial[] }>(
    '/diferenciais',
    { sort: 'ordem:asc' },
    { data: [] },
  )
  return res.data
}

export async function getSetores(): Promise<Setor[]> {
  const res = await get<{ data: Setor[] }>(
    '/setores',
    { sort: 'ordem:asc' },
    { data: [] },
  )
  return res.data
}

export async function getEtapas(): Promise<Etapa[]> {
  const res = await get<{ data: Etapa[] }>(
    '/etapas',
    { sort: 'ordem:asc' },
    { data: [] },
  )
  return res.data
}

export async function getConfiguracao(): Promise<Configuracao | null> {
  const res = await get<{ data: Configuracao | null }>('/configuracao', {}, { data: null })
  return res.data
}

interface PaginaLegal { conteudo: string; data_atualizacao?: string }

export async function getPoliticaUtilizacao(): Promise<PaginaLegal | null> {
  const res = await get<{ data: PaginaLegal | null }>('/politica-utilizacao', {}, { data: null })
  return res.data
}

export async function getTermosCondicoes(): Promise<PaginaLegal | null> {
  const res = await get<{ data: PaginaLegal | null }>('/termos-condicoe', {}, { data: null })
  return res.data
}

export async function getProtecaoDados(): Promise<PaginaLegal | null> {
  const res = await get<{ data: PaginaLegal | null }>('/protecao-dado', {}, { data: null })
  return res.data
}

export async function getGaleriaFotos(): Promise<GaleriaFoto[]> {
  const res = await get<{ data: GaleriaFoto[] }>(
    '/galeria-fotos',
    { populate: '*', sort: 'createdAt:asc', 'pagination[limit]': '100' },
    { data: [] },
    { noLocale: true },
  )
  return res.data
}

export async function getNoticias(destaque?: boolean): Promise<Noticia[]> {
  const params: Record<string, string> = {
    populate: 'imagem',
    sort: 'data_publicacao:desc',
    'pagination[limit]': '50',
  }
  if (destaque !== undefined) params['filters[destaque][$eq]'] = String(destaque)
  const res = await get<{ data: Noticia[] }>('/noticias', params, { data: [] }, { noLocale: true, revalidate: 60 })
  return res.data
}

export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const res = await get<{ data: Noticia[] }>(
    '/noticias',
    { 'filters[slug][$eq]': slug, populate: '*' },
    { data: [] },
    { noLocale: true },
  )
  return res.data[0] ?? null
}

export async function criarInscricao(payload: InscricaoPayload): Promise<unknown> {
  return post('/inscricoes', payload)
}

export async function criarProposta(payload: PropostaPayload): Promise<unknown> {
  return post('/propostas', payload)
}
