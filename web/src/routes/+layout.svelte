<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/ui/tokens.css';
	import '$lib/ui/base.css';
	import '$lib/ui/primitivos.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
