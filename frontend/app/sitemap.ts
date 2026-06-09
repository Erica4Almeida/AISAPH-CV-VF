import type { MetadataRoute } from 'next'
import { getCursos, getNoticias } from '@/services/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aisaph.com'

const staticRoutes = [
  { url: '/',                    priority: 1.0,  changeFrequency: 'weekly'  },
  { url: '/cursos',              priority: 0.9,  changeFrequency: 'weekly'  },
  { url: '/sobre',               priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/inscricoes',          priority: 0.8,  changeFrequency: 'weekly'  },
  { url: '/in-company',          priority: 0.7,  changeFrequency: 'monthly' },
  { url: '/contato',             priority: 0.7,  changeFrequency: 'monthly' },
  { url: '/galeria',             priority: 0.6,  changeFrequency: 'weekly'  },
  { url: '/noticias',            priority: 0.7,  changeFrequency: 'weekly'  },
  { url: '/faq',                 priority: 0.6,  changeFrequency: 'monthly' },
  { url: '/politica-utilizacao', priority: 0.3,  changeFrequency: 'yearly'  },
  { url: '/termos-condicoes',    priority: 0.3,  changeFrequency: 'yearly'  },
  { url: '/protecao-dados',      priority: 0.3,  changeFrequency: 'yearly'  },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cursos, noticias] = await Promise.all([
    getCursos('', false).catch(() => []),
    getNoticias().catch(() => []),
  ])

  const cursoRoutes: MetadataRoute.Sitemap = cursos
    .filter(c => c.slug)
    .map(c => ({
      url: `${SITE_URL}/cursos/${c.slug}`,
      priority: 0.85,
      changeFrequency: 'monthly' as const,
    }))

  const noticiaRoutes: MetadataRoute.Sitemap = noticias
    .filter(n => n.slug)
    .map(n => ({
      url: `${SITE_URL}/noticias/${n.slug}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    }))

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(r => ({
    url: `${SITE_URL}${r.url}`,
    priority: r.priority,
    changeFrequency: r.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
  }))

  return [...staticEntries, ...cursoRoutes, ...noticiaRoutes]
}
