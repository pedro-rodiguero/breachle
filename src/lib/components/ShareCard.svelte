<script lang="ts">
	import { buildShareText, type ShareInput } from '$lib/share'
	import { renderShareCard, shareCardFilename } from '$lib/sharecard'

	let { share }: { share: ShareInput } = $props()

	let blob = $state<Blob | null>(null)
	let previewUrl = $state('')
	let status = $state<'idle' | 'shared' | 'copied' | 'saved' | 'failed'>('idle')
	let timer: ReturnType<typeof setTimeout>

	$effect(() => {
		let revoked = false
		renderShareCard(share)
			.then((b) => {
				if (revoked) return
				blob = b
				previewUrl = URL.createObjectURL(b)
			})
			.catch(() => {
				// No card preview — text sharing still works.
			})
		return () => {
			revoked = true
			if (previewUrl) URL.revokeObjectURL(previewUrl)
			clearTimeout(timer)
		}
	})

	function flash(s: typeof status) {
		status = s
		clearTimeout(timer)
		timer = setTimeout(() => (status = 'idle'), 2200)
	}

	async function shareImage() {
		if (!blob) return
		const file = new File([blob], shareCardFilename(share), { type: 'image/png' })

		// 1) Native share sheet (mobile) — image + spoiler-free text together.
		try {
			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({ files: [file], text: buildShareText(share) })
				flash('shared')
				return
			}
		} catch (e) {
			if ((e as DOMException)?.name === 'AbortError') return // user closed the sheet
		}

		// 2) Copy the PNG to the clipboard (desktop).
		try {
			await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
			flash('copied')
			return
		} catch {
			// fall through
		}

		// 3) Plain download.
		try {
			const a = document.createElement('a')
			a.href = previewUrl
			a.download = shareCardFilename(share)
			a.click()
			flash('saved')
		} catch {
			flash('failed')
		}
	}

	const LABEL: Record<typeof status, string> = {
		idle: '[ SHARE CARD ]',
		shared: '[ SHARED ✓ ]',
		copied: '[ IMG COPIED ✓ ]',
		saved: '[ SAVED ✓ ]',
		failed: '[ FAILED ]'
	}
</script>

{#if previewUrl}
	<div class="mx-auto mb-4 w-fit">
		<img
			src={previewUrl}
			alt="Today's result as a shareable card"
			class="glow mx-auto w-44 border border-edge-strong sm:w-52"
			style="--glow: {share.accent ?? '#4dff8f'}; border-radius: var(--radius-card)"
		/>
		<button
			type="button"
			onclick={shareImage}
			class="glass mt-3 w-full px-4 py-2.5 font-mono text-sm font-bold tracking-wider text-brand transition hover:border-edge-strong active:translate-y-0.5"
			style="border-radius: var(--radius-tile)"
		>
			{LABEL[status]}
			<span aria-live="polite" class="sr-only">
				{status === 'copied' ? 'Image copied to clipboard' : status === 'saved' ? 'Image downloaded' : ''}
			</span>
		</button>
	</div>
{/if}
