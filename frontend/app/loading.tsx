export default function Loading() {
  return (
    <div className="loading-wrap">
      <div className="loading-hero">
        <div className="skel" style={{ width: '120px', height: '14px', opacity: 0.3 }} />
        <div className="skel" style={{ width: '420px', maxWidth: '80vw', height: '40px', opacity: 0.25 }} />
        <div className="skel" style={{ width: '320px', maxWidth: '70vw', height: '20px', opacity: 0.2 }} />
      </div>
      <div className="loading-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skel" style={{ height: '200px', animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  )
}
