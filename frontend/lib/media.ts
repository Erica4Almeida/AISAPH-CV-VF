const PROD_CMS = 'https://cms.aisaph.com'
const CMS_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? PROD_CMS

export function mediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (!url.startsWith('http')) return `${CMS_BASE}${url}`
  // Rewrite absolute localhost URLs left over from local uploads
  if (/https?:\/\/localhost(:\d+)?/.test(url)) {
    return url.replace(/https?:\/\/localhost(:\d+)?/, PROD_CMS)
  }
  return url
}
