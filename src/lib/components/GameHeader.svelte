<script lang="ts">
	import { onMount, type Snippet } from 'svelte'
	import type { GameMeta } from '$lib/config'
	import { hasSeenOnce, markSeenOnce } from '$lib/storage'
	import Modal from './Modal.svelte'

	let {
		game,
		day,
		streak,
		rules,
		archive = false,
		autoRules = false
	}: {
		game: GameMeta
		day: number
		streak: number
		rules: Snippet
		archive?: boolean
		// Pop the rules open the very first time this game is played.
		autoRules?: boolean
	} = $props()

	let showRules = $state(false)

	// First play of this game (live daily only) surfaces the rules once.
	onMount(() => {
		if (autoRules && !archive && !hasSeenOnce(`rules.${game.id}`)) {
			showRules = true
			markSeenOnce(`rules.${game.id}`)
		}
	})
</script>

<div class="mb-5 animate-rise">
	<p class="mb-1.5 font-mono text-[11px] font-bold tracking-[0.25em] text-ink-faint uppercase">
		<span class="text-brand">&gt;</span> ./{game.id}
		{day === 0 ? '--warmup' : `--day ${String(day).padStart(3, '0')}`}
		{#if archive}<a
				href="#/archive"
				title="Back to the archive"
				class="ml-1 rounded-tile border border-amber/60 bg-amber/10 px-1.5 py-0.5 text-amber transition hover:border-amber hover:bg-amber/20"
				>← archive</a
			>{/if}
	</p>
	<div class="flex items-center justify-between gap-3">
		<h1 class="flex items-center gap-2.5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
			<span
				aria-hidden="true"
				class="glow grid size-11 place-items-center rounded-tile bg-raised text-2xl"
				style="--glow: {game.glow}"
			>
				{game.icon}
			</span>
			<span style="color: {game.glow}" class="phosphor">{game.name}</span>
		</h1>
		<div class="flex items-center gap-2">
			{#if streak > 0 && !archive}
				<span
					class="glass rounded-tile px-3 py-1.5 font-mono text-sm font-bold text-amber"
					title="Current streak"
				>
					🔥 {streak}
				</span>
			{/if}
			<button
				type="button"
				onclick={() => (showRules = true)}
				aria-label="How to play"
				class="glass grid size-10 place-items-center rounded-tile font-mono text-base font-bold text-ink-soft transition hover:border-edge-strong hover:text-brand"
			>
				?
			</button>
		</div>
	</div>
	<Modal bind:open={showRules} title="How to play {game.name}">
		{@render rules()}
	</Modal>
</div>
