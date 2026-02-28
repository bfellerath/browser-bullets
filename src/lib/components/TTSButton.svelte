<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

	let { text }: { text: string } = $props();

	type Status = 'idle' | 'loading_model' | 'generating' | 'playing' | 'error';
	let status = $state<Status>('idle');
	let errorMsg = $state('');

	let worker: Worker | null = null;
	let currentAudio: HTMLAudioElement | null = null;
	let blobUrl: string | null = null;
	let requestId = 0;

	function getWorker(): Worker {
		if (!worker && browser) {
			worker = new Worker(new URL('../tts.worker.ts', import.meta.url), { type: 'module' });
			worker.onmessage = handleWorkerMessage;
		}
		return worker!;
	}

	function handleWorkerMessage(e: MessageEvent) {
		const msg = e.data;
		if (msg.id !== requestId) return;
		if (msg.type === 'loading_model') status = 'loading_model';
		else if (msg.type === 'generating') status = 'generating';
		else if (msg.type === 'audio') playBuffer(msg.buffer);
		else if (msg.type === 'error') {
			status = 'error';
			errorMsg = msg.message;
		}
	}

	function playBuffer(buffer: ArrayBuffer) {
		if (blobUrl) URL.revokeObjectURL(blobUrl);
		const blob = new Blob([buffer], { type: 'audio/wav' });
		blobUrl = URL.createObjectURL(blob);
		currentAudio = new Audio(blobUrl);
		currentAudio.onended = () => {
			status = 'idle';
		};
		currentAudio.play();
		status = 'playing';
	}

	function toggle() {
		if (status === 'playing') {
			currentAudio?.pause();
			currentAudio = null;
			status = 'idle';
			return;
		}
		status = 'loading_model';
		requestId = Date.now();
		getWorker().postMessage({ type: 'generate', text, id: requestId });
	}

	const labels: Record<Status, string> = {
		idle: '▶ Read aloud',
		loading_model: 'Loading model…',
		generating: 'Generating…',
		playing: '■ Stop',
		error: '⚠ Retry'
	};

	onDestroy(() => {
		currentAudio?.pause();
		if (blobUrl) URL.revokeObjectURL(blobUrl);
		worker?.terminate();
	});
</script>

<div class="tts">
	<button
		onclick={toggle}
		disabled={status === 'loading_model' || status === 'generating'}
		class:stop={status === 'playing'}
	>
		{labels[status]}
	</button>
	{#if status === 'error'}
		<span class="err">{errorMsg}</span>
	{/if}
</div>

<style>
	.tts {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	button {
		padding: 0.5rem 1.25rem;
		background: #4f46e5;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 13px;
		cursor: pointer;
		transition: background 0.15s;
	}

	button:hover:not(:disabled) {
		background: #4338ca;
	}

	button:disabled {
		opacity: 0.6;
		cursor: default;
	}

	button.stop {
		background: #dc2626;
	}

	button.stop:hover {
		background: #b91c1c;
	}

	.err {
		color: #f87171;
		font-size: 12px;
	}
</style>
