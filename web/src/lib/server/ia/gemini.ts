import { env } from '$env/dynamic/private';
import type { AiProvider, PedidoIa, RespostaIa } from './tipos';

/**
 * STUB — Fase 0. Gemini free, atrás da interface AiProvider.
 *
 * Está em $lib/server: o SvelteKit QUEBRA o build se algum código de cliente
 * importar este arquivo. A regra "a chave nunca vai ao cliente" deixa de
 * depender de disciplina e vira erro de compilação.
 */
export const provedorGemini: AiProvider = {
	nome: 'gemini',
	modelo: 'gemini-2.0-flash',

	async gerar(_pedido: PedidoIa): Promise<RespostaIa> {
		if (!env.GEMINI_API_KEY) {
			throw new Error(
				'GEMINI_API_KEY não definida em web/.env — pegue uma chave free em https://aistudio.google.com/apikey'
			);
		}
		throw new Error('Provedor Gemini ainda não implementado (stub da Fase 0).');
	}
};
