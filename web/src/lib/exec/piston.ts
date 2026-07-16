import type { CodeRunner, PedidoExecucao, ResultadoExecucao } from './tipos';

/**
 * STUB — Fase 0. O Piston entra como SEGUNDO runner, depois do teste de carga e
 * com o motor já provado ao lado (SISTEMAS.md §14). Só a UC de Jogos (C#) precisa
 * dele: C# não roda no navegador.
 *
 * Quando for implementado, o que não pode faltar (BLUEPRINT §6):
 *   - fila server-side (o rate limit é por IP, e a turma inteira é um IP só);
 *   - cache por (fonte, casos de teste) — 100 alunos rodando o mesmo exemplo
 *     do slide é uma chamada, não 100;
 *   - degradação graciosa: 'indisponivel' é um resultado previsto, não um erro.
 */
export const runnerPiston: CodeRunner = {
	nome: 'piston',
	async rodar(_pedido: PedidoExecucao): Promise<ResultadoExecucao> {
		return {
			situacao: 'indisponivel',
			motivo: 'O runner Piston ainda não foi implementado (previsto para a fatia de C#).'
		};
	}
};
