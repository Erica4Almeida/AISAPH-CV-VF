'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  value: string | number
  duration?: number
  suffix?: string
}

export default function CountUp({ value, duration = 1800, suffix = '' }: Props) {
  const raw    = String(value)
  const num    = parseFloat(raw.replace(/[^0-9.]/g, ''))
  const prefix = raw.match(/^[^0-9]*/)?.[0] ?? ''
  const auto   = raw.match(/[^0-9.]+$/)?.[0] ?? ''

  const [display, setDisplay] = useState(0)
  const ref     = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (isNaN(num)) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased    = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(eased * num))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [num, duration])

  if (isNaN(num)) return <span>{raw}{suffix}</span>

  return (
    <span ref={ref}>
      {prefix}{display}{auto}{suffix}
    </span>
  )
}
