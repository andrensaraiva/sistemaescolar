import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/* Marcar presença de uma aula. Nada começa em branco: todo mundo entra como
   'presente' e você vira só os ausentes — o jeito mais rápido de fazer chamada
   ×4 turmas/dia. Sem salvar, a aula fica pendente (nunca vira falta sozinha). */

const STATUS = new Set(['presente', 'atraso', 'falta']);

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.sessaoSegura();
	if (!user) redirect(303, '/entrar');

	const { data: turma } = await locals.supabase
		.from('classes')
		.select('id, name, owner_id')
		.eq('id', params.id)
		.single();
	if (!turma || turma.owner_id !== user.id) redirect(303, '/turmas');

	const { data: sessao } = await locals.supabase
		.from('attendance_sessions')
		.select('id, numero, data, periodo, class_id')
		.eq('id', params.sessao)
		.single();
	if (!sessao || sessao.class_id !== turma.id) redirect(303, `/turmas/${turma.id}/chamada`);

	const { data: membros } = await locals.supabase
		.from('class_members')
		.select('joined_at, profiles(id, full_name)')
		.eq('class_id', turma.id)
		.order('joined_at', { ascending: true })
		.returns<{ joined_at: string; profiles: { id: string; full_name: string | null } | null }[]>();

	const { data: marcas } = await locals.supabase
		.from('attendance_marks')
		.select('student_id, status')
		.eq('session_id', params.sessao)
		.returns<{ student_id: string; status: string }[]>();

	const mapa = new Map((marcas ?? []).map((m) => [m.student_id, m.status]));

	const alunos = (membros ?? [])
		.filter(
			(m): m is { joined_at: string; profiles: { id: string; full_name: string | null } } =>
				!!m.profiles
		)
		.map((m) => ({
			id: m.profiles.id,
			nome: m.profiles.full_name ?? 'sem nome',
			status: mapa.get(m.profiles.id) ?? 'presente'
		}));

	return {
		turma: { id: turma.id, name: turma.name },
		sessao: { id: sessao.id, numero: sessao.numero, data: sessao.data, periodo: sessao.periodo },
		alunos,
		jaMarcada: (marcas ?? []).length > 0
	};
};

export const actions: Actions = {
	salvar: async ({ params, request, locals }) => {
		const { user } = await locals.sessaoSegura();
		if (!user) redirect(303, '/entrar');

		// Relê o roster: só marcamos quem é membro de fato, não o que veio no form.
		const { data: membros } = await locals.supabase
			.from('class_members')
			.select('student_id')
			.eq('class_id', params.id)
			.returns<{ student_id: string }[]>();

		const form = await request.formData();
		const linhas = (membros ?? []).map((m) => {
			const st = String(form.get(m.student_id) ?? 'presente');
			return {
				session_id: params.sessao,
				student_id: m.student_id,
				status: STATUS.has(st) ? st : 'presente',
				registered_by: user.id
			};
		});

		if (linhas.length) {
			const { error } = await locals.supabase
				.from('attendance_marks')
				.upsert(linhas, { onConflict: 'session_id,student_id' });
			if (error) return fail(400, { erro: 'Não deu para salvar a chamada. Tente de novo.' });
		}

		return { salvo: true };
	}
};
