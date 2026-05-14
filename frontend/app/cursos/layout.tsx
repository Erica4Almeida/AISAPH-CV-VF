import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cursos & Formações',
  description: 'Descubra os cursos de socorrismo e APH da AISAPH-CV. Formações do nível básico ao especializado, com certificação nacional e internacional.',
  openGraph: {
    title: 'Cursos & Formações | AISAPH-CV',
    description: 'Formações para todos os níveis — do básico ao especializado, com certificação nacional e internacional.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
}

export default function CursosLayout({ children }: { children: React.ReactNode }) {
  return children
}
