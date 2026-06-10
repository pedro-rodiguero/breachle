import { useState, type ReactNode } from 'react'
import type { GameMeta } from '../config'
import type { GameStats } from '../lib/storage'
import type { ShareInput } from '../lib/share'
import { Countdown } from './Countdown'
import { Modal } from './Modal'
import { ShareButton } from './ShareButton'

/** Shared page chrome for every game: title row, day number, rules modal. */
export function GameHeader({
  game,
  day,
  streak,
  rules,
}: {
  game: GameMeta
  day: number
  streak: number
  rules: ReactNode
}) {
  const [showRules, setShowRules] = useState(false)
  return (
    <div className="mb-5 animate-rise">
      <div className="flex items-center justify-between gap-3">
        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight sm:text-3xl">
          <span
            aria-hidden
            className={`grid size-11 place-items-center rounded-tile ${game.accentBg} text-2xl shadow-tile`}
          >
            {game.icon}
          </span>
          {game.name}
          <span className="mt-1 text-base font-bold text-ink-faint">#{day}</span>
        </h1>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <span
              className="rounded-full bg-inset px-3 py-1.5 text-sm font-extrabold text-ink-soft"
              title="Current streak"
            >
              🔥 {streak}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowRules(true)}
            aria-label="How to play"
            className="grid size-10 place-items-center rounded-full border-2 border-edge bg-card text-base font-black text-ink-soft transition hover:border-edge-strong"
          >
            ?
          </button>
        </div>
      </div>
      <Modal open={showRules} onClose={() => setShowRules(false)} title={`How to play ${game.name}`}>
        {rules}
      </Modal>
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-tile bg-inset px-4 py-2.5">
      <span className="text-2xl font-black tabular-nums">{value}</span>
      <span className="text-xs font-bold text-ink-faint">{label}</span>
    </div>
  )
}

/** Locked end-of-day panel: verdict, emoji grid preview, share, countdown. */
export function ResultPanel({
  heading,
  subheading,
  gridPreview,
  share,
  stats,
  children,
}: {
  heading: string
  subheading?: string
  gridPreview: string[]
  share: ShareInput
  stats: GameStats
  children?: ReactNode
}) {
  return (
    <section
      aria-label="Today's result"
      className="animate-rise rounded-card border-2 border-edge bg-card p-6 text-center shadow-card"
    >
      <h2 className="text-2xl font-black">{heading}</h2>
      {subheading && <p className="mt-1 text-sm font-semibold text-ink-soft">{subheading}</p>}
      <div className="my-4 space-y-1 text-xl leading-tight" aria-hidden>
        {gridPreview.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="mb-5 flex justify-center gap-3">
        <Stat value={stats.streak} label="Streak" />
        <Stat value={stats.maxStreak} label="Best" />
        <Stat value={stats.played} label="Played" />
      </div>
      {children}
      <div className="flex flex-col items-center gap-3">
        <ShareButton share={share} />
        <Countdown />
      </div>
    </section>
  )
}
