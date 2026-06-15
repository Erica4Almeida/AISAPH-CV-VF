export function formatDate(dateStr: string | undefined, locale = 'pt-CV', options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return ''
  // Remove timezone info to treat as local date and avoid -1 day issue
  const local = new Date(dateStr.split('T')[0] + 'T00:00:00')
  return local.toLocaleDateString(locale, options ?? { day: 'numeric', month: 'long', year: 'numeric' })
}
