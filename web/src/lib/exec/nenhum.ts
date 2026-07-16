import type { CodeRunner, ResultadoExecucao } from './tipos';

/**
 * O runner que não roda nada — e não é um stub: é o primeiro runner de verdade.
 *
 * Pseudocódigo não precisa executar. Declarando `runner: 'nenhum'`, o tipo de
 * atividade exercita o motor INTEIRO (editor, player, entrega, correção, nota,
 * XP, antifraude, fila) sem encostar no maior risco técnico do projeto — 100+
 * alunos batendo no Piston público às 07:15 da mesma aula.
 *
 * Isso não é caso especial: é o CodeRunner plugável fazendo o que foi desenhado
 * para fazer. Um dos runners é nenhum. SISTEMAS.md §14.
 */
export const runnerNenhum: CodeRunner = {
	nome: 'nenhum',
	async rodar(): Promise<ResultadoExecucao> {
		return {
			situacao: 'sem-execucao',
			motivo: 'Este tipo de atividade não executa código: a correção é humana.'
		};
	}
};
