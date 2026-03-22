// App-level utilities (shadcn cn lives in @/lib/utils)

/**
 * Get avatar fallback text: first character for CJK names, first letter(s) for Latin names.
 * 中文取第一个字，英文取每个单词的首字母（如 John Doe -> JD）。
 */
export function getAvatarFallback(name: string): string {
  const n = (name ?? '').trim()
  if (!n) return '?'
  const first = n[0]
  const code = first.charCodeAt(0)
  // CJK Unified Ideographs + Extension A
  const isCjk = (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf)
  if (isCjk) return first
  // Latin/English: first letter of first word + first letter of last word (if multiple)
  const parts = n.split(/\s+/).filter(Boolean)
  const firstPart = parts[0] ?? ''
  let init = firstPart[0]?.toUpperCase() ?? ''
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1] ?? ''
    init += lastPart[0]?.toUpperCase() ?? ''
  }
  return init || '?'
}
