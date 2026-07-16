import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
// De 'vitest/config', não de 'vite': é o que tipa a chave `test` abaixo.
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Vercel Hobby é o free tier nomeado no BLUEPRINT §4. Trocar de host = trocar
			// este adapter; nada mais do app depende dele.
			adapter: adapter()
		})
	],
	test: {
		// Regras puras (unit). O fluxo ponta-a-ponta é do Playwright (e2e/), e é a
		// regra de ouro do SISTEMAS.md: nenhuma fatia é pronta sem 1 e2e.
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node'
	}
});
