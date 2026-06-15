'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const LONG_PAGES = ['/noticias/', '/cursos/']

export default function ScrollProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)

  const isLongPage = LONG_PAGES.some(p => pathname.startsWith(p))

  useEffect(() => {
    if (!isLongPage) { setProgress(0); return }

    function update() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [pathname, isLongPage])

  if (!isLongPage || progress <= 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '3px',
      width: `${progress}%`,
      background: 'var(--azul)',
      zIndex: 99998,
      transition: 'width 0.1s linear',
      pointerEvents: 'none',
    }} />
  )
}
