<script lang="ts">
	import { buildShareText, copyToClipboard, type ShareInput } from '$lib/share'

	let { share }: { share: ShareInput } = $props()

	let status = $state<'idle' | 'copied' | 'failed'>('idle')
	let timer: ReturnType<typeof setTimeout>

	$effect(() => () => clearTimeout(timer))

	async function onCopy() {
		const ok = await copyToClipboard(buildShareText(share))
		status = ok ? 'copied' : 'failed'
		clearTimeout(timer)
		timer = setTimeout(() => (status = 'idle'), 2000)
	}
</script>

<button
	type="button"
	onclick={onCopy}
	class="glow inline-flex items-center gap-2 rounded-tile bg-brand-deep px-5 py-3 font-mono text-base font-bold tracking-wider text-black transition hover:brightness-115 active:translate-y-0.5"
	style="--glow: #18e06a"
>
	{status === 'copied' ? '[ COPIED ✓ ]' : status === 'failed' ? '[ COPY FAILED ]' : '[ COPY TEXT ]'}
	<span aria-live="polite" class="sr-only">
		{status === 'copied' ? 'Result copied to clipboard' : ''}
	</span>
</button>
