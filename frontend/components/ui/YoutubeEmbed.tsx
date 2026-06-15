function getYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function YoutubeEmbed({ url, titulo }: { url: string; titulo?: string }) {
  const id = getYoutubeId(url)
  if (!id) return null

  return (
    <div className="yt-wrap">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={titulo ?? 'Vídeo'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="yt-iframe"
      />
    </div>
  )
}
