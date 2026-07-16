import type { ZodType } from 'zod';
import type { NomeRunner } from '$lib/exec/tipos';

/**
 * O registro de tipos de atividade — o contrato do motor modular (BLUEPRINT §2,
 * SISTEMAS.md §6). Adicionar um tipo = registrar um módulo, sem tocar em nenhuma
 * tela existente.
 *
 * A regra que o sistema antigo já tinha e é para manter: NENHUMA TELA COMPARA
 * TIPO POR STRING. Se apareceu `if (tipo === 'codigo')` numa tela, o registro
 * está faltando um campo — é lá que a resposta deve morar.
 */

/** Prática é ilimitada: errar é de graça, e é assim que se aprende a programar.
    Prova/boss é uma tentativa, lockdown. Decidido — SISTEMAS.md §6. */
export type PoliticaTentativas = 'ilimitada' | 'uma';

export type TipoDeAtividade<Entrega = unknown> = {
	/** Estável: vai para o banco em assignments.kind. Não renomear. */
	id: string;
	nome: string;
	/** Schema da entrega, validado no registro — submissions guarda JSONB. */
	schemaEntrega: ZodType<Entrega>;
	runner: NomeRunner;
	tentativas: PoliticaTentativas;
	/** XP cheio no acerto, SEM decaimento por tentativa: punir tentativa é punir
	    o método de aprender. Contra força bruta agem o antifraude e a prova. */
	xpNoAcerto: number;
	/** Correção automática existe? Quando não, o clímax é o RETORNO, não a
	    entrega — o aluno não está lá quando você corrige (DESIGN.md §4). */
	corrigeSozinho: boolean;
};

const tipos = new Map<string, TipoDeAtividade<unknown>>();

export function registrarTipo<E>(tipo: TipoDeAtividade<E>): void {
	if (tipos.has(tipo.id)) {
		throw new Error(`Tipo de atividade duplicado: "${tipo.id}".`);
	}
	tipos.set(tipo.id, tipo as TipoDeAtividade<unknown>);
}

export function obterTipo(id: string): TipoDeAtividade<unknown> | undefined {
	return tipos.get(id);
}

export function listarTipos(): TipoDeAtividade<unknown>[] {
	return [...tipos.values()];
}

/** Só para teste: o registro é global por processo. */
export function limparRegistro(): void {
	tipos.clear();
}
