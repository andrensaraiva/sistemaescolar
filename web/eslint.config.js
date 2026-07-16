import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			// `_pedido` marca parâmetro que existe pelo contrato mas o stub ainda
			// não usa. Sem isto, o jeito de calar o lint seria apagar o parâmetro —
			// e aí some a assinatura que documenta a interface.
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				// Sem `parser`, o eslint-plugin-svelte lê <script lang="ts"> como JS
				// puro e engasga no primeiro tipo ("Unexpected token {").
				parser: ts.parser,
				projectService: true,
				extraFileExtensions: ['.svelte']
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', '.vercel/', 'dist/', 'node_modules/']
	}
);
