import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { registrarTipo, obterTipo, listarTipos, limparRegistro } from './registro';

const pseudo = {
	id: 'pseudocodigo',
	nome: 'Pseudocódigo / lógica',
	schemaEntrega: z.object({ linhas: z.array(z.string()) }),
	runner: 'nenhum' as const,
	tentativas: 'ilimitada' as const,
	xpNoAcerto: 30,
	corrigeSozinho: false
};

describe('registro de tipos de atividade', () => {
	beforeEach(() => limparRegistro());

	it('registra e devolve um tipo', () => {
		registrarTipo(pseudo);
		expect(obterTipo('pseudocodigo')?.nome).toBe('Pseudocódigo / lógica');
		expect(listarTipos()).toHaveLength(1);
	});

	it('recusa id duplicado', () => {
		registrarTipo(pseudo);
		expect(() => registrarTipo(pseudo)).toThrow(/duplicado/);
	});

	it('tipo desconhecido é undefined, não explode', () => {
		expect(obterTipo('duelo')).toBeUndefined();
	});

	it('o schema de entrega valida o JSONB que vai pro banco', () => {
		registrarTipo(pseudo);
		const tipo = obterTipo('pseudocodigo')!;
		expect(tipo.schemaEntrega.safeParse({ linhas: ['inicio', 'fim'] }).success).toBe(true);
		expect(tipo.schemaEntrega.safeParse({ codigo: 'x' }).success).toBe(false);
	});
});
