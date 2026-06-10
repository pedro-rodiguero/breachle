<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { GameMeta } from '$lib/config'
	import Modal from './Modal.svelte'

	let {
		game,
		day,
		streak,
		rules
	}: { game: GameMeta; day: number; streak: number; rules: Snippet } = $props()

	let showRules = $state(false)
</script>

<div class="mb-5 animate-rise">
	<div class="flex items-center justify-between gap-3">
		<h1 class="flex items-center gap-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
			<span
				aria-hidden="true"
				class="glow grid size-11 place-items-center rounded-tile bg-raised text-2xl"
				style="--glow: {game.glow}"
			>
				{game.icon}
			</span>
			{game.name}
			<span class="mt-1 font-mono text-base font-semibold text-ink-faint">#{day}</span>
		</h1>
		<div class="flex items-center gap-2">
			{#if streak > 0}
				<span
					class="rounded-full border border-edge bg-card px-3 py-1.5 text-sm font-bold text-ink-soft"
					title="Current streak"
				>
					🔥 {streak}
				</span>
			{/if}
			<button
				type="button"
				onclick={() => (showRules = true)}
				aria-label="How to play"
				class="grid size-10 place-items-center rounded-full border border-edge bg-card font-mono text-base font-bold text-ink-soft transition hover:border-edge-strong hover:text-ink"
			>
				?
			</button>
		</div>
	</div>
	<Modal bind:open={showRules} title="How to play {game.name}">
		{@render rules()}
	</Modal>
</div>
