import { useCallback, useSyncExternalStore } from 'react'
import { STORAGE_PREFIX } from '../config'

const THEME_KEY = `${STORAGE_PREFIX}.theme`

/**
 * Light/dark theme. index.html applies the initial class before first paint;
 * this hook lets React read and toggle it.
 */

const listeners = new Set<() => void>()

function isDark(): boolean {
  return document.documentElement.classList.contains('dark')
}

function setDark(dark: boolean): void {
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  } catch {
    // Non-fatal: theme just won't persist.
  }
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useTheme(): { dark: boolean; toggle: () => void } {
  const dark = useSyncExternalStore(subscribe, isDark)
  const toggle = useCallback(() => setDark(!isDark()), [])
  return { dark, toggle }
}
