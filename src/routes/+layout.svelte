<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	let { children }: { children: Snippet } = $props();
</script>

<header>
	<nav>
		<a href="/" class="brand">Browser Bullets</a>
		<div class="links">
			<a href="/" class:active={page.url.pathname === '/'}>Summarize</a>
			<a href="/urls" class:active={page.url.pathname === '/urls'}>URLs</a>
		</div>
	</nav>
</header>

{@render children()}

<style>
	:global(body) {
		margin: 0;
		background: #1a1a2e;
		font-family: system-ui, sans-serif;
	}

	header {
		border-bottom: 1px solid #333;
		background: #161b22;
	}

	nav {
		max-width: 640px;
		margin: 0 auto;
		padding: 0 1rem;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.brand {
		font-weight: 700;
		font-size: 15px;
		color: #a78bfa;
		text-decoration: none;
	}

	.links {
		display: flex;
		gap: 1.5rem;
	}

	.links a {
		color: #a0a0b0;
		text-decoration: none;
		font-size: 14px;
	}

	.links a:hover {
		color: #e0e0e0;
	}

	.links a.active {
		color: #a78bfa;
	}
</style>
