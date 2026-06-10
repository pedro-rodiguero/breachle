<script lang="ts">
	import '../app.css'
	import type { Snippet } from 'svelte'
	import { onNavigate } from '$app/navigation'
	import { APP_NAME } from '$lib/config'
	import { theme } from '$lib/theme.svelte'

	let { children }: { children: Snippet } = $props()

	// Cross-fade pages with the View Transitions API where available.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return
		return new Promise((resolveTransition) => {
			document.startViewTransition(() => {
				resolveTransition()
				return navigation.complete
			})
		})
	})
</script>

<div class="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-10">
	<header class="flex items-center justify-between py-4">
		<a
			href="#/"
			class="flex items-center gap-2 font-mono text-xl font-extrabold tracking-tight"
			aria-label="{APP_NAME} home"
		>
			<span aria-hidden="true" class="animate-pulse-glow">🛡️</span>
			<span>
				{APP_NAME.slice(0, 6)}<span class="text-gradient">{APP_NAME.slice(6)}</span><span
					aria-hidden="true"
					class="animate-blink text-brand">_</span
				>
			</span>
		</a>
		<button
			type="button"
			onclick={() => theme.toggle()}
			aria-label={theme.light ? 'Switch to dark theme' : 'Switch to light theme'}
			class="glass grid size-10 place-items-center text-lg transition hover:border-edge-strong active:translate-y-0.5"
			style="border-radius: var(--radius-tile)"
		>
			{theme.light ? '☀️' : '🌙'}
		</button>
	</header>
	<main class="flex-1">
		{@render children()}
	</main>
	<footer class="pt-10 text-center font-mono text-xs text-ink-faint">
		{APP_NAME} — a daily security game · new puzzles at 00:00 UTC
	</footer>
</div>
