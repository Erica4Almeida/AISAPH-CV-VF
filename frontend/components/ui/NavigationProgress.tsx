'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

function complete(setWidth: (n: number) => void, setVisible: (b: boolean) => void) {
  setWidth(100)
  setTimeout(() => { setVisible(false); setWidth(0) }, 350)
}

export default function NavigationProgress() {
  const pathname = usePathname()
  const [width, setWidth]     = useState(0)
  const [visible, setVisible] = useState(false)
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = () => { if (fallback.current) clearTimeout(fallback.current) }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest('a')
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return

      const target = href.split('?')[0].split('#')[0]

      // Se já estamos nessa página, não mostrar barra
      if (target === pathname) return

      clear()
      setVisible(true)
      setWidth(0)
      requestAnimationFrame(() => setWidth(70))

      // Fallback: forçar conclusão após 4s se a navegação não terminar
      fallback.current = setTimeout(() => complete(setWidth, setVisible), 4000)
    }
    document.addEventListener('click', handleClick)
    return () => { document.removeEventListener('click', handleClick); clear() }
  }, [pathname])

  // Quando pathname muda = navegação concluída
  useEffect(() => {
    if (!visible) return
    clear()
    complete(setWidth, setVisible)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '3px',
      width: `${width}%`,
      background: 'var(--vermelho)',
      zIndex: 99999,
      transition: width === 100 ? 'width 0.15s ease' : 'width 0.4s ease',
      boxShadow: '0 0 8px rgba(229,45,8,0.6)',
      pointerEvents: 'none',
    }} />
  )
}
