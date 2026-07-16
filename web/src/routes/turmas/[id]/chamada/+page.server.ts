import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/* A chamada é do dono da turma (Dev). Lista as aulas já dadas e cria a próxima.
   Defesa em profundidade: RLS barra no banco, e aqui confirmamos a posse antes. */

type Sessao = {
	id: string;
	numero: number;
	data: string;
	periodo: string | null;
	faltas: number;
	atrasos: number;
	presentes: number;
	marcada: boolean;
};

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.sessaoSegura();
	if (!user) redirect(303, '/entrar');

	const { data: turma } = await locals.supabase
		.from('classes')
		.select('id, name, owner_id')
		.eq('id', params.id)
		.single();
	if (!turma || turma.owner_id !== user.id) redirect(303, '/turmas');

	const { data } = await locals.supabase
		.from('attendance_sessions')
		.select('id, numero, data, periodo, attendance_marks(status)')
		.eq('class_id', params.id)
		.order('numero', { ascending: false })
		.returns<
			{
				id: string;
				numero: number;
				data: string;
				periodo: string | null;
				attendance_marks: { status: string }[];
			}[]
		>();

	const sessoes: Sessao[] = (data ?? []).map((s) => {
		const marcas = s.attendance_marks ?? [];
		return {
			id: s.id,
			numero: s.numero,
			data: s.data,
			periodo: s.periodo,
			faltas: marcas.filter((m) => m.status === 'falta').length,
			atrasos: marcas.filter((m) => m.status === 'atraso').length,
			presentes: marcas.filter((m) => m.status === 'presente').length,
			marcada: marcas.length > 0
		};
	});

	return { turma: { id: turma.id, name: turma.name }, sessoes };
};

export const actions: Actions = {
	// Cria a próxima aula (número automático no banco) e leva direto pra marcá-la —
	// nada começa em branco: a data já vem preenchida com hoje no formulário.
	criarAula: async ({ params, request, locals }) => {
		const { user } = await locals.sessaoSegura();
		if (!user) redirect(303, '/entrar');

		const form = await request.formData();
		const dataAula = String(form.get('data') ?? '').trim();
		const periodo = String(form.get('periodo') ?? '').trim() || null;

		const { data, error } = await locals.supabase
			.from('attendance_sessions')
			.insert({
				class_id: params.id,
				data: dataAula || undefined, // vazio → default do banco (current_date)
				periodo,
				registered_by: user.id
			})
			.select('id')
			.single();

		if (error || !data) return fail(400, { erro: 'Não deu para abrir a aula. Tente de novo.' });

		redirect(303, `/turmas/${params.id}/chamada/${data.id}`);
	}
};
