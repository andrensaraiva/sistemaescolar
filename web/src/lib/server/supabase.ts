import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import type { RequestEvent } from '@sveltejs/kit';

/** Erro em PT-BR, específico, com saída — CLAUDE.md §2.16. */
const SEM_CONFIG = `Supabase não configurado.
Defina PUBLIC_SUPABASE_URL e PUBLIC_SUPABASE_ANON_KEY em web/.env.
Para o ambiente local: rode "npm run db:start" e copie a API URL e a anon key que ele imprime.`;

export function clienteSupabase(event: RequestEvent) {
	const url = env.PUBLIC_SUPABASE_URL;
	const anon = env.PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anon) throw new Error(SEM_CONFIG);

	return createServerClient(url, anon, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (lista) => {
				for (const { name, value, options } of lista) {
					event.cookies.set(name, value, { ...options, path: '/' });
				}
			}
		}
	});
}
