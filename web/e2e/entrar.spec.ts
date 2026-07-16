import { expect, test, type Page } from '@playwright/test';

/* O e2e da Fase 0 — a "regra de ouro" do SISTEMAS.md: nenhuma fatia é pronta
   sem 1 teste e2e do fluxo que ela entrega. O que a fundação entrega é:
   entrar, e a skin sair certa pelo papel. Precisa do banco local com seed:
   npm run db:reset */

/* Abre /entrar e SÓ retorna quando a página hidratou. Sem isso, o Playwright
   digita e clica mais rápido do que a hidratação em Vite dev consegue attachar
   o `use:enhance` — o form então faz submit NATIVO (sem JS). O submit nativo é
   correto por progressive enhancement, mas recarrega a página inteira e, em dev
   frio, essa navegação estoura o timeout do expect. Um usuário real é lento o
   bastante para nunca cair nesse caso; a espera aqui só reproduz essa realidade.
   `networkidle` = o grafo de módulos do dev server terminou de carregar. */
async function abrirEntrar(page: Page) {
	await page.goto('/entrar');
	await page.waitForLoadState('networkidle');
}

test('quem não entrou não vê a home', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/\/entrar$/);
});

test('senha errada não diz qual dos dois campos errou', async ({ page }) => {
	await abrirEntrar(page);
	await page.fill('#email', 'aluno@senai.br');
	await page.fill('#senha', 'senhaerrada');
	await page.click('button[type=submit]');
	await expect(page.getByRole('alert')).toHaveText('E-mail ou senha não conferem.');
});

test('aluno entra e cai no Caderno, modo claro', async ({ page }) => {
	await abrirEntrar(page);
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
	await abrirEntrar(page);
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
	await abrirEntrar(page);
	await page.fill('#email', 'aluno@senai.br');
	await page.fill('#senha', 'celeste123');
	await page.click('button[type=submit]');

	await page.getByRole('button', { name: 'escuro' }).click();
	await expect(page.locator('html')).toHaveClass(/escuro/);

	// Recarrega: o servidor tem que renderizar já no escuro (sem flash).
	await page.reload();
	await expect(page.locator('html')).toHaveClass(/escuro/);
});
