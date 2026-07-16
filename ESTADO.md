# Estado — onde a construção parou

> Handoff entre sessões de Claude Code. **Comece por aqui**, depois
> [SISTEMAS.md](SISTEMAS.md) (o mapa) e [CLAUDE.md](CLAUDE.md) (as leis).
> Atualize este arquivo ao fim de cada sessão. Se ele mentir, ninguém confia nele.

**Última sessão: 15/jul/2026** — Fase 0 (Fundação) construída. O código vive em
[web/](web/); os docs continuam na raiz.

---

## O que existe e está provado

| | Estado |
|---|---|
| SvelteKit + TS + ESLint + Prettier + Vitest + Playwright | ✅ `npm run lint`, `check` e `test:unit` limpos (14 testes) |
| Kit de UI: 4 variantes de skin, tokens de movimento, primitivos | ✅ transcritos do protótipo aprovado |
| As 3 fontes, self-hosted em `web/static/fontes` (127 KB) | ✅ extraídas do base64 do protótipo |
| Skin por papel, sem flash | ✅ resolvida no servidor (`hooks.server.ts`), não por script no `<head>` |
| Migration 1: profiles, papéis, RLS helpers `SECURITY DEFINER` | ✅ **provada com 7 ataques** (ver abaixo) |
| Seed local (aluno + professor) | ✅ `npm run db:reset` |
| Gateway de IA + `AiProvider` + `CodeRunner` (stubs) | ✅ com o `runner: nenhum` já real |
| Registro de features + de tipos de atividade | ✅ testáveis |

### A prova da RLS — o que aprendemos apanhando
`web/supabase/tests/rls-perfis.sql` (rode contra o local; instruções no cabeçalho).
Os 7 casos: aluno lê o próprio perfil ✅ · não lê o do colega ✅ · **não se dá XP** ✅ ·
não vira admin ✅ · não vira master admin ✅ · não edita o colega ✅ · troca o próprio
nome ✅.

**A lição, porque ela vai se repetir em toda tabela nova:** nesta versão do Supabase,
**tabela nova nasce sem grant nenhum** para `authenticated` — e o Postgres checa o GRANT
*antes* da RLS. Isso obriga a conceder **por coluna**, e é aí que o XP fica protegido de
verdade: a policy autoriza a *linha* (que é do aluno mesmo), então RLS sozinha deixaria
`update profiles set xp=999999 where id=auth.uid()` passar. Quem protege é o
`grant update (colunas)`. Foi encontrado tentando o ataque, não lendo o código.

---

## ⚠️ O que ficou aberto — comece por aqui

### 1. O e2e falha e o motivo não foi achado (o único bloqueio real)
`web/e2e/entrar.spec.ts`: **1 passa** (o redirect de quem não entrou), **4 falham** —
o login não completa **no browser**.

O que já está descartado, para não refazer:
- **O servidor está certo.** `curl -X POST localhost:5173/entrar` com o form devolve
  `{"type":"redirect","status":303,"location":"/"}` **e grava o cookie de sessão**.
- **O banco está certo.** `POST /auth/v1/token?grant_type=password` devolve 200.
- **Não é rate limit** do GoTrue: 3 logins seguidos, 3× HTTP 200.
- **Não é paralelismo**: `--workers=1` falha igual, em ~5s (falha rápida, não timeout).
- **Não é o seed** (já consertado, ver abaixo).

**A pista que vale ouro:** um spec de debug com **exatamente os mesmos passos** +
`waitForTimeout(3000)` **passa** e termina em `/`. O `entrar.spec.ts` não. A diferença
está no espectro entre "esperar 3s" e o `expect(...).toHaveURL('/')` com 5s de timeout —
o que não faz sentido ainda, e é justamente aí que a próxima sessão deve cavar.
Sintoma no snapshot da falha: o campo **e-mail volta vazio** e **nenhum alerta aparece**,
nem no teste de senha errada — o padrão de uma action que **lança**, em vez de retornar
`fail(400)`. Suspeita nº 1: o `use:enhance` de `entrar/+page.svelte` engolindo o
resultado; tente sem `enhance` para isolar.

### 2. `npm run build` não roda no Windows
O `adapter-vercel` cria **symlink**; o Windows recusa (`EPERM`) sem o **Modo de
Desenvolvedor** ligado. A Vercel builda no Linux, então **produção não é afetada** — mas
localmente você não consegue buildar. Por isso o Playwright roda contra `npm run dev`
(porta 5173), não contra `build && preview`. Ligue o Modo de Desenvolvedor se quiser o
build local de volta.

### 3. Nada foi implantado ainda
Falta (**depende de conta sua, eu não posso fazer**): criar o projeto no Supabase
(free), criar o projeto na Vercel apontando **Root Directory = `web`**, e pôr as 3 vars
do `.env.example` lá. Só depois a Fase 0 fecha de verdade ("deploy free tier
funcionando").

### 4. Você ainda não tem conta de admin
Não existe fluxo de admin (é Fase 1, e [PERFIL-ADMIN.md](PERFIL-ADMIN.md) manda no
desenho — **não inventei uma RPC antes de ler aquele doc**). Por ora, promova pelo
Studio (`npm run db:start` → http://127.0.0.1:54323) ou por SQL:
`update profiles set role='admin' where id='...'`. Isso funciona porque o trigger
`guard_role_escalation` só barra quem vem do PostgREST como `authenticated`.

---

## Armadilhas já pagas (não repita)

- **Usuário inserido na mão em `auth.users`** precisa de `confirmation_token`,
  `recovery_token`, `email_change*`, `phone_change*` e `reauthentication_token` como
  **string vazia, nunca NULL**. Com NULL, o login devolve um 500 genérico
  (`"Database error querying schema"`) que não diz nada sobre a causa real
  (`converting NULL to string is unsupported`). Custou uma hora. Já está no
  `supabase/seed.sql`.
- **`sv add` trava** em prompt interativo neste ambiente. Instale os add-ons com
  `npm install -D` e escreva os configs à mão.
- **`set local role` só vale dentro de transação.** Fora dela o Postgres emite um
  *warning* e segue como superusuário — e o seu teste de RLS passa sem testar nada.
  Use `begin; ... rollback;` e um `savepoint` por ataque.
- **4 vulnerabilidades "low"** no `npm audit` são o `cookie` transitivo do SvelteKit.
  `npm audit fix --force` rebaixa o Kit para `0.0.30`. Não faça.

---

## Divergências entre docs que encontrei (e como resolvi)

- `CLAUDE.md §3` diz que o grafite Dev é `#0E1217`; a tabela do `DESIGN.md §1` diz
  `--mesa #0A0E12` / `--folha #141A21`. Segui o **DESIGN.md**, pela regra do próprio
  `CLAUDE.md` ("o doc de detalhe ganha"). Vale corrigir o índice.
- `CLAUDE.md §2.16` chama o token de foco de `--focus`; o `DESIGN.md` chama de `--foco`.
  Está `--foco` no código.
- O schema é **em inglês** (`profiles.role`), como manda o `BLUEPRINT §5`; os **valores**
  é que são PT-BR (`aluno | professor | ...`). "PT-BR sempre" vale para texto de
  usuário, não para o schema herdado.

---

## Como levantar o ambiente

```bash
cd web
npm install
npm run db:start     # Docker Desktop precisa estar ABERTO
npm run db:reset     # migrations + seed
npm run dev          # http://localhost:5173
```

Contas do seed: `aluno@senai.br` e `prof@senai.br`, senha `celeste123`.
Entre com as duas: o aluno cai no **Caderno claro**, o professor na **Dev escura**.
