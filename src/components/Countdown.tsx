import { useEffect, useState } from 'react'
import { msUntilNextPuzzle } from '../lib/seed'

function format(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

/** Live HH:MM:SS until the next puzzle (UTC midnight). */
export function Countdown() {
  const [ms, setMs] = useState(msUntilNextPuzzle)

  useEffect(() => {
    const id = setInterval(() => setMs(msUntilNextPuzzle()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <p className="text-sm text-ink-soft">
      Next puzzle in{' '}
      <span className="font-mono text-base font-semibold tabular-nums text-ink">{format(ms)}</span>
    </p>
  )
}
