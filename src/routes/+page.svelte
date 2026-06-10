<script lang="ts">
	import { GAMES } from '$lib/config'
	import { dayNumber, utcDateKey } from '$lib/seed'
	import { getDisplayStreak, getGameStatus, type GameStatus } from '$lib/storage'

	const todayKey = utcDateKey()
	const day = dayNumber(todayKey)

	const STATUS_LABEL: Record<GameStatus, { text: string; cls: string }> = {
		new: { text: 'PLAY', cls: 'bg-brand-deep text-white' },
		playing: { text: 'RESUME', cls: 'bg-warn text-black' },
		done: { text: 'DONE ✓', cls: 'bg-malware-deep text-black' }
	}

	const cards = GAMES.map((game) => ({
		game,
		status: getGameStatus(game.id, todayKey),
		streak: getDisplayStreak(game.id, todayKey)
	}))
</script>

<div class="space-y-4">
	<div class="animate-rise pt-2 pb-2 text-center">
		<p class="font-mono text-sm font-bold tracking-[0.3em] text-brand uppercase">
			// day {String(day).padStart(3, '0')}
		</p>
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
			Today's <span class="text-gradient">security puzzles</span>
		</h1>
		<p class="mt-1 font-medium text-ink-soft">
			Four daily games. Same puzzles for everyone, everywhere.
		</p>
	</div>
	<div class="grid gap-4">
		{#each cards as { game, status, streak }, i (game.id)}
			<a
				href="#{game.path}"
				class="glass group animate-rise p-5 transition duration-200 hover:-translate-y-1 hover:border-edge-strong"
				style="animation-delay: {i * 70}ms; --glow: {game.glow}"
			>
				<div class="flex items-center gap-4">
					<span
						aria-hidden="true"
						class="glow grid size-14 shrink-0 place-items-center rounded-tile bg-raised text-3xl transition group-hover:scale-110"
						style="--glow: {game.glow}"
					>
						{game.icon}
					</span>
					<div class="min-w-0 flex-1">
						<h2 class="flex items-center gap-2 text-lg font-bold">
							{game.name}
							{#if streak > 0}
								<span class="text-sm font-bold text-ink-soft" title="Current streak">
									🔥{streak}
								</span>
							{/if}
						</h2>
						<p class="truncate text-sm font-medium text-ink-soft">{game.tagline}</p>
					</div>
					<span
						class="shrink-0 rounded-full px-3.5 py-1.5 font-mono text-xs font-bold {STATUS_LABEL[
							status
						].cls}"
					>
						{STATUS_LABEL[status].text}
					</span>
				</div>
			</a>
		{/each}
	</div>
</div>
