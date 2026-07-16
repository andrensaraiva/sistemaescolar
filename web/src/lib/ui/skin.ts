/* A skin é resolvida por PAPEL, nunca escolhida pelo instrutor — CLAUDE.md §3.
   O modo (claro/escuro) é do usuário. Nunca duas skins na tela ao mesmo tempo:
   o professor vê tudo em Dev, inclusive preview de atividade. */

export type Papel = 'aluno' | 'professor' | 'coordenador' | 'admin';
export type Skin = 'caderno' | 'dev';
export type Modo = 'claro' | 'escuro';

export const COOKIE_MODO = 'celeste_modo';

/** Aluno escreve num caderno; quem trabalha na plataforma usa a Dev. */
export function skinDoPapel(papel: Papel | null): Skin {
	// Deslogado cai no Caderno: é a cara pública do produto, e a maioria é aluno.
	if (papel === null) return 'caderno';
	return papel === 'aluno' ? 'caderno' : 'dev';
}

/** O padrão tem função, não é preferência: o instrutor trabalha no escuro e
    imprime no claro (Dev claro = o modo documento). DESIGN.md §1. */
export function modoPadrao(skin: Skin): Modo {
	return skin === 'dev' ? 'escuro' : 'claro';
}

export function ehModo(v: unknown): v is Modo {
	return v === 'claro' || v === 'escuro';
}

/** A classe que o <html> recebe. Claro é a ausência de classe. */
export function classeDoModo(modo: Modo): string {
	return modo === 'escuro' ? 'escuro' : '';
}
