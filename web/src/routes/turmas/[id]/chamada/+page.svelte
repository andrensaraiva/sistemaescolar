<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const hoje = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, para o <input type=date>
	const dataCurta = (iso: string) =>
		new Date(iso + 'T00:00').toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: '2-digit'
		});
</script>

<svelte:head><title>Chamada · {data.turma.name}</title></svelte:head>

<header class="topo">
	<a class="marca" href={resolve('/turmas/[id]', { id: data.turma.id })}>~/turmas</a>
	<nav class="topo-acoes">
		<a class="quieto" href={resolve('/turmas/[id]', { id: data.turma.id })}>a turma</a>
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
	<h1 class="cabeca-dev">chamada · {data.turma.name}</h1>
	<p class="sub">Uma aula por chamada. Atraso conta como presença; alimenta o radar sem punir.</p>

	<form class="nova" method="POST" action="?/criarAula" use:enhance>
		<label class="campo">
			<span>data</span>
			<input type="date" name="data" value={hoje} max={hoje} />
		</label>
		<label class="campo">
			<span>período</span>
			<select name="periodo">
				<option value="">—</option>
				<option value="manhã">manhã</option>
				<option value="tarde">tarde</option>
				<option value="noite">noite</option>
			</select>
		</label>
		<button class="btn" type="submit">abrir aula</button>
	</form>

	{#if form?.erro}
		<p class="erro" role="alert" aria-live="polite">{form.erro}</p>
	{/if}

	{#if data.sessoes.length}
		<ul class="lista-dev">
			{#each data.sessoes as s (s.id)}
				<li>
					<a
						class="linha-dev"
						href={resolve('/turmas/[id]/chamada/[sessao]', { id: data.turma.id, sessao: s.id })}
					>
						<span class="aula">aula <span class="num">{s.numero}</span></span>
						<span class="quando num">{dataCurta(s.data)}{s.periodo ? ` · ${s.periodo}` : ''}</span>
						<span class="resumo">
							{#if !s.marcada}
								<span class="pend">pendente</span>
							{:else if s.faltas > 0}
								<span class="num falta">{s.faltas}</span>
								{s.faltas === 1 ? 'falta' : 'faltas'}{s.atrasos ? `, ${s.atrasos} atr.` : ''}
							{:else}
								<span class="ok">todos presentes</span>
							{/if}
						</span>
						<span class="seta" aria-hidden="true">→</span>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="vazio-dev">Nenhuma aula ainda. Abra a primeira acima.</p>
	{/if}
</main>

<style>
	.topo {
		display: flex;
		align-items: center;
		gap: 14px;
		max-width: 760px;
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
		max-width: 760px;
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
		margin-bottom: 22px;
	}

	.nova {
		display: flex;
		align-items: flex-end;
		gap: 12px;
		flex-wrap: wrap;
	}
	.campo {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: var(--t12);
		color: var(--mut);
	}
	.campo input,
	.campo select {
		font: inherit;
		font-size: var(--t14);
		color: var(--tinta);
		background: var(--folha);
		border: var(--bw) solid var(--linha);
		border-radius: calc(var(--raio) - 3px);
		padding: 8px 10px;
	}

	.erro {
		color: var(--caneta);
		font-size: var(--t13);
		margin-top: 10px;
	}

	.lista-dev {
		list-style: none;
		margin: 26px 0 0;
		padding: 0;
		border-top: 1px solid var(--linha);
	}
	.linha-dev {
		display: grid;
		grid-template-columns: auto 1fr auto 18px;
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
	.aula {
		font-size: var(--t15);
		font-weight: 600;
	}
	.quando {
		font-size: var(--t125);
		color: var(--mut);
	}
	.resumo {
		font-size: var(--t125);
		color: var(--mut);
		white-space: nowrap;
	}
	.falta {
		color: var(--caneta);
		font-weight: 700;
	}
	.pend {
		color: var(--acc-tx);
		font-weight: 700;
	}
	.ok {
		color: var(--mut);
	}
	.seta {
		color: var(--mut);
		text-align: right;
	}
	.vazio-dev {
		margin-top: 26px;
		padding-top: 18px;
		border-top: 1px solid var(--linha);
		color: var(--mut);
		font-size: var(--t135);
	}
</style>
