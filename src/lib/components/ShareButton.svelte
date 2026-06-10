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
	class="glow inline-flex items-center gap-2 rounded-tile bg-brand-deep px-5 py-3 text-base font-bold text-white transition hover:brightness-115 active:translate-y-0.5"
	style="--glow: #7c5cff"
>
	<span aria-hidden="true">{status === 'copied' ? '✅' : '📋'}</span>
	{status === 'copied' ? 'Copied!' : status === 'failed' ? 'Copy failed' : 'Copy result'}
	<span aria-live="polite" class="sr-only">
		{status === 'copied' ? 'Result copied to clipboard' : ''}
	</span>
</button>
