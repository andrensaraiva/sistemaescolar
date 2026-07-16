/** Execução de código sem Docker em produção — BLUEPRINT §6, SISTEMAS.md §14.
    O TIPO DE ATIVIDADE declara qual runner usa; nenhuma tela decide isso. */

export type NomeRunner = 'nenhum' | 'piston' | 'navegador';

export type PedidoExecucao = {
	linguagem: string;
	fonte: string;
	entrada?: string;
	casos?: readonly CasoDeTeste[];
};

export type CasoDeTeste = {
	entrada: string;
	saidaEsperada: string;
	/** Caso oculto só roda na correção final; o aluno não vê antes. */
	oculto: boolean;
};

export type ResultadoExecucao =
	| { situacao: 'sem-execucao'; motivo: string }
	| { situacao: 'ok'; saida: string; casos: ResultadoCaso[] }
	| { situacao: 'erro'; saida: string; erro: string }
	/** Piston é free e tem rate limit: degradar com graça é requisito, não extra. */
	| { situacao: 'indisponivel'; motivo: string };

export type ResultadoCaso = {
	passou: boolean;
	entrada: string;
	esperada: string;
	obtida: string;
	oculto: boolean;
};

export interface CodeRunner {
	readonly nome: NomeRunner;
	rodar(pedido: PedidoExecucao): Promise<ResultadoExecucao>;
}
