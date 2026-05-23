import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AISAPH-CV | Formação em Socorrismo e APH em Cabo Verde'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a3d62 0%, #124e7c 60%, #1a6399 100%)',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo placeholder / nome */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <div style={{
            width: '80px', height: '80px',
            background: '#e52d08',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
          }}>
            🚑
          </div>
          <span style={{
            fontSize: '52px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-1px',
          }}>
            AISAPH-CV
          </span>
        </div>

        <div style={{
          fontSize: '28px',
          color: 'rgba(255,255,255,0.85)',
          textAlign: 'center',
          maxWidth: '800px',
          lineHeight: 1.4,
          marginBottom: '32px',
        }}>
          Formação Internacional em Socorrismo e APH
        </div>

        <div style={{
          fontSize: '18px',
          color: '#ffb3ae',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          Credibilidade que Salva Vidas
        </div>
      </div>
    ),
    { ...size },
  )
}
