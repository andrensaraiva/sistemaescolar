<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/ui/tokens.css';
	import '$lib/ui/base.css';
	import '$lib/ui/primitivos.css';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	/* O servidor escreve data-skin e a classe do modo no <html> (hooks.server.ts),
	   e é ele quem evita o flash no primeiro load. Mas numa navegação client-side
	   — o professor entra e o `use:enhance` leva pra / sem recarregar — o <html>
	   não passa mais pelo servidor. Sem isto, ele logaria e continuaria vendo a
	   skin Caderno até dar refresh. Mantemos o <html> em sincronia com a mesma
	   verdade (data.skin/data.modo vêm do +layout.server.ts). O $effect só roda no
	   browser; na hidratação ele reafirma o valor que já veio do SSR, sem flash. */
	$effect(() => {
		document.documentElement.dataset.skin = data.skin;
		document.documentElement.classList.toggle('escuro', data.modo === 'escuro');
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
