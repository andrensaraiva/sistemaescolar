import { expect, test } from '@playwright/test';

/* O e2e da Fase 0 — a "regra de ouro" do SISTEMAS.md: nenhuma fatia é pronta
   sem 1 teste e2e do fluxo que ela entrega. O que a fundação entrega é:
   entrar, e a skin sair certa pelo papel. Precisa do banco local com seed:
   npm run db:reset */

test('quem não entrou não vê a home', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/\/entrar$/);
});

test('senha errada não diz qual dos dois campos errou', async ({ page }) => {
	await page.goto('/entrar');
	await page.fill('#email', 'aluno@senai.br');
	await page.fill('#senha', 'senhaerrada');
	await page.click('button[type=submit]');
	await expect(page.getByRole('alert')).toHaveText('E-mail ou senha não conferem.');
});

test('aluno entra e cai no Caderno, modo claro', async ({ page }) => {
	await page.goto('/entrar');
	await page.fill('#email', 'aluno@senai.br');
	await page.fill('#senha', 'celeste123');
	await page.click('button[type=submit]');

	await expect(page).toHaveURL('/');
	await expect(page.locator('h1')).toContainText('Ana Aluna');

	const html = page.locator('html');
	await expect(html).toHaveAttribute('data-skin', 'caderno');
	await expect(html).not.toHaveClass(/escuro/);
});

test('professor entra e cai na Dev, modo escuro', async ({ page }) => {
	await page.goto('/entrar');
	await page.fill('#email', 'prof@senai.br');
	await page.fill('#senha', 'celeste123');
	await page.click('button[type=submit]');

	await expect(page).toHaveURL('/');

	const html = page.locator('html');
	await expect(html).toHaveAttribute('data-skin', 'dev');
	// O instrutor trabalha no escuro e imprime no claro — DESIGN.md §1.
	await expect(html).toHaveClass(/escuro/);
	// A marca vira `~/celeste`: sabor de terminal sem a fantasia.
	await expect(page.locator('.marca')).toContainText('~/celeste');
});

test('o modo troca e persiste', async ({ page }) => {
	await page.goto('/entrar');
	await page.fill('#email', 'aluno@senai.br');
	await page.fill('#senha', 'celeste123');
	await page.click('button[type=submit]');

	await page.getByRole('button', { name: 'escuro' }).click();
	await expect(page.locator('html')).toHaveClass(/escuro/);

	// Recarrega: o servidor tem que renderizar já no escuro (sem flash).
	await page.reload();
	await expect(page.locator('html')).toHaveClass(/escuro/);
});
