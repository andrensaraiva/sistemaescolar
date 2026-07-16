import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/* O detalhe da turma é do DONO: mostra o código (que ele dita no quadro) e a
   lista de quem entrou. Defesa em profundidade — a RLS já barra no banco, e
   aqui a camada server confirma a posse antes de qualquer coisa (BLUEPRINT §4.4). */

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.sessaoSegura();
	if (!user) redirect(303, '/entrar');

	const { data: turma } = await locals.supabase
		.from('classes')
		.select('id, name, invite_code, owner_id')
		.eq('id', params.id)
		.single();

	// Não é sua? Some — sem vazar se a turma existe.
	if (!turma || turma.owner_id !== user.id) redirect(303, '/turmas');

	const { data: membros } = await locals.supabase
		.from('class_members')
		.select('joined_at, profiles(id, full_name)')
		.eq('class_id', params.id)
		.order('joined_at', { ascending: true })
		.returns<{ joined_at: string; profiles: { id: string; full_name: string | null } | null }[]>();

	const alunos = (membros ?? [])
		.filter(
			(m): m is { joined_at: string; profiles: { id: string; full_name: string | null } } =>
				!!m.profiles
		)
		.map((m) => ({
			id: m.profiles.id,
			nome: m.profiles.full_name ?? 'sem nome',
			desde: m.joined_at
		}));

	return { turma: { id: turma.id, name: turma.name, codigo: turma.invite_code }, alunos };
};

export const actions: Actions = {
	// Regenera o código: o antigo morre na hora (o novo é único, garantido no banco).
	regenerar: async ({ params, locals }) => {
		const { user } = await locals.sessaoSegura();
		if (!user) redirect(303, '/entrar');

		const { data, error } = await locals.supabase.rpc('regenerate_invite_code', {
			p_class_id: params.id
		});
		if (error) return fail(400, { erro: 'Não deu para regenerar o código.' });

		return { novoCodigo: data as string };
	},

	// Tira um aluno da turma (entrou na turma errada, por ex.). RLS confirma a posse.
	remover: async ({ params, request, locals }) => {
		const { user } = await locals.sessaoSegura();
		if (!user) redirect(303, '/entrar');

		const form = await request.formData();
		const alunoId = String(form.get('aluno') ?? '');
		if (!alunoId) return fail(400, { erro: 'Aluno inválido.' });

		const { error } = await locals.supabase
			.from('class_members')
			.delete()
			.eq('class_id', params.id)
			.eq('student_id', alunoId);
		if (error) return fail(400, { erro: 'Não deu para remover o aluno.' });

		return { removido: true };
	}
};
