export function truncateText(
  text: string | null | undefined,
  maxLength: number
): string {
  if (text === null || text === undefined) {
    return ''
  }
  const trimmedText = text.trim()
  if (trimmedText.length <= maxLength) {
    return trimmedText
  }
  return trimmedText.substring(0, maxLength) + '...'
}
