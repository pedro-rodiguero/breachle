import { STORAGE_PREFIX } from './config'

const THEME_KEY = `${STORAGE_PREFIX}.theme`

// Dark-first theme. app.html sets the initial `.light` class before first
// paint; this singleton lets components read and toggle it.
class Theme {
	light = $state(false)

	constructor() {
		if (typeof document !== 'undefined') {
			this.light = document.documentElement.classList.contains('light')
		}
	}

	toggle(): void {
		this.light = !this.light
		document.documentElement.classList.toggle('light', this.light)
		try {
			localStorage.setItem(THEME_KEY, this.light ? 'light' : 'dark')
		} catch {
			// Non-fatal: theme just won't persist.
		}
	}
}

export const theme = new Theme()
