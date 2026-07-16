<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let enviando = $state(false);

	const docente = $derived(
		data.papel === 'professor' || data.papel === 'coordenador' || data.papel === 'admin'
	);

	// O valor re-exibido no erro só existe em alguns braços da ActionData; lê num
	// tipo frouxo para não quebrar o input controlado.
	const nomeReenviado = $derived((form as { nome?: string } | null)?.nome ?? '');
	const codigoReenviado = $derived((form as { codigo?: string } | null)?.codigo ?? '');

	// Enche o botão de "enviando" e devolve o padrão do enhance (aplica o
	// resultado + recarrega a lista no sucesso).
	function aoEnviar() {
		enviando = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			enviando = false;
		};
	}
</script>

<svelte:head><title>Turmas · Celeste</title></svelte:head>

<header class="topo">
	{#if docente}
		<a class="marca" href={resolve('/')}>~/celeste</a>
	{:else}
		<a class="marca marca-caderno" href={resolve('/')}><span class="lua"></span> Celeste</a>
	{/if}
	<nav class="topo-acoes">
		<a class="quieto" href={resolve('/')}>início</a>
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

{#if docente}
	<!-- ============================ Professor / Dev ============================ -->
	<main class="dev">
		<h1 class="cabeca-dev">turmas</h1>
		<p class="sub">
			Cada turma tem um código. Você escreve no quadro; a turma entra sozinha na primeira aula.
		</p>

		<form class="criar" method="POST" action="?/criar" use:enhance={aoEnviar}>
			<input
				name="nome"
				placeholder="Jogos Digitais 2026/1 — Manhã"
				aria-label="nome da nova turma"
				autocomplete="off"
				required
				value={nomeReenviado}
			/>
			<button class="btn" type="submit" disabled={enviando}>
				{enviando ? 'criando…' : 'criar'}
			</button>
		</form>

		{#if form?.criarErro}
			<p class="erro" role="alert" aria-live="polite">{form.criarErro}</p>
		{:else if form?.criada}
			<p class="ok" aria-live="polite">Turma “{form.criada}” criada.</p>
		{/if}

		{#if data.turmas.length}
			<ul class="lista-dev">
				{#each data.turmas as t (t.id)}
					<li>
						<a class="linha-dev" href={resolve('/turmas/[id]', { id: t.id })}>
							<span class="nome-dev">{t.name}</span>
							<span class="cod num">{t.codigo}</span>
							<span class="cont num">{t.alunos} {t.alunos === 1 ? 'aluno' : 'alunos'}</span>
							<span class="seta" aria-hidden="true">→</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="vazio-dev">Sua primeira turma aparece aqui.</p>
		{/if}
	</main>
{:else}
	<!-- ============================ Aluno / Caderno ============================ -->
	<main class="caderno">
		<div class="folha caixa">
			<div class="folha-in">
				<h1 class="titulo">Minhas <span class="grifo">turmas</span></h1>

				<form class="entrar" method="POST" action="?/entrar" use:enhance={aoEnviar}>
					<label for="codigo">entrar numa turma</label>
					<div class="entrar-linha">
						<input
							id="codigo"
							name="codigo"
							placeholder="código"
							autocomplete="off"
							autocapitalize="characters"
							spellcheck="false"
							required
							value={codigoReenviado}
						/>
						<button class="btn" type="submit" disabled={enviando}>
							{enviando ? 'entrando…' : 'entrar'}
						</button>
					</div>
				</form>

				{#if form?.entrarErro}
					<p class="erro" role="alert" aria-live="polite">{form.entrarErro}</p>
				{:else if form?.entrou}
					<p class="ok" aria-live="polite">Você entrou em {form.entrou}.</p>
				{:else}
					<p class="dica">Cole o código que o professor passou no quadro.</p>
				{/if}

				{#if data.minhas.length}
					<ul class="lista-aluno">
						{#each data.minhas as t (t.id)}
							<li>{t.name}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</main>
{/if}

<style>
	/* ---- topo, comum às duas skins ---- */
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
	.marca-caderno {
		color: var(--mut);
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

	/* ================================ Dev ================================ */
	.dev {
		max-width: 780px;
		margin: 0 auto;
		padding: 20px 20px 70px;
	}
	.cabeca-dev {
		font-size: var(--t26);
		font-weight: 700;
		margin-bottom: 4px;
	}
	.sub {
		color: var(--mut);
		font-size: var(--t135);
		max-width: 60ch;
		margin-bottom: 22px;
	}
	.criar {
		display: flex;
		gap: 8px;
		margin-bottom: 6px;
	}
	.criar input {
		flex: 1;
		min-width: 0;
		padding: 9px 11px;
		font: inherit;
		font-size: var(--t14);
		color: var(--tinta);
		background: var(--folha);
		border: var(--bw) solid var(--linha);
		border-radius: calc(var(--raio) - 3px);
	}

	.lista-dev {
		list-style: none;
		margin: 22px 0 0;
		padding: 0;
		border-top: 1px solid var(--linha);
	}
	.linha-dev {
		display: grid;
		grid-template-columns: 1fr auto auto 18px;
		align-items: center;
		gap: 18px;
		padding: 13px 6px;
		border-bottom: 1px solid var(--linha);
		text-decoration: none;
		color: var(--tinta);
		transition: background var(--mov-toque);
	}
	.linha-dev:hover {
		background: color-mix(in srgb, var(--tinta) 5%, transparent);
	}
	.nome-dev {
		font-size: var(--t15);
		font-weight: 600;
	}
	.cod {
		font-size: var(--t14);
		letter-spacing: 0.14em;
		color: var(--mut);
	}
	.cont {
		font-size: var(--t125);
		color: var(--mut);
		white-space: nowrap;
	}
	.seta {
		color: var(--mut);
		text-align: right;
	}
	.vazio-dev {
		margin-top: 22px;
		padding-top: 18px;
		border-top: 1px solid var(--linha);
		color: var(--mut);
		font-size: var(--t135);
	}

	/* ================================ Caderno ================================ */
	.caderno {
		min-height: 70vh;
		display: grid;
		place-items: start center;
		padding: 26px 20px 70px;
	}
	.caixa {
		width: 100%;
		max-width: 440px;
	}
	.titulo {
		margin-bottom: 20px;
	}
	label {
		display: block;
		font-size: var(--t13);
		color: var(--mut);
		margin-bottom: 6px;
	}
	.entrar-linha {
		display: flex;
		gap: 8px;
	}
	.entrar input {
		flex: 1;
		min-width: 0;
		padding: 9px 11px;
		font-family: var(--mono);
		font-size: var(--t15);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tinta);
		background: var(--folha);
		border: var(--bw) solid var(--linha);
		border-radius: calc(var(--raio) - 3px);
	}
	.dica {
		margin-top: 10px;
		font-size: var(--t125);
		color: var(--mut);
	}
	.lista-aluno {
		list-style: none;
		margin: 22px 0 0;
		padding: 18px 0 0;
		border-top: 1px dashed var(--linha);
	}
	.lista-aluno li {
		padding: 7px 0;
		font-size: var(--t15);
		color: var(--tinta);
	}
	.lista-aluno li + li {
		border-top: 1px dashed var(--linha);
	}
</style>
