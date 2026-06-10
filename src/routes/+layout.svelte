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

<div aria-hidden="true" class="scanbeam"></div>

<div class="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-10">
	<header class="flex items-center justify-between py-4">
		<a
			href="#/"
			class="flex items-baseline gap-1.5 font-mono text-lg font-extrabold tracking-tight sm:text-xl"
			aria-label="{APP_NAME} home"
		>
			<span aria-hidden="true" class="text-brand phosphor">root@</span><span class="text-gradient"
				>{APP_NAME.toLowerCase()}</span
			><span aria-hidden="true" class="text-ink-faint">:~$</span><span
				aria-hidden="true"
				class="animate-blink ml-0.5 text-brand phosphor">▮</span
			>
		</a>
		<button
			type="button"
			onclick={() => theme.toggle()}
			aria-label={theme.light ? 'Switch to dark theme' : 'Switch to light theme'}
			class="glass grid size-10 place-items-center font-mono text-xs font-bold text-ink-soft transition hover:border-edge-strong hover:text-brand active:translate-y-0.5"
			style="border-radius: var(--radius-tile)"
		>
			{theme.light ? 'LGT' : 'DRK'}
		</button>
	</header>
	<main class="flex-1">
		{@render children()}
	</main>
	<footer class="pt-10 text-center font-mono text-xs text-ink-faint">
		<span class="text-brand">&gt;</span> {APP_NAME.toLowerCase()} — daily security ops · cron: 00:00 UTC
	</footer>
</div>
