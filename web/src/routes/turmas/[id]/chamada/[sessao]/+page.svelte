<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let salvando = $state(false);

	const opcoes = [
		{ v: 'presente', rot: 'presente' },
		{ v: 'atraso', rot: 'atraso' },
		{ v: 'falta', rot: 'falta' }
	];

	const dataCurta = (iso: string) =>
		new Date(iso + 'T00:00').toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: '2-digit'
		});

	function aoSalvar() {
		salvando = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			salvando = false;
		};
	}
</script>

<svelte:head><title>Aula {data.sessao.numero} · {data.turma.name}</title></svelte:head>

<header class="topo">
	<a class="marca" href={resolve('/turmas/[id]/chamada', { id: data.turma.id })}>~/chamada</a>
	<nav class="topo-acoes">
		<a class="quieto" href={resolve('/turmas/[id]/chamada', { id: data.turma.id })}
			>todas as aulas</a
		>
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
	<h1 class="cabeca-dev">
		aula <span class="num">{data.sessao.numero}</span>
		<span class="quando num"
			>{dataCurta(data.sessao.data)}{data.sessao.periodo ? ` · ${data.sessao.periodo}` : ''}</span
		>
	</h1>

	{#if data.alunos.length}
		<form method="POST" action="?/salvar" use:enhance={aoSalvar}>
			<div class="barra">
				<span class="dica">Todos entram presentes — vire só os ausentes.</span>
				<button class="btn" type="submit" disabled={salvando}>
					{salvando ? 'salvando…' : 'salvar chamada'}
				</button>
			</div>

			{#if form?.salvo}
				<p class="ok" aria-live="polite">Chamada salva.</p>
			{:else if form?.erro}
				<p class="erro" role="alert" aria-live="polite">{form.erro}</p>
			{/if}

			<ul class="roster">
				{#each data.alunos as a (a.id)}
					<li class="linha">
						<span class="nome" id={`n-${a.id}`}>{a.nome}</span>
						<div class="seg" role="radiogroup" aria-labelledby={`n-${a.id}`}>
							{#each opcoes as o (o.v)}
								<label class="opt opt-{o.v}">
									<input type="radio" name={a.id} value={o.v} checked={a.status === o.v} />
									<span>{o.rot}</span>
								</label>
							{/each}
						</div>
					</li>
				{/each}
			</ul>
		</form>
	{:else}
		<p class="vazio">
			Ninguém entrou na turma ainda. Dê o código de convite na aula e volte para fazer a chamada.
		</p>
	{/if}
</main>

<style>
	.topo {
		display: flex;
		align-items: center;
		gap: 14px;
		max-width: 720px;
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
		max-width: 720px;
		margin: 0 auto;
		padding: 20px 20px 70px;
	}
	.cabeca-dev {
		display: flex;
		align-items: baseline;
		gap: 12px;
		font-size: var(--t26);
		font-weight: 700;
		margin-bottom: 18px;
	}
	.quando {
		font-size: var(--t145);
		font-weight: 400;
		color: var(--mut);
	}

	.barra {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		padding: 10px 0;
		background: var(--mesa);
		border-bottom: 1px solid var(--linha);
	}
	.dica {
		font-size: var(--t125);
		color: var(--mut);
	}
	.ok {
		color: var(--acc-tx);
		font-size: var(--t13);
		font-weight: 700;
		margin-top: 10px;
	}
	.erro {
		color: var(--caneta);
		font-size: var(--t13);
		margin-top: 10px;
	}

	.roster {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
	}
	.linha {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 9px 6px;
		border-bottom: 1px solid var(--linha);
	}
	.nome {
		font-size: var(--t15);
		font-weight: 600;
	}

	/* Controle segmentado: rádio nativo escondido, o label é o botão. */
	.seg {
		display: inline-flex;
		border: var(--bw) solid var(--linha);
		border-radius: calc(var(--raio) - 2px);
		overflow: hidden;
	}
	.opt {
		position: relative;
		cursor: pointer;
	}
	.opt + .opt {
		border-left: 1px solid var(--linha);
	}
	.opt input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}
	.opt span {
		display: block;
		padding: 6px 12px;
		font-size: var(--t125);
		color: var(--mut);
		transition:
			background var(--mov-toque),
			color var(--mov-toque);
	}
	.opt:hover span {
		color: var(--tinta);
	}
	/* Selecionado: cor SEMÂNTICA, não âmbar (âmbar é só do botão de ação). */
	.opt-presente:has(input:checked) span {
		background: color-mix(in srgb, var(--tinta) 8%, transparent);
		color: var(--tinta);
		font-weight: 700;
	}
	.opt-atraso:has(input:checked) span {
		background: color-mix(in srgb, var(--acc-tx) 15%, transparent);
		color: var(--acc-tx);
		font-weight: 700;
	}
	.opt-falta:has(input:checked) span {
		background: color-mix(in srgb, var(--caneta) 15%, transparent);
		color: var(--caneta);
		font-weight: 700;
	}
	/* Foco por teclado no rádio escondido acende o label. */
	.opt:has(input:focus-visible) {
		outline: 2px solid var(--foco);
		outline-offset: 1px;
		border-radius: 4px;
	}

	.vazio {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid var(--linha);
		color: var(--mut);
		font-size: var(--t135);
	}
</style>
