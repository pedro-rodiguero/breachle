import { useMemo } from 'react'
import { mulberry32 } from '../lib/seed'

const COLORS = ['#7c5cff', '#ff5470', '#ffb02e', '#22b8e6', '#3ecf6e', '#f5d547']

/** Lightweight CSS confetti burst rendered on wins. Purely decorative —
 * a fixed-seed PRNG keeps the scatter varied but render-pure. */
export function Confetti({ count = 70 }: { count?: number }) {
  const pieces = useMemo(() => {
    const rng = mulberry32(0xc0ffee)
    return Array.from({ length: count }, (_, i) => ({
      left: rng() * 100,
      delay: rng() * 0.7,
      duration: 2 + rng() * 1.6,
      size: 7 + rng() * 7,
      color: COLORS[i % COLORS.length],
      round: rng() > 0.5,
    }))
  }, [count])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 0.45),
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : 2,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
