import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	/* Defesa em profundidade (BLUEPRINT §4.4): a camada server barra no código,
	   além da RLS barrar no banco. RLS nunca é a única barreira. */
	const { user } = await locals.sessaoSegura();
	if (!user) redirect(303, '/entrar');

	const { data: perfil } = await locals.supabase
		.from('profiles')
		.select('full_name, xp, level, streak')
		.eq('id', user.id)
		.single();

	return {
		nome: perfil?.full_name ?? user.email,
		xp: perfil?.xp ?? 0,
		nivel: perfil?.level ?? 1
	};
};
