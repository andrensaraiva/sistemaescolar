# Estado — onde a construção parou

> Handoff entre sessões de Claude Code. **Comece por aqui**, depois
> [SISTEMAS.md](SISTEMAS.md) (o mapa) e [CLAUDE.md](CLAUDE.md) (as leis).
> Atualize este arquivo ao fim de cada sessão. Se ele mentir, ninguém confia nele.

**Última sessão: 16/jul/2026 (parte 3)** — segunda fatia: **chamada** (SISTEMAS §17,
passo 2 — o sensor mais barato do radar). Decisão de domínio: a chamada prende na
**turma** (não em turma×UC) — entrega o sensor já, sem depender do currículo; o diário
por UC entra na Papelada. Professor abre uma aula (número automático) → marca
presente/atraso/falta (todos entram presentes, vira só os ausentes) → persiste. Migration
3 + RLS **provada com 11 ataques** + 2 telas Dev + 1 e2e. **e2e: 8/8**.

**16/jul/2026 (parte 2)** — primeira fatia depois da Fundação:
**turmas + código de convite** (SISTEMAS §17, passo 1: "sem gente, nada existe").
Professor cria turma → gera código de 6 chars → aluno logado entra pelo código →
professor vê a lista. Migration 2 + RLS **provada com 12 ataques** + 2 telas nas duas
skins + 2 e2e. `class_units` (turma × UC) fica para quando existir currículo. **e2e:
7/7** (5 de entrar + 2 de turmas).

**16/jul/2026 (parte 1)** — Fase 0 **fecha o e2e**: `entrar.spec.ts` confiável (3× frio,
5/5). O bloqueio nº 1 da sessão anterior resolvido — e resolvê-lo destravou um bug real
(a skin não trocava em navegação client-side; ver §Resolvido). Código em [web/](web/);
docs na raiz.

**Sessão 15/jul/2026** — Fase 0 (Fundação) construída.

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
| e2e do fluxo de entrar (`entrar.spec.ts`) | ✅ **5/5, confiável** (3× frio) — a "regra de ouro" da fatia |
| Skin correta em navegação client-side | ✅ o `<html>` agora sincroniza no cliente (bug achado pelo e2e) |
| Migration 2: `classes` + `class_members` + código de convite | ✅ **provada com 12 ataques** (`rls-turmas.sql`) |
| Turmas: professor cria/regenera/remove; aluno entra por código | ✅ `/turmas` (Dev + Caderno) + `/turmas/[id]` (dono) |
| e2e do fluxo de turmas (`turmas.spec.ts`) | ✅ **2/2**: cria → entra por código → aparece na lista; código errado não entra |
| Migration 3: `attendance_sessions` + `attendance_marks` (chamada) | ✅ **provada com 11 ataques** (`rls-chamada.sql`) |
| Chamada: abre aula (nº auto), marca presente/atraso/falta, persiste | ✅ `/turmas/[id]/chamada` + `/[sessao]` (Dev) — prende na turma |
| e2e da chamada (`chamada.spec.ts`) | ✅ **1/1**: abre aula → marca falta → persiste após reload |

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

### A prova da RLS de turmas — a mesma disciplina, um alvo novo
`web/supabase/tests/rls-turmas.sql` (12 ataques). A trava-chave da fatia: **a turma não
é enumerável** — a policy de SELECT só libera dono e membro, então o aluno *não pode ler
o código* de uma turma para entrar nela. Entrar é por **RPC `SECURITY DEFINER`**
(`join_class_by_code`), que acha a turma por baixo da RLS, valida (só `role=aluno`,
normaliza maiúsculas) e insere a filiação. `class_members` **não tem grant de INSERT**
nenhum: a única porta é a RPC. É o mesmo princípio da migration 1 — a escrita perigosa
passa por uma porta estreita, não pela tabela aberta.

Consequência de design que vale registrar: o professor precisava **ler o perfil dos
alunos dele** (a lista da turma pede o nome), e a policy "leio o meu" de `profiles`
escondia isso. Resolvido com o helper `is_my_student()` + uma policy de SELECT em
`profiles` — o dono lê quem é seu aluno, e só. Isso vai ser reusado em correção e radar.

---

## ✅ Resolvido nesta sessão (16/jul)

### 1. O e2e do login — era corrida de hidratação, e escondia um bug de produto
Os 5 testes de `entrar.spec.ts` passam agora, confiável. O diagnóstico da sessão
anterior estava perto mas a conclusão ("action que lança") estava errada — o servidor
sempre esteve certo. **O que era, de verdade:**

