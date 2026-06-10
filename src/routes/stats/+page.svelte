<script lang="ts">
	import { GAMES } from '$lib/config'
	import { utcDateKey } from '$lib/seed'
	import { getDisplayStreak, getGameStatus, getStats } from '$lib/storage'

	const todayKey = utcDateKey()

	const rows = GAMES.map((game) => {
		const stats = getStats(game.id)
		return {
			game,
			stats,
			liveStreak: getDisplayStreak(game.id, todayKey),
			doneToday: getGameStatus(game.id, todayKey) === 'done',
			winRate: stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0
		}
	})

	const totals = {
		played: rows.reduce((s, r) => s + r.stats.played, 0),
		wins: rows.reduce((s, r) => s + r.stats.wins, 0),
		bestStreak: Math.max(...rows.map((r) => r.stats.maxStreak)),
		clearedToday: rows.filter((r) => r.doneToday).length
	}
	const totalWinRate = totals.played > 0 ? Math.round((totals.wins / totals.played) * 100) : 0
</script>

{#snippet statBox(value: string | number, label: string)}
	<div class="flex flex-col items-center rounded-tile border border-edge bg-inset px-3 py-2">
		<span class="font-mono text-xl font-bold text-brand tabular-nums">{value}</span>
		<span class="font-mono text-[10px] font-semibold tracking-wide text-ink-faint uppercase">
			{label}
		</span>
	</div>
{/snippet}

<div class="space-y-4">
	<div class="animate-rise">
		<p class="mb-1.5 font-mono text-[11px] font-bold tracking-[0.25em] text-ink-faint uppercase">
			<span class="text-brand">&gt;</span> cat /var/log/analyst_stats
		</p>
		<h1 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
			analyst <span class="text-gradient">stats</span>
		</h1>
	</div>

	<section class="glass bracket animate-rise p-5" style="animation-delay: 60ms" aria-label="Overall stats">
		<p class="mb-3 font-mono text-[11px] font-bold tracking-wider text-ink-faint uppercase">
			// all modules
		</p>
		<div class="grid grid-cols-4 gap-2">
			{@render statBox(totals.played, 'Played')}
			{@render statBox(totals.wins, 'Wins')}
			{@render statBox(`${totalWinRate}%`, 'Win rate')}
			{@render statBox(`${totals.clearedToday}/4`, 'Today')}
		</div>
	</section>

	{#each rows as { game, stats, liveStreak, winRate }, i (game.id)}
		<section
			class="glass animate-rise p-5"
			style="animation-delay: {120 + i * 60}ms"
			aria-label="{game.name} stats"
		>
			<div class="mb-3 flex items-center gap-2.5">
				<span
					aria-hidden="true"
					class="glow grid size-9 place-items-center rounded-tile bg-raised text-xl"
					style="--glow: {game.glow}"
				>
					{game.icon}
				</span>
				<h2 class="font-display text-2xl font-bold" style="color: {game.glow}">{game.name}</h2>
				<a
					href="#{game.path}"
					class="ml-auto font-mono text-[11px] font-bold tracking-wider text-ink-soft hover:text-brand"
				>
					[ PLAY ]
				</a>
			</div>
			<div class="grid grid-cols-5 gap-2">
				{@render statBox(liveStreak, 'Streak')}
				{@render statBox(stats.maxStreak, 'Best')}
				{@render statBox(stats.played, 'Played')}
				{@render statBox(stats.wins, 'Wins')}
				{@render statBox(`${winRate}%`, 'Win rate')}
			</div>
		</section>
	{/each}
</div>
