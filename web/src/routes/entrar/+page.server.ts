import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.sessaoSegura();
	if (user) redirect(303, '/');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const senha = String(form.get('senha') ?? '');

		if (!email || !senha) {
			return fail(400, { email, erro: 'Preencha e-mail e senha.' });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password: senha });

		if (error) {
			/* Erro útil e específico, em PT-BR — mas sem dizer QUAL dos dois está
			   errado: isso entregaria quais e-mails existem no sistema. */
			return fail(400, { email, erro: 'E-mail ou senha não conferem.' });
		}

		redirect(303, '/');
	}
};