- **Causa da flakiness:** em Vite **dev frio**, a hidratação é lenta. O Playwright digita
  e clica **antes** de o `use:enhance` attachar → o form faz **submit nativo** (sem JS),
  que é o comportamento correto de progressive enhancement, mas **recarrega a página
  inteira**. Em dev frio essa navegação estourava os 5s do `expect`. Um usuário humano é
  lento o bastante para nunca cair nisso; o robô não. **Fix:** `abrirEntrar()` espera
  `networkidle` (o grafo de módulos do dev terminou) antes de interagir.
- **O bug real que isso escondia:** com a hidratação esperada, o login do professor
  passou a ir pra `/` por navegação **client-side** — e aí `data-skin` ficava `caderno`.
  O `<html>` (skin + modo) só era escrito no **SSR** (`hooks.server.ts`); numa navegação
  client-side ele não passa mais pelo servidor. **Um professor real logava e continuava
  na skin Caderno até dar refresh.** A corrida antiga mascarava isso porque o submit
  nativo fazia full render. **Fix:** `+layout.svelte` sincroniza o `<html>` no cliente
  via `$effect`, com a mesma verdade (`data.skin`/`data.modo` do `+layout.server.ts`).
  Na hidratação ele reafirma o que já veio do SSR, sem flash.

**A lição:** um e2e que passa por sorte de timing é pior que um que falha — ele teria
deixado o bug da skin ir pra produção. A espera de hidratação não é maquiagem: é
reproduzir o usuário real, e foi ela que revelou o bug.

---

## ⚠️ O que ainda está aberto

### 1. `npm run build` não roda no Windows
O `adapter-vercel` cria **symlink**; o Windows recusa (`EPERM`) sem o **Modo de
Desenvolvedor** ligado. A Vercel builda no Linux, então **produção não é afetada** — mas
localmente você não consegue buildar. Por isso o Playwright roda contra `npm run dev`
(porta 5173), não contra `build && preview`. Ligue o Modo de Desenvolvedor se quiser o
build local de volta.

### 2. Nada foi implantado ainda
Falta (**depende de conta sua, eu não posso fazer**): criar o projeto no Supabase
(free), criar o projeto na Vercel apontando **Root Directory = `web`**, e pôr as 3 vars
do `.env.example` lá. Só depois a Fase 0 fecha de verdade ("deploy free tier
funcionando").

### 3. Você ainda não tem conta de admin
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
- **`npm run lint` vermelho no Windows** era CRLF, não estilo. O git com
  `core.autocrlf=true` (default do Windows) guarda LF no índice mas materializa **CRLF**
  no working tree; o Prettier, com `endOfLine` default `lf`, reprovava os 37 arquivos.
  Resolvido com `"endOfLine": "auto"` no `.prettierrc` — passa em CRLF (Windows) e LF
  (Linux/Vercel) sem reescrever fonte nenhum. (Alternativa mais dura, não usada: um
  `.gitattributes` com `* text=auto eol=lf` + `git add --renormalize`.)
- **Testar hidratação, não só o servidor.** Um `curl` na action prova o servidor, mas o
  bug da skin (§Resolvido nº 1) só aparece no **browser hidratado** em navegação
  client-side. Antes de dar um fluxo por pronto, exercite-o hidratado — foi o que o e2e
  passou a fazer.
- **`upsert` do supabase precisa de grant de UPDATE em TODAS as colunas do payload**,
  não só nas que mudam. O PostgREST monta o upsert com `DO UPDATE SET` em todas as
  colunas enviadas — inclusive a PK —, então `grant update (status)` sozinho dá
  "permission denied for table" mesmo com a policy certa. O INSERT direto passava; só o
  upsert falhava. Achado com o e2e da chamada (a marca não salvava). O grant de
  `attendance_marks` foi ampliado, com comentário na migration 3 explicando por quê.
  **Regra:** ao usar `.upsert()`, o grant de update tem que cobrir o payload inteiro.

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
# .env: copie de .env.example e preencha com o que o db:start imprime
#   (npx supabase status): API_URL e ANON_KEY. Sem ele o app lança SEM_CONFIG.
npm run db:reset     # migrations + seed
npm run dev          # http://localhost:5173
npm run test:e2e     # 5/5 — sobe o dev server sozinho; precisa do banco no ar
```

Contas do seed: `aluno@senai.br` e `prof@senai.br`, senha `celeste123`.
Entre com as duas: o aluno cai no **Caderno claro**, o professor na **Dev escura**.
