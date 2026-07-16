import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { clienteSupabase } from '$lib/server/supabase';
import {
	COOKIE_MODO,
	classeDoModo,
	ehModo,
	modoPadrao,
	skinDoPapel,
	type Papel
} from '$lib/ui/skin';

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = clienteSupabase(event);

	/* getSession() lê o cookie e NÃO valida a assinatura do JWT — confiar nele é
	   aceitar um usuário forjado. getUser() bate no Supabase e valida. Toda
	   decisão de acesso passa por aqui. */
	event.locals.sessaoSegura = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) return { session: null, user: null };

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) return { session: null, user: null };

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders: (nome) =>
			nome === 'content-range' || nome === 'x-supabase-api-version'
	});
};

const papelEskin: Handle = async ({ event, resolve }) => {
	const { user } = await event.locals.sessaoSegura();

	let papel: Papel | null = null;
	if (user) {
		// Schema em inglês (BLUEPRINT §5); os VALORES do papel é que são PT-BR.
		const { data } = await event.locals.supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();
		papel = (data?.role as Papel) ?? null;
	}
	event.locals.papel = papel;

	const skin = skinDoPapel(papel);
	const preferido = event.cookies.get(COOKIE_MODO);
	const modo = ehModo(preferido) ? preferido : modoPadrao(skin);
	event.locals.skin = skin;
	event.locals.modo = modo;

	/* A skin sai renderizada no <html> pelo servidor: não existe instante de tela
	   errada, então não há flash pra "consertar" com script no <head>. */
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('%celeste.skin%', skin).replace('%celeste.modo%', classeDoModo(modo))
	});
};

export const handle = sequence(supabase, papelEskin);
