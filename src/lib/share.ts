import { APP_NAME, SITE_URL } from './config'

/**
 * Spoiler-free emoji share grids, à la Wordle. Each game supplies its own
 * emoji lines + scoreline; this module handles the common framing and the
 * clipboard plumbing.
 */

export type ShareInput = {
  gameName: string
  dayNumber: number
  /** e.g. "4/6" or "7/8" — appended to the title line. */
  scoreline?: string
  /** Emoji rows, no spoilers. */
  lines: string[]
}

export function buildShareText({ gameName, dayNumber, scoreline, lines }: ShareInput): string {
  const title = [`${APP_NAME} · ${gameName} #${dayNumber}`, scoreline].filter(Boolean).join(' ')
  const parts = [title, lines.join('\n')]
  if (SITE_URL) parts.push(SITE_URL)
  return parts.join('\n\n')
}

/** Clipboard API with a hidden-textarea fallback for older mobile browsers. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}
