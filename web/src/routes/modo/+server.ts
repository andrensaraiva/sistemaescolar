import { redirect } from '@sveltejs/kit';
import { COOKIE_MODO, ehModo } from '$lib/ui/skin';
import type { RequestHandler } from './$types';

/** Troca o modo e volta pra onde estava. O cookie é lido no hook, então o
    servidor já renderiza o <html> no modo certo: não há flash. */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const form = await request.formData();
	const alvo = form.get('modo');
	const voltar = String(form.get('voltar') ?? '/');

	if (!ehModo(alvo)) redirect(303, voltar);

	cookies.set(COOKIE_MODO, alvo, {
		path: '/',
		httpOnly: false,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 365
	});

	redirect(303, voltar);
};
