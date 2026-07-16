import type { Papel } from '$lib/ui/skin';

/** Os usos de IA que existem. Todos voltados a ADULTO — CLAUDE.md §2.10. */
export type UsoDeIa = 'importar-ppc' | 'gerar-exercicio' | 'sugerir-feedback';

/**
 * Quem pode pedir cada uso.
 *
 * Esta tabela É a Lei 10 ("a IA nunca fala com o aluno"). Repare que 'aluno' não
 * aparece em nenhuma linha — e o gateway só chama o modelo para papel que esteja
 * aqui. Não é um filtro de conteúdo tentando adivinhar o que o modelo disse
 * (isso falha); é a porta não existir.
 *
 * Consequência prática: abrir um caminho IA→aluno exige alguém digitar 'aluno'
 * nesta tabela. É de propósito — é o arame de tropeço, e ele fica no diff.
 */
export const QUEM_PODE: Record<UsoDeIa, readonly Papel[]> = {
	'importar-ppc': ['admin'],
	'gerar-exercicio': ['professor', 'coordenador', 'admin'],
	'sugerir-feedback': ['professor', 'coordenador', 'admin']
} as const;

export type PedidoIa = {
	uso: UsoDeIa;
	prompt: string;
	/** Quem está pedindo. Sem isso o gateway recusa: não existe chamada anônima. */
	papel: Papel | null;
	usuarioId: string | null;
};

export type RespostaIa = {
	texto: string;
	provedor: string;
	modelo: string;
};

/**
 * Trocar Gemini por outro provedor = escrever outro arquivo com esta interface e
 * mudar uma linha no gateway. BLUEPRINT §4.7.
 */
export interface AiProvider {
	readonly nome: string;
	readonly modelo: string;
	gerar(pedido: PedidoIa): Promise<RespostaIa>;
}

export class IaRecusada extends Error {
	constructor(motivo: string) {
		super(motivo);
		this.name = 'IaRecusada';
	}
}
