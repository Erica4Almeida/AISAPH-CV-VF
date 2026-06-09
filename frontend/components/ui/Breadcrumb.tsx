import Link from 'next/link'

interface Item {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: Item[] }) {
  return (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      {items.map((item, i) => (
        <span key={i} className="breadcrumb-nav-item">
          {i > 0 && <span className="breadcrumb-nav-sep">/</span>}
          {item.href
            ? <Link href={item.href} className="breadcrumb-link">{item.label}</Link>
            : <span className="breadcrumb-nav-current">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}
