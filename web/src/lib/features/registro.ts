import type { Papel } from '$lib/ui/skin';

/**
 * O registro de features (BLUEPRINT §4.3).
 *
 * Uma feature depende só de: auth, db, kit de UI e este registro.
 * FEATURE NÃO IMPORTA FEATURE — foi o que travou o sistema antigo: remover uma
 * feature exigia limpar links cruzados na mão. Se a feature A precisa aparecer
 * dentro da B, ela se registra aqui e a B lê o registro; a B nunca importa a A.
 */
export type Feature = {
	id: string;
	nome: string;
	/** Quem enxerga. Cada papel só vê seus menus; URL fora do escopo é bloqueada
	    no servidor — isto aqui é navegação, não é a barreira de segurança. */
	papeis: readonly Papel[];
	rota: string;
};

const features = new Map<string, Feature>();

export function registrarFeature(f: Feature): void {
	if (features.has(f.id)) {
		throw new Error(`Feature duplicada: "${f.id}".`);
	}
	features.set(f.id, f);
}

export function featuresDoPapel(papel: Papel | null): Feature[] {
	if (!papel) return [];
	return [...features.values()].filter((f) => f.papeis.includes(papel));
}

export function limparFeatures(): void {
	features.clear();
}
