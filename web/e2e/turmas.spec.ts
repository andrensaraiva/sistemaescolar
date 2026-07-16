import { expect, test, type Page } from '@playwright/test';

/* A regra de ouro (SISTEMAS §17): a fatia "turmas + convite" não é pronta sem o
   e2e do fluxo que ela entrega — professor cria a turma e dita o código; o aluno
   entra com o código; o professor vê o aluno na lista. Dois contextos porque são
   duas pessoas. Precisa do banco com seed (npm run db:reset). */

async function entrar(page: Page, email: string, senha: string) {
	await page.goto('/entrar');
	// Espera a hidratação antes de interagir — mesma razão do entrar.spec.ts.
	await page.waitForLoadState('networkidle');
	await page.fill('#email', email);
	await page.fill('#senha', senha);
	await page.click('button[type=submit]');
	await expect(page).toHaveURL('/');
}

test('professor cria turma, aluno entra pelo código, professor vê na lista', async ({
	browser
}) => {
	const nome = `Turma E2E ${Date.now()}`;

	// ---- professor cria a turma e lê o código ----
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
	// Alfabeto sem ambíguos (0/O/1/I/L): 6 chars maiúsculos ou dígitos 2–9.
	expect(codigo).toMatch(/^[A-Z2-9]{6}$/);

	// ---- aluno entra com o código ----
	const ctxAluno = await browser.newContext();
	const aluno = await ctxAluno.newPage();
	await entrar(aluno, 'aluno@senai.br', 'celeste123');
	await aluno.goto('/turmas');
	await aluno.waitForLoadState('networkidle');

	await aluno.fill('#codigo', codigo);
	await aluno.locator('form.entrar button[type=submit]').click();

	await expect(aluno.getByText(`Você entrou em ${nome}`)).toBeVisible();
	await expect(aluno.locator('.lista-aluno li', { hasText: nome })).toBeVisible();

	// ---- professor abre a turma e vê o aluno ----
	await prof.locator('.lista-dev li', { hasText: nome }).locator('a').click();
	await prof.waitForLoadState('networkidle');
	await expect(prof.locator('.lista .nome').filter({ hasText: 'Ana Aluna' })).toBeVisible();

	await ctxProf.close();
	await ctxAluno.close();
});

test('código inexistente não entra em turma nenhuma', async ({ page }) => {
	await entrar(page, 'aluno@senai.br', 'celeste123');
	await page.goto('/turmas');
	await page.waitForLoadState('networkidle');

	await page.fill('#codigo', 'ZZZZ99');
	await page.locator('form.entrar button[type=submit]').click();

	await expect(page.getByRole('alert')).toContainText('não confere');
});
