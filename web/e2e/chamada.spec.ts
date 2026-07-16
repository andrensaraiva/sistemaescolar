import { expect, test, type Page } from '@playwright/test';

/* Regra de ouro: a fatia "chamada" não é pronta sem o e2e do que ela entrega —
   o professor abre uma aula, marca uma falta e ela persiste. Precisa de uma
   turma com um aluno dentro, então o teste monta esse cenário primeiro (é o
   mesmo fluxo já provado em turmas.spec.ts). Precisa do banco com seed. */

async function entrar(page: Page, email: string, senha: string) {
	await page.goto('/entrar');
	await page.waitForLoadState('networkidle');
	await page.fill('#email', email);
	await page.fill('#senha', senha);
	await page.click('button[type=submit]');
	await expect(page).toHaveURL('/');
}

test('professor abre aula, marca falta e ela persiste', async ({ browser }) => {
	const nome = `Chamada E2E ${Date.now()}`;

	// ---- cenário: turma com um aluno dentro ----
	const ctxProf = await browser.newContext();
	const prof = await ctxProf.newPage();
	await entrar(prof, 'prof@senai.br', 'celeste123');
	await prof.goto('/turmas');
	await prof.waitForLoadState('networkidle');
	await prof.fill('input[name=nome]', nome);
	await prof.locator('form.criar button[type=submit]').click();
	const linha = prof.locator('.lista-dev li', { hasText: nome });
	await expect(linha).toBeVisible();
	const codigo = (await linha.locator('.cod').innerText()).trim();

	const ctxAluno = await browser.newContext();
	const aluno = await ctxAluno.newPage();
	await entrar(aluno, 'aluno@senai.br', 'celeste123');
	await aluno.goto('/turmas');
	await aluno.waitForLoadState('networkidle');
	await aluno.fill('#codigo', codigo);
	await aluno.locator('form.entrar button[type=submit]').click();
	await expect(aluno.getByText(`Você entrou em ${nome}`)).toBeVisible();

	// ---- professor entra na turma e vai pra chamada ----
	await prof.locator('.lista-dev li', { hasText: nome }).locator('a').click();
	await prof.waitForLoadState('networkidle');
	await expect(prof.locator('.lista .nome').filter({ hasText: 'Ana Aluna' })).toBeVisible();

	await prof.getByRole('link', { name: 'fazer chamada' }).click();
	await prof.waitForLoadState('networkidle');

	// abre a aula de hoje (data já vem preenchida)
	await prof.getByRole('button', { name: 'abrir aula' }).click();
	await prof.waitForLoadState('networkidle');
	await expect(prof.getByRole('heading', { name: /aula 1/i })).toBeVisible();

	// marca a Ana como falta e salva
	const rowAna = prof.locator('.linha', { hasText: 'Ana Aluna' });
	await rowAna.getByText('falta', { exact: true }).click();
	await prof.getByRole('button', { name: 'salvar chamada' }).click();
	await expect(prof.getByText('Chamada salva')).toBeVisible();

	// recarrega: a falta persiste (o rádio falta continua marcado)
	await prof.reload();
	await prof.waitForLoadState('networkidle');
	await expect(
		prof.locator('.linha', { hasText: 'Ana Aluna' }).locator('input[value=falta]')
	).toBeChecked();

	// a lista de aulas mostra a falta
	await prof.getByRole('link', { name: 'todas as aulas' }).click();
	await prof.waitForLoadState('networkidle');
	await expect(prof.locator('.linha-dev').first()).toContainText('falta');

	await ctxProf.close();
	await ctxAluno.close();
});
