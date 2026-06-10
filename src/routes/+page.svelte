<script lang="ts">
	import { GAMES } from '$lib/config'
	import { dayNumber, utcDateKey } from '$lib/seed'
	import { getDisplayStreak, getGameStatus, type GameStatus } from '$lib/storage'

	const todayKey = utcDateKey()
	const day = dayNumber(todayKey)

	const STATUS_LABEL: Record<GameStatus, { text: string; cls: string }> = {
		new: { text: 'PLAY', cls: 'bg-brand-deep text-black' },
		playing: { text: 'RESUME', cls: 'bg-warn text-black' },
		done: { text: 'DONE', cls: 'border border-brand/60 bg-brand/10 text-brand' }
	}

	const cards = GAMES.map((game, i) => ({
		game,
		idx: i,
		status: getGameStatus(game.id, todayKey),
		streak: getDisplayStreak(game.id, todayKey)
	}))
	const doneCount = cards.filter((c) => c.status === 'done').length
</script>

<div class="space-y-5">
	<div class="animate-rise pt-2 pb-1">
		<p class="font-mono text-xs font-bold tracking-[0.25em] text-ink-faint uppercase">
			<span class="text-brand">&gt;</span> booting daily ops<span class="animate-blink">_</span>
		</p>
		<h1 class="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
			today's <span class="glitch text-gradient" data-text="security ops">security ops</span>
		</h1>
		<p class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-soft">
			<span><span class="text-ink-faint">DAY</span> #{String(day).padStart(3, '0')}</span>
			<span class="text-ink-faint">·</span>
			<span><span class="text-ink-faint">CLEARED</span> {doneCount}/{GAMES.length}</span>
			<span class="text-ink-faint">·</span>
			<span class="text-ink-faint">same puzzle, everyone, worldwide</span>
		</p>
	</div>

	<div class="glass bracket animate-rise overflow-hidden" style="animation-delay: 60ms">
		<div
			class="flex items-center justify-between border-b border-edge bg-inset px-4 py-2 font-mono text-[11px] font-bold tracking-wider text-ink-faint uppercase"
		>
			<span>// modules</span>
			<span>status</span>
		</div>
		{#each cards as { game, idx, status, streak } (game.id)}
			<a
				href="#{game.path}"
				class="group flex items-center gap-3 px-4 py-4 transition hover:bg-raised
					{idx < cards.length - 1 ? 'border-b border-edge' : ''}"
			>
				<span class="font-mono text-xs text-ink-faint">{String(idx + 1).padStart(2, '0')}</span>
				<span
					aria-hidden="true"
					class="glow grid size-11 shrink-0 place-items-center rounded-tile bg-raised text-2xl transition group-hover:scale-110"
					style="--glow: {game.glow}"
				>
					{game.icon}
				</span>
				<div class="min-w-0 flex-1">
					<h2 class="flex items-center gap-2 font-mono text-base font-bold">
						<span class="transition group-hover:text-brand">{game.name}</span>
						{#if streak > 0}
							<span class="font-bold text-amber" title="Current streak">🔥{streak}</span>
						{/if}
					</h2>
					<p class="truncate text-xs font-medium text-ink-soft">{game.tagline}</p>
				</div>
				<span
					class="shrink-0 rounded-tile px-3 py-1.5 font-mono text-[11px] font-extrabold tracking-wider {STATUS_LABEL[
						status
					].cls}"
				>
					[{STATUS_LABEL[status].text}]
				</span>
			</a>
		{/each}
	</div>
</div>
