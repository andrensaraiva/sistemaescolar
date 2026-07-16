import { describe, it, expect } from 'vitest';
import { QUEM_PODE, type UsoDeIa } from './tipos';

describe('Lei 10 — a IA nunca fala com o aluno', () => {
	/* Este é o teste mais importante do módulo de IA. Ele não checa uma função:
	   checa que a PORTA não existe. Se alguém um dia adicionar 'aluno' a
	   QUEM_PODE, isto quebra e a discussão acontece no PR — que é exatamente
	   onde ela tem que acontecer, porque os alunos são menores de idade. */
	it('nenhum uso de IA aceita o papel aluno', () => {
		for (const [uso, papeis] of Object.entries(QUEM_PODE)) {
			expect(papeis, `o uso "${uso}" abriu um caminho IA→aluno`).not.toContain('aluno');
		}
	});

	it('todo uso declarado tem pelo menos um papel adulto', () => {
		for (const [uso, papeis] of Object.entries(QUEM_PODE)) {
			expect(papeis.length, `o uso "${uso}" não pode ser pedido por ninguém`).toBeGreaterThan(0);
		}
	});

	it('os usos que existem são só os três voltados a adulto', () => {
		const usos: UsoDeIa[] = ['importar-ppc', 'gerar-exercicio', 'sugerir-feedback'];
		expect(Object.keys(QUEM_PODE).sort()).toEqual([...usos].sort());
	});
});
