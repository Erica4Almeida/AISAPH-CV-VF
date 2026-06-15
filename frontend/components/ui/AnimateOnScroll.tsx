'use client'
import { useEffect, useRef } from 'react'

type Variant = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right'

interface Props {
  children: React.ReactNode
  variant?: Variant
  delay?: number
  className?: string
}

export default function AnimateOnScroll({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isMobile = window.innerWidth < 768
    el.style.transitionDelay = delay && !isMobile ? `${delay}ms` : '0ms'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('aos-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`aos-init aos-${variant} ${className}`.trim()}>
      {children}
    </div>
  )
}
