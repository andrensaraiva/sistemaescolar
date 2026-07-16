import { describe, it, expect } from 'vitest';
import { skinDoPapel, modoPadrao, ehModo, classeDoModo } from './skin';

describe('skin por papel', () => {
	it('aluno escreve no Caderno', () => {
		expect(skinDoPapel('aluno')).toBe('caderno');
	});

	it('quem trabalha na plataforma usa a Dev', () => {
		expect(skinDoPapel('professor')).toBe('dev');
		expect(skinDoPapel('coordenador')).toBe('dev');
		expect(skinDoPapel('admin')).toBe('dev');
	});

	it('deslogado cai no Caderno', () => {
		expect(skinDoPapel(null)).toBe('caderno');
	});
});

describe('modo padrão — tem função, não é preferência', () => {
	it('o instrutor trabalha no escuro', () => {
		expect(modoPadrao('dev')).toBe('escuro');
	});

	it('o caderno abre no claro', () => {
		expect(modoPadrao('caderno')).toBe('claro');
	});
});

describe('modo', () => {
	it('claro é a ausência de classe', () => {
		expect(classeDoModo('claro')).toBe('');
		expect(classeDoModo('escuro')).toBe('escuro');
	});

	it('cookie adulterado não vira modo', () => {
		expect(ehModo('escuro')).toBe(true);
		expect(ehModo('dark')).toBe(false);
		expect(ehModo(undefined)).toBe(false);
	});
});
