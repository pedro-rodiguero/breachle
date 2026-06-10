<script lang="ts">
	import { msUntilNextPuzzle } from '$lib/seed'

	let ms = $state(msUntilNextPuzzle())

	$effect(() => {
		const id = setInterval(() => (ms = msUntilNextPuzzle()), 1000)
		return () => clearInterval(id)
	})

	const formatted = $derived.by(() => {
		const total = Math.max(0, Math.floor(ms / 1000))
		const h = Math.floor(total / 3600)
		const m = Math.floor((total % 3600) / 60)
		const s = total % 60
		return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
	})
</script>

<p class="text-sm text-ink-soft">
	Next puzzle in
	<span class="font-mono text-base font-semibold tabular-nums text-ink">{formatted}</span>
</p>
