import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/* Uma rota, dois públicos: o professor vê as turmas que possui (skin Dev); o
   aluno vê as turmas em que entrou + o campo do código (skin Caderno). A skin
   sai certa sozinha pelo papel — o componente só troca o conteúdo. */

type TurmaProf = { id: string; name: string; codigo: string; alunos: number };
type TurmaAluno = { id: string; name: string };

function ehDocente(papel: string | null): boolean {
	return papel === 'professor' || papel === 'coordenador' || papel === 'admin';
}

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.sessaoSegura();
	if (!user) redirect(303, '/entrar');

	if (ehDocente(locals.papel)) {
		// O supabase-js tipa relações aninhadas como array; em tempo de execução
		// class_members(count) volta como [{count}]. .returns<> alinha os dois.
		const { data } = await locals.supabase
			.from('classes')
			.select('id, name, invite_code, class_members(count)')
			.eq('owner_id', user.id)
			.order('created_at', { ascending: true })
			.returns<
				{ id: string; name: string; invite_code: string; class_members: { count: number }[] }[]
			>();

		const turmas: TurmaProf[] = (data ?? []).map((t) => ({
			id: t.id,
			name: t.name,
			codigo: t.invite_code,
			alunos: t.class_members?.[0]?.count ?? 0
		}));
		return { turmas, minhas: [] as TurmaAluno[] };
	}

	const { data } = await locals.supabase
		.from('class_members')
		.select('joined_at, classes(id, name)')
		.eq('student_id', user.id)
		.order('joined_at', { ascending: true })
		.returns<{ joined_at: string; classes: { id: string; name: string } | null }[]>();

	const minhas: TurmaAluno[] = (data ?? [])
		.filter((m): m is { joined_at: string; classes: { id: string; name: string } } => !!m.classes)
		.map((m) => ({ id: m.classes.id, name: m.classes.name }));
	return { turmas: [] as TurmaProf[], minhas };
};

export const actions: Actions = {
	// Professor cria a própria turma. O código nasce no trigger do banco.
	criar: async ({ request, locals }) => {
		const { user } = await locals.sessaoSegura();
		if (!user) redirect(303, '/entrar');
		if (!ehDocente(locals.papel)) return fail(403, { criarErro: 'Só docente cria turma.' });

		const form = await request.formData();
		const nome = String(form.get('nome') ?? '').trim();
		if (!nome) return fail(400, { criarErro: 'Dê um nome à turma.', nome });
		if (nome.length > 120) return fail(400, { criarErro: 'Nome muito longo (máx. 120).', nome });

		const { error } = await locals.supabase
			.from('classes')
			.insert({ owner_id: user.id, name: nome });
		if (error) return fail(400, { criarErro: 'Não deu para criar a turma. Tente de novo.', nome });

		return { criada: nome };
	},

	// Aluno entra por código. A RPC valida, normaliza e insere a filiação —
	// nunca um INSERT direto (ver a migration: class_members não tem grant de insert).
	entrar: async ({ request, locals }) => {
		const { user } = await locals.sessaoSegura();
		if (!user) redirect(303, '/entrar');
		if (locals.papel !== 'aluno') return fail(403, { entrarErro: 'Só aluno entra por código.' });

		const form = await request.formData();
		const codigo = String(form.get('codigo') ?? '').trim();
		if (!codigo) return fail(400, { entrarErro: 'Digite o código.', codigo });

		const { data, error } = await locals.supabase.rpc('join_class_by_code', { p_code: codigo });
		if (error) {
			/* A RPC levanta a mensagem já em PT-BR ("Código não confere…"). */
			return fail(400, { entrarErro: error.message || 'Código não confere.', codigo });
		}

		const turma = Array.isArray(data) ? data[0] : data;
		return { entrou: turma?.class_name ?? 'turma' };
	}
};
