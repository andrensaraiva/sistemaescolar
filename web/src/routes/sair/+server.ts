import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/* POST, nunca GET: sair por link seria disparado por qualquer prefetch. */
export const POST: RequestHandler = async ({ locals }) => {
	await locals.supabase.auth.signOut();
	redirect(303, '/entrar');
};
