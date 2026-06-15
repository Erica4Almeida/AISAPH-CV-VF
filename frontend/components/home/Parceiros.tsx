'use client'
import Image from 'next/image'
import type { Parceiro } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

export default function Parceiros({ parceiros }: { parceiros: Parceiro[] }) {
  const { t } = useLanguage()
  if (!parceiros || parceiros.length === 0) return null

  return (
    <section className="parceiros-section">
      <p className="parceiros-tag">{t.home.parceirosTag}</p>
      <div className="parceiros-lista">
        {parceiros.map((p) => (
          <div key={p.id} className="parceiro-item">
            {p.logo
              ? (
                <a href={p.site_url ?? '#'} target="_blank" rel="noopener noreferrer"
                  className="parceiro-logo-link"
                >
                  <Image
                    src={`${STRAPI_URL}${p.logo.url}`}
                    alt={p.logo.alternativeText || p.nome}
                    width={120} height={40}
                    style={{ objectFit: 'contain', filter: 'grayscale(100%)' }}
                    priority
                  />
                </a>
              )
              : <NomeTag nome={p.nome} href={p.site_url} />
            }
          </div>
        ))}
      </div>
    </section>
  )
}

function NomeTag({ nome, href }: { nome: string; href?: string }) {
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className="parceiro-nome">{nome}</a>
    : <span className="parceiro-nome">{nome}</span>
}
