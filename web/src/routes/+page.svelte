<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const outroModo = $derived(data.modo === 'escuro' ? 'claro' : 'escuro');
</script>

<svelte:head><title>Celeste</title></svelte:head>

<main>
	<header>
		<p class="marca"><span class="lua"></span>{data.skin === 'dev' ? '~/celeste' : 'Celeste'}</p>

		<div class="dir">
			<form method="POST" action="/modo">
				<input type="hidden" name="modo" value={outroModo} />
				<input type="hidden" name="voltar" value={page.url.pathname} />
				<button class="btn btn-quieto" type="submit">{outroModo}</button>
			</form>
			<form method="POST" action="/sair">
				<button class="btn btn-quieto" type="submit">sair</button>
			</form>
		</div>
	</header>

	<div class="folha">
		<div class="folha-in">
			<h1 class="titulo">Olá, <span class="grifo">{data.nome}</span></h1>

			<p class="enunciado">
				A fundação está de pé. Ainda não existe turma, UC nem atividade — e enquanto não existirem,
				esta tela não vai fingir que existem.
			</p>

			<dl class="estado">
				<div>
					<dt>papel</dt>
					<dd>{data.papel ?? '—'}</dd>
				</div>
				<div>
					<dt>skin</dt>
					<dd>{data.skin}</dd>
				</div>
				<div>
					<dt>modo</dt>
					<dd>{data.modo}</dd>
				</div>
				<div>
					<dt>nível</dt>
					<dd class="num">{data.nivel}</dd>
				</div>
				<div>
					<dt>xp</dt>
					<dd class="num">{data.xp}</dd>
				</div>
			</dl>
		</div>
	</div>
</main>

<style>
	main {
		max-width: 780px;
		margin: 0 auto;
		padding: 22px 20px 70px;
	}
	header {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 24px;
	}
	.dir {
		margin-left: auto;
		display: flex;
		gap: 8px;
	}
	.titulo {
		margin-bottom: 14px;
	}
	.enunciado {
		max-width: 62ch;
		color: var(--mut);
		margin-bottom: 24px;
	}
	.estado {
		display: flex;
		flex-wrap: wrap;
		gap: 26px;
		margin: 0;
		padding-top: 18px;
		border-top: 1px dashed var(--linha);
	}
	dt {
		font-size: var(--t12);
		color: var(--mut);
		margin-bottom: 2px;
	}
	dd {
		margin: 0;
		font-size: var(--t15);
		font-weight: 700;
	}
</style>
