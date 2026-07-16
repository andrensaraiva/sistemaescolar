import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	webServer: {
		/* Roda contra o dev server, não contra `build && preview`.
		   Motivo: o adapter-vercel cria symlink no build, e o Windows recusa
		   (EPERM) sem o Modo de Desenvolvedor ligado. O build de produção quem
		   faz é a Vercel, no Linux, onde symlink é trivial.
		   Custo aceito: o e2e não pega bug que só aparece no bundle de produção.
		   Se um dia isso morder, ligue o Modo de Desenvolvedor do Windows e troque
		   por 'npm run build && npm run preview' na porta 4173. */
		command: 'npm run dev',
		port: 5173,
		reuseExistingServer: !process.env.CI
	},
	use: { baseURL: 'http://localhost:5173' }
});
