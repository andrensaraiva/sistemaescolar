<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const dataCurta = (iso: string) =>
		new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
</script>

<svelte:head><title>{data.turma.name} · Celeste</title></svelte:head>

<header class="topo">
	<a class="marca" href={resolve('/turmas')}>~/turmas</a>
	<nav class="topo-acoes">
		<a class="quieto" href={resolve('/turmas')}>todas as turmas</a>
		<form method="POST" action="/modo">
			<input type="hidden" name="modo" value={data.modo === 'escuro' ? 'claro' : 'escuro'} />
			<input type="hidden" name="voltar" value={page.url.pathname} />
			<button class="btn btn-quieto" type="submit"
				>{data.modo === 'escuro' ? 'claro' : 'escuro'}</button
			>
		</form>
		<form method="POST" action="/sair">
			<button class="btn btn-quieto" type="submit">sair</button>
		</form>
	</nav>
</header>

<main class="dev">
	<h1 class="cabeca-dev">{data.turma.name}</h1>

	<section class="codigo-bloco">
		<div class="codigo-txt">
			<span class="rotulo">código de convite</span>
			<strong class="codigo num">{data.turma.codigo}</strong>
		</div>
		<form method="POST" action="?/regenerar" use:enhance>
			<button class="btn" type="submit">regenerar</button>
		</form>
	</section>
	{#if form && 'erro' in form && form.erro}
		<p class="erro" role="alert" aria-live="polite">{form.erro}</p>
	{:else if form && 'novoCodigo' in form && form.novoCodigo}
		<p class="ok" aria-live="polite">Código atualizado. O anterior parou de funcionar.</p>
	{/if}

	<nav class="acoes-turma">
		<a class="acao" href={resolve('/turmas/[id]/chamada', { id: data.turma.id })}>fazer chamada →</a
		>
	</nav>

	<h2 class="cabeca-lista">
		alunos <span class="num tot">{data.alunos.length}</span>
	</h2>

	{#if data.alunos.length}
		<ul class="lista">
			{#each data.alunos as a (a.id)}
				<li class="linha">
					<span class="nome">{a.nome}</span>
					<span class="desde num">entrou {dataCurta(a.desde)}</span>
					<form method="POST" action="?/remover" use:enhance>
						<input type="hidden" name="aluno" value={a.id} />
						<button class="remover" type="submit" aria-label={`remover ${a.nome}`}>remover</button>
					</form>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="vazio">
			Ninguém entrou ainda. Dite o código <strong class="num">{data.turma.codigo}</strong> na próxima
			aula.
		</p>
	{/if}
</main>

<style>
	.topo {
		display: flex;
		align-items: center;
		gap: 14px;
		max-width: 780px;
		margin: 0 auto;
		padding: 22px 20px 0;
	}
	.marca {
		text-decoration: none;
		color: var(--tinta);
	}
	.topo-acoes {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.quieto {
		font-size: var(--t13);
		color: var(--mut);
		text-decoration: none;
	}
	.quieto:hover {
		color: var(--tinta);
	}

	.dev {
		max-width: 780px;
		margin: 0 auto;
		padding: 20px 20px 70px;
	}
	.cabeca-dev {
		font-size: var(--t26);
		font-weight: 700;
		margin-bottom: 20px;
	}

	.codigo-bloco {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 18px;
		background: var(--folha);
		border: var(--bw) solid var(--linha);
		border-radius: var(--raio);
	}
	.codigo-txt {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.rotulo {
		font-size: var(--t12);
		color: var(--mut);
	}
	.codigo {
		font-size: var(--t38);
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.22em;
		color: var(--tinta);
	}

	.acoes-turma {
		margin-top: 20px;
	}
	.acao {
		font-size: var(--t145);
		font-weight: 700;
		color: var(--acc-tx);
		text-decoration: none;
	}
	.acao:hover {
		text-decoration: underline;
	}

	.cabeca-lista {
		display: flex;
		align-items: baseline;
		gap: 8px;
		font-size: var(--t17);
		font-weight: 700;
		margin: 30px 0 0;
	}
	.tot {
		font-size: var(--t14);
		color: var(--mut);
	}

	.lista {
		list-style: none;
		margin: 14px 0 0;
		padding: 0;
		border-top: 1px solid var(--linha);
	}
	.linha {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		gap: 16px;
		padding: 12px 6px;
		border-bottom: 1px solid var(--linha);
	}
	.nome {
		font-size: var(--t15);
		font-weight: 600;
	}
	.desde {
		font-size: var(--t125);
		color: var(--mut);
		white-space: nowrap;
	}
	.remover {
		background: none;
		border: none;
		padding: 4px 6px;
		font-size: var(--t125);
		color: var(--mut);
		cursor: pointer;
		border-radius: 5px;
		transition: color var(--mov-toque);
	}
	.remover:hover {
		color: var(--caneta);
	}

	.vazio {
		margin-top: 14px;
		padding-top: 16px;
		border-top: 1px solid var(--linha);
		color: var(--mut);
		font-size: var(--t135);
	}
	.vazio .num {
		letter-spacing: 0.14em;
		color: var(--tinta);
	}

	.erro {
		color: var(--caneta);
		font-size: var(--t13);
		margin-top: 10px;
	}
	.ok {
		color: var(--acc-tx);
		font-size: var(--t13);
		font-weight: 700;
		margin-top: 10px;
	}
</style>
