import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.sessaoSegura();
	return {
		papel: locals.papel,
		skin: locals.skin,
		modo: locals.modo,
		email: user?.email ?? null
	};
};
