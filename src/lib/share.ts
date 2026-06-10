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
  /** Game icon emoji, drawn on the rendered share card. */
  icon?: string
  /** Game accent color (hex), used on the rendered share card. */
  accent?: string
}

export function buildShareText({ gameName, dayNumber, scoreline, lines }: ShareInput): string {
  const title = [`${APP_NAME} · ${gameName} #${dayNumber}`, scoreline].filter(Boolean).join(' ')
  const parts = [title, lines.join('\n')]
  if (SITE_URL) parts.push(SITE_URL)
  return parts.join('\n\n')
}

/**
 * Longer-form message preloaded into social composers (LinkedIn / X):
 * result up top, a one-line pitch, the link, and a couple of reach hashtags.
 * Still spoiler-free — only the emoji grid travels.
 */
export function buildSocialText(share: ShareInput): string {
  const day = String(share.dayNumber).padStart(3, '0')
  const title = [`${APP_NAME} · ${share.gameName} #${day}`, share.scoreline]
    .filter(Boolean)
    .join(' — ')
  return [
    title,
    '',
    share.lines.join('\n'),
    '',
    'Daily cybersecurity puzzles — guess the vuln, triage the alerts, spot the phish. Same puzzle for everyone, every day.',
    SITE_URL ? `Play today's drop → ${SITE_URL}` : 'New drop every day at 00:00 UTC.',
    '',
    '#cybersecurity #infosec #blueteam',
  ].join('\n')
}

/** LinkedIn post composer with the text preloaded (desktop web). */
export function linkedInComposeUrl(text: string): string {
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`
}

/** X/Twitter post intent with the text preloaded. */
export function xComposeUrl(text: string): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`
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
