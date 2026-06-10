import { useEffect, useRef, useState } from 'react'
import { buildShareText, copyToClipboard, type ShareInput } from '../lib/share'

/** "Copy result" button with transient copied/failed feedback. */
export function ShareButton({ share }: { share: ShareInput }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const onCopy = async () => {
    const ok = await copyToClipboard(buildShareText(share))
    setStatus(ok ? 'copied' : 'failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center gap-2 rounded-tile bg-brand px-5 py-3 text-base font-extrabold text-white shadow-card transition hover:bg-brand-deep active:translate-y-0.5"
    >
      <span aria-hidden>{status === 'copied' ? '✅' : '📋'}</span>
      {status === 'copied' ? 'Copied!' : status === 'failed' ? 'Copy failed' : 'Copy result'}
      <span aria-live="polite" className="sr-only">
        {status === 'copied' ? 'Result copied to clipboard' : ''}
      </span>
    </button>
  )
}
