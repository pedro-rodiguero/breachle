import { Link, Outlet } from 'react-router-dom'
import { APP_NAME } from '../config'
import { useTheme } from '../lib/theme'

export function Layout() {
  const { dark, toggle } = useTheme()
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-10">
      <header className="flex items-center justify-between py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-black tracking-tight"
          aria-label={`${APP_NAME} home`}
        >
          <span aria-hidden>🛡️</span>
          <span>
            {APP_NAME.slice(0, 6)}
            <span className="text-brand">{APP_NAME.slice(6)}</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="grid size-10 place-items-center rounded-tile border-2 border-edge bg-card text-lg shadow-tile transition hover:border-edge-strong active:translate-y-0.5 active:shadow-none"
        >
          {dark ? '🌙' : '☀️'}
        </button>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="pt-10 text-center text-xs text-ink-faint">
        {APP_NAME} — a daily security game. New puzzles at midnight UTC.
      </footer>
    </div>
  )
}
