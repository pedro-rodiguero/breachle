import { Link } from 'react-router-dom'
import { GAMES, type GameMeta } from '../config'
import { dayNumber, utcDateKey } from '../lib/seed'
import { getDisplayStreak, getGameStatus, type GameStatus } from '../lib/storage'

const STATUS_LABEL: Record<GameStatus, { text: string; cls: string }> = {
  new: { text: 'Play', cls: 'bg-brand text-white' },
  playing: { text: 'Resume', cls: 'bg-warn text-ink' },
  done: { text: 'Done ✓', cls: 'bg-good text-white' },
}

function GameCard({ game, index }: { game: GameMeta; index: number }) {
  const todayKey = utcDateKey()
  const status = getGameStatus(game.id, todayKey)
  const streak = getDisplayStreak(game.id, todayKey)
  const badge = STATUS_LABEL[status]

  return (
    <Link
      to={game.path}
      className="group animate-rise rounded-card border-2 border-edge bg-card p-5 shadow-card transition hover:-translate-y-1 hover:border-edge-strong"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className={`grid size-14 shrink-0 place-items-center rounded-tile ${game.accentBg} text-3xl shadow-tile transition group-hover:scale-110`}
        >
          {game.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-2 text-lg font-black">
            {game.name}
            {streak > 0 && (
              <span className="text-sm font-extrabold text-ink-soft" title="Current streak">
                🔥{streak}
              </span>
            )}
          </h2>
          <p className="truncate text-sm font-semibold text-ink-soft">{game.tagline}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-extrabold ${badge.cls}`}
        >
          {badge.text}
        </span>
      </div>
    </Link>
  )
}

export function Hub() {
  const day = dayNumber()
  return (
    <div className="space-y-4">
      <div className="animate-rise pb-2 pt-2 text-center">
        <p className="text-sm font-extrabold uppercase tracking-widest text-brand">Day #{day}</p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Today's security puzzles
        </h1>
        <p className="mt-1 font-semibold text-ink-soft">
          Four daily games. Same puzzles for everyone, everywhere.
        </p>
      </div>
      <div className="grid gap-4">
        {GAMES.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} />
        ))}
      </div>
    </div>
  )
}
