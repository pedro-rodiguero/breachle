import { APP_NAME, SITE_URL } from './config'

// Wordle-style emoji share grids. Each game supplies its own emoji rows and
// scoreline; this module builds the share text and handles the clipboard.

export type ShareInput = {
  gameName: string
  dayNumber: number
  // e.g. "4/6" or "7/8", appended to the title line.
  scoreline?: string
  // Emoji rows, no spoilers.
  lines: string[]
  // Game icon emoji, drawn on the share card.
  icon?: string
  // Hex accent, used on the share card.
  accent?: string
}

export function buildShareText({ gameName, dayNumber, scoreline, lines }: ShareInput): string {
  const title = [`${APP_NAME} · ${gameName} #${dayNumber}`, scoreline].filter(Boolean).join(' ')
  const parts = [title, lines.join('\n')]
  if (SITE_URL) parts.push(SITE_URL)
  return parts.join('\n\n')
}

// Longer message for social composers (LinkedIn / X): result, a one-line
// pitch, the link, and a few hashtags. No spoilers; only the grid travels.
export function buildSocialText(share: ShareInput): string {
  const day = String(share.dayNumber).padStart(3, '0')
  const title = [`${APP_NAME} · ${share.gameName} #${day}`, share.scoreline]
    .filter(Boolean)
    .join(', ')
  return [
    title,
    '',
    share.lines.join('\n'),
    '',
    'Daily cybersecurity puzzles: guess the vuln, triage the alerts, spot the phish. Same puzzle for everyone, every day.',
    SITE_URL ? `Play today: ${SITE_URL}` : 'New drop every day at 00:00 UTC.',
    '',
    '#cybersecurity #infosec #blueteam',
  ].join('\n')
}

// Title line only, e.g. "Breachle · CVE-dle #011 4/6" — for destinations
// that take a separate subject (Reddit).
export function buildShareTitle({ gameName, dayNumber, scoreline }: ShareInput): string {
  return [`${APP_NAME} · ${gameName} #${String(dayNumber).padStart(3, '0')}`, scoreline]
    .filter(Boolean)
    .join(' ')
}

// LinkedIn web composer with the text preloaded.
export function linkedInComposeUrl(text: string): string {
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`
}

// X post intent with the text preloaded.
export function xComposeUrl(text: string): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`
}

// WhatsApp composer (app or web; recipient picked there).
export function whatsAppComposeUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

// Telegram share screen. The url param is required; text rides along.
export function telegramComposeUrl(text: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(SITE_URL || 'https://breachle.app')}&text=${encodeURIComponent(text)}`
}

// Reddit text-post composer with title + body preloaded.
export function redditComposeUrl(title: string, text: string): string {
  return `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&selftext=true&text=${encodeURIComponent(text)}`
}

// Clipboard write with a hidden-textarea fallback for older mobile browsers.
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
