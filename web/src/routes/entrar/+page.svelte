<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let enviando = $state(false);
</script>

<svelte:head><title>Entrar · Celeste</title></svelte:head>

<main>
	<div class="folha caixa">
		<div class="folha-in">
			<p class="marca"><span class="lua"></span> Celeste</p>
			<h1 class="titulo">Entrar</h1>

			<form
				method="POST"
				use:enhance={() => {
					enviando = true;
					return async ({ update }) => {
						await update();
						enviando = false;
					};
				}}
			>
				<label for="email">e-mail</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="username"
					required
					value={form?.email ?? ''}
				/>

				<label for="senha">senha</label>
				<input id="senha" name="senha" type="password" autocomplete="current-password" required />

				{#if form?.erro}
					<!-- aria-live: quem usa leitor de tela precisa saber que falhou -->
					<p class="erro" role="alert" aria-live="polite">{form.erro}</p>
				{/if}

				<button class="btn" type="submit" disabled={enviando}>
					{enviando ? 'entrando…' : 'entrar'}
				</button>
			</form>

			<p class="nota">
				Não existe cadastro aberto: sua conta é criada pela escola, e você entra na turma pelo
				código que o professor passa em aula.
			</p>
		</div>
	</div>
</main>

<style>
	main {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 24px;
	}
	.caixa {
		width: 100%;
		max-width: 380px;
	}
	.marca {
		color: var(--mut);
		font-size: var(--t21);
		margin-bottom: 4px;
	}
	.titulo {
		margin-bottom: 20px;
	}
	label {
		display: block;
		font-size: var(--t13);
		color: var(--mut);
		margin-bottom: 5px;
	}
	input {
		width: 100%;
		margin-bottom: 15px;
		padding: 9px 11px;
		font: inherit;
		font-size: var(--t14);
		color: var(--tinta);
		background: var(--folha);
		border: var(--bw) solid var(--linha);
		border-radius: calc(var(--raio) - 3px);
	}
	.erro {
		color: var(--caneta);
		font-size: var(--t13);
		margin-bottom: 12px;
	}
	.btn {
		width: 100%;
	}
	.nota {
		margin-top: 18px;
		font-size: var(--t125);
		color: var(--mut);
		line-height: 1.5;
	}
</style>
