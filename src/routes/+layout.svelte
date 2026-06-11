<script lang="ts">
	import '../app.css'
	import type { Snippet } from 'svelte'
	import { onNavigate } from '$app/navigation'
	import { APP_NAME } from '$lib/config'
	import { theme } from '$lib/theme.svelte'

	let { children }: { children: Snippet } = $props()

	// Moves the .cursor-glow halo with the pointer.
	let glow = $state<HTMLDivElement>()
	function onPointerMove(e: PointerEvent) {
		if (!glow || e.pointerType !== 'mouse') return
		glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
		glow.classList.add('live')
	}

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

<svelte:window onpointermove={onPointerMove} />

<div aria-hidden="true" class="scanbeam"></div>
<div bind:this={glow} aria-hidden="true" class="cursor-glow"></div>

<div class="mx-auto flex min-h-dvh w-full max-w-280 flex-col px-4 pb-10">
	<header class="flex items-center justify-between py-4">
		<a
			href="#/"
			class="flex items-baseline gap-1.5 font-display text-2xl font-extrabold tracking-tight sm:text-3xl"
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
	<footer class="space-y-1 pt-10 text-center font-mono text-xs text-ink-faint">
		<p>
			<span class="text-brand">&gt;</span> {APP_NAME.toLowerCase()} — daily security ops · cron: 00:00 UTC
		</p>
		<p>
			built by
			<a
				href="https://pedrorodiguero.netlify.app/"
				target="_blank"
				rel="noopener"
				class="font-bold text-ink-soft underline decoration-edge-strong underline-offset-2 transition hover:text-brand"
			>
				pedro rodiguero
			</a>
			·
			<a
				href="https://github.com/pedro-rodiguero/breachle"
				target="_blank"
				rel="noopener"
				class="font-bold text-ink-soft underline decoration-edge-strong underline-offset-2 transition hover:text-brand"
			>
				source
			</a>
		</p>
	</footer>
</div>
