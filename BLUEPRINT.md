# Celeste Academy — Blueprint da Reescrita (v2)

> ## ⚠️ Superado em partes (15/jul/2026)
>
> A **arquitetura** deste doc (stack, modelo de dados, RLS, princípios) continua válida
> e é a fonte da verdade. O **produto** foi redefinido depois dele — onde houver
> conflito, **[SISTEMAS.md](SISTEMAS.md) e os PERFIL-*.md ganham**.
>
> | Aqui está escrito | Vale hoje |
> |---|---|
> | "professor da turma" (singular) | **4+ turmas, 100+ alunos** |
> | Tese: registre → gere o documento | **Registre → veja quem está afundando**; o documento é subproduto ([CLAUDE.md §1](CLAUDE.md)) |
> | §9 — ordem de construção | Substituída por [SISTEMAS.md](SISTEMAS.md) § *Ordem de construção* |
> | 8 tipos de atividade (§2, §5, §9) | **6** — duelo X1 e chat com NPC **cortados** ([SISTEMAS.md §17](SISTEMAS.md)) |
> | `duels` / `duel_ratings` no modelo (§5) | Não existem mais |
> | Instrutor com "chrome de editor" (§7) | **Sem chrome** — skin Dev é paleta + disciplina ([CLAUDE.md §3](CLAUDE.md)) |
> | Plano de ensino escrito pelo professor (§5) | O autor **não escreve plano** — ele se materializa ([SISTEMAS.md §3](SISTEMAS.md)) |
>
> Documento-fonte para **reconstruir a plataforma do zero**, com a fundação certa.
> Substitui a diretriz "não reescrever" do `CLAUDE.md` — a decisão (14/jul/2026) é
> **reescrever**, usando o sistema antigo (`SistemaProgramacaoJogos`) **apenas como
> referência** de regras de negócio e SQL, nunca copiado sem revisão.
>
> **PT-BR sempre. Free tier sempre** (nunca propor serviço pago como caminho principal).
>
> **⭐ PRINCÍPIO Nº 0 — a UI e as animações são o produto.** O maior diferencial
> desta plataforma é a **interface e o movimento**: precisa parecer feita à mão,
> com carinho, por alguém com gosto — **nunca** dar a impressão de ter saído de um
> gerador de IA. Uma tela sem alma reprova, por mais correta que a lógica esteja.
> Detalhes em §8 (design anti-IA) e §8.1 (animação e movimento — o diferencial nº 1).

---

## 0. Por que reescrever (e o que herdar)

O sistema antigo funciona e tem regras de negócio SENAI valiosas, mas carrega
dívida de fundação que trava a evolução:

- **Duplicação de schema**: cada mudança precisa ser refletida à mão em
  `SETUP_COMPLETO.sql` **e** numa migration — fonte de divergência.
- **`class_id` legado** em várias tabelas "por compat", com "Fase 2" eterna para remover.
- **Modularidade parcial**: features ainda se costuram por atalhos contextuais e um
  "tronco" compartilhado; remover feature exige limpar links cruzados na mão.
- **Sem e2e**: só regras puras são testadas; nada valida o fluxo ponta-a-ponta.
- **Execução de código presa a Docker local** (`localhost:2000`) — não sobe em
  produção free tier.
- **Tema roxo "Aurora"** que caía nas armadilhas de "cara de IA" (aposentado).

**O que herdar como referência (é ouro, não jogar fora):**

1. O modelo **CURSO → MÓDULO → UC → TURMA** e o conceito de `class_unit`
   (turma × UC) como contêiner de tudo.
2. As **regras SENAI** já destiladas: menções (PPS/PPM/PPI, APA/RPA), aprovação
   = nota 70% + frequência 75%, frequência por aula (não por dia), matriz SAEP
   (C1–C8 × objetos A–T), rubrica SAP hierárquica.
3. O padrão **RLS sem recursão** via funções `SECURITY DEFINER`.
4. O **registro central de tipos de atividade** (nenhuma tela compara tipo por string).
5. O antifraude (paste/tempo/edições/similaridade → score de suspeita; colou = sem XP).
6. Governança hierárquica (admin → professor → aluno; sem cadastro aberto).

---

## 1. Produto — o que é

Plataforma educacional gamificada para o curso técnico SENAI de **Programação de
Jogos Digitais**. Autor = professor da turma e **único dev** (GitHub `andrensaraiva`),
alunos **menores de idade** (guardrails de IA e privacidade são requisito, não enfeite).

**A tese central — o loop "tudo num só lugar":**

```
plano de curso → aula → atividade → correção → nota + frequência → XP → relatório
```

...sem sair da plataforma, e sem retrabalho: **o dado registrado na aula vira o
documento oficial** (Papelada Zero).

**Duas caras, um sistema:**
- **Aluno** = gamificado, divertido, motivador (skin "Educacional/Caderno" por padrão).
- **Instrutor / coordenador / admin** = clean, direto, produtivo (skin "8-Dev",
  chrome de editor). Ninguém aqui perde tempo com enfeite.

---

## 2. Os quatro pilares do produto

### Pilar 1 — Jornada da UC amarrada ao plano de ensino
Cada UC de cada turma é um espaço navegável: **aprender → praticar → avaliar**,
com os blocos de aula do plano de ensino como espinha dorsal. Toda atividade,
prova, duelo, projeto pendura na UC (`class_unit`), nunca solta.

### Pilar 2 — Motor modular de atividades
Um **contrato/registro** define cada tipo de atividade como um bloco completo:
editor (professor) + player (aluno) + schema de entrega (JSONB validado por Zod) +
corretor + regra de XP. Adicionar um tipo = registrar um módulo, sem tocar nas
telas existentes. Tipos previstos: **código, pixel art / vetor, chat com NPC (IA),
link / embed, duelo X1, projeto em grupo, SAEP (quiz), SAP (rubrica)**.

### Pilar 3 — IA por gateway único server-side
Toda chamada de IA (gerar exercício, importar PPC, NPC de chat, sugerir feedback)
passa por **um gateway server-side**. A chave **nunca** vai ao cliente.
**Transcrições visíveis ao professor.** Guardrails de conteúdo (alunos menores).
Provedor: **Gemini free**, atrás de uma interface trocável.

### Pilar 4 — Papelada Zero
Gerar documentos oficiais SENAI a partir dos dados já registrados:
- **Diário de frequência** (planilha QGR-ACRED-01: colunas por aula, `F`/`.`, %
  com verde/vermelho no corte de 75%) — **primeira entrega, formato XLSX**.
- **Planejamento de UC** (3 etapas: plano/situação de aprendizagem, roteiro de
  prática, lista de verificação de critérios).
- **Livro de ocorrências** (aluno | turma / info / data / autor).
- **Menções do PPC**: PPS 80–100 / PPM 70–79 / PPI 0–69; APA/RPA;
  aprovação = 70% nota **+** 75% frequência.

---

## 3. Escopo por papel (visão funcional)

| Papel | Foco | Skin |
|---|---|---|
| **Aluno** | Resolver, entregar, provas/simulados, duelos, projetos; acompanhar nota + frequência; evoluir na gamificação (XP, moedas, conquistas, loja de temas). | Educacional (padrão) / desbloqueáveis |
| **Professor / Instrutor** | Turmas, planos, atividades, provas; corrigir e lançar nota; chamada; cockpit "Hoje"; quem precisa de atenção; Papelada Zero. | 8-Dev |
| **Coordenador** | Supervisiona qualquer turma, salas/ocupação, relatórios, pesquisas de UC. Fora da área gamificada. | 8-Dev |
| **Admin** | Governança: cria professores/admins, config institucional, stats, relatórios, feriados, cursos. `is_master_admin` = super-admin. | 8-Dev |

Sem cadastro aberto. Identidades hierárquicas (admin → professor → aluno).
Dois e-mails por pessoa (institucional + pessoal, ambos logam). Primeiro acesso
força troca de senha + completar perfil. Cada papel só vê seus menus; acesso
direto por URL fora do escopo é bloqueado.

---

## 4. Arquitetura técnica (decidida 14/jul/2026)

### Stack
| Camada | Escolha | Nota |
|---|---|---|
| **App / UI** | **SvelteKit** | ⚠️ Ver ressalva abaixo. Menos boilerplate; SSR + form actions. |
| **Backend / DB / Auth** | **Supabase** (Postgres + Auth + RLS + Storage + Realtime) | Casa do modelo educacional; RLS madura como referência. |
| **Execução de código** | **Piston público** (`emkc.org`) + **fallback próprio** | Sem Docker em produção. Ver §6. |
| **IA** | **Gemini free** via gateway server-side único | Interface trocável. |
| **Deploy** | Free tier (host que sirva SvelteKit + Node/edge functions) | Vercel Hobby ou similar; validar SSR + rate limit do Piston. |
| **Validação** | **Zod** (schemas de entrega + payloads de IA) | Fonte única de tipos. |
| **Editor de código** | Monaco ou CodeMirror 6 | CodeMirror é mais leve; avaliar na fatia de "código". |

> **⚠️ Ressalva registrada (para poder reverter cedo):** SvelteKit é ótima escolha
> de DX, mas **todo o material SENAI já escrito do sistema antigo está em
> React/Next**. Como dev solo, migrar para Svelte significa reescrever a lógica de
> UI do zero (o que você quer) e ter menos exemplos prontos para colar. Se o atrito
> pesar nas 2 primeiras semanas, **Next.js limpo** é o fallback sem vergonha — a
> modelagem de dados, RLS e regras deste blueprint são agnósticas de framework.

### Princípios de arquitetura (corrigindo a dívida antiga)

1. **Migrations são a única fonte da verdade do schema.** Nada de
   `SETUP_COMPLETO.sql` paralelo. Reset = rodar as migrations em ordem
   (+ seed separado). Cada migration é aditiva e idempotente.
2. **Sem `class_id` legado.** Toda atividade nasce ligada a `class_unit_id`.
   O modelo CURSO → UC → TURMA é o único, desde a migration 1.
3. **Feature = bloco isolado.** Uma feature depende só de: `auth`, `db`,
   kit de UI, e o **registro de features**. Feature **não** importa feature.
4. **Escrita sempre por camada server** que verifica posse **no código** antes,
   além da RLS no banco (defesa em profundidade). RLS nunca é a única barreira.
5. **RLS sem recursão** — policies só usam funções `SECURITY DEFINER`
   (`is_professor`, `is_class_owner`, `is_class_member`, `is_uc_responsible`,
   `owns_class_unit`, `is_admin`, `is_coordenador`, ...). Nunca consultar outra
   tabela RLS direto (evita `stack depth limit exceeded`).
6. **Testes de verdade desde o começo**: regras puras (unit) + **1 fluxo e2e por
   pilar** (o antigo não tinha e2e — este é o erro que mais custa).
7. **IA e execução de código atrás de interfaces** (`AiProvider`, `CodeRunner`) —
   trocar Gemini→outro ou Piston→outro é mudar 1 arquivo.

---

## 5. Modelo de dados (herdado e limpo)

Manter a espinha, remover o legado. Blocos principais:

**Currículo (o currículo vivo)**
- `courses` → `course_modules` → `curricular_units`
  (+ `uc_capabilities`, `uc_knowledge` em árvore, `uc_bibliography`).
- `teaching_plans` (do professor, **clonável**) → `teaching_plan_blocks` (aulas/blocos).
- `competency_matrices` → `competencies` (C1–C8) + `knowledge_objects` (A–T) — por curso.

**Turmas**
- `classes` (dono `owner_id`) → `class_members` → `class_groups` / `class_group_members`.
- `class_teachers` (co-docência) — helpers `is_class_teacher`, `is_uc_responsible`.
- `class_units` (**turma × UC × plano**) — o contêiner central.
- `attendance_sessions` (aula = número/período/data) → `attendance_marks`
  (presente / atraso / falta).

**Atividades (motor modular)**
- `assignments` (ligada a `class_unit_id`; enum `assignment_kind`).
- `exercises` = **banco reutilizável clonável** (catálogo entre professores);
  só a atribuição vincula à UC. `assignments` ↔ `assignment_exercises` ↔ `exercises`.
- `submissions`: entrega **tipada por JSONB** validado no registro do tipo
  (código, link, texto, canvas, transcrição de chat...), com `group_id` para grupo.
  Status: `rodando | aprovado | reprovado | erro | entregue`; `manual_grade` / `manual_feedback`.
- Antifraude em `submissions`: eventos de paste, tempo, edições, score de suspeita,
  similaridade entre alunos. Colou → sem XP.

**Avaliações específicas**
- SAEP: `quiz_questions` + `quiz_options` (A–E, correta + justificativa) → `quiz_simulados`
  → `quiz_attempts` / `quiz_answers` (correção automática).
- SAP: rubrica `Unidade → Elemento → Critério → Item (Sim/Não + pontos)`, cada item
  ligado a competência/objeto.
- Projeto integrador: `projects` → `project_sprints` → `project_tasks` (board realtime).
- Duelos: `duels` + `duel_ratings` (ELO **contextual por UC**, não global).

**Gamificação e cosméticos**
- `profiles.xp` / `level` / `streak`; moedas derivadas do nível.
- `user_cosmetics` + **registro de cosméticos** — inclui **temas/skins compráveis** (§8).
- Conquistas (badges) + "constelação" no perfil.

**Governança**
- `profiles.role ∈ aluno | professor | coordenador | admin`; `is_master_admin`.
- `notifications` (in-app), configurações institucionais (cortes de nota/frequência),
  feriados, salas (`rooms`) + ocupação, calendário do curso por turma.

> Documentos oficiais (Papelada Zero) **não** são tabelas novas — são
> **projeções/geradores** que leem frequência, notas e plano. O dado nasce uma vez.

---

## 6. Execução de código sem Docker (o ponto que quebrava)

Interface `CodeRunner` com implementações plugáveis por linguagem/atividade:

1. **Piston público** (`emkc.org/api/v2/piston`) — linguagens gerais. Free, com
   **rate limit** — por isso: fila server-side + cache de resultado por
   (código, casos de teste) + degradação graciosa quando limitado.
2. **Fallback próprio** — quando o Piston público falhar/limitar, opção de
   self-host do Piston (dev local) e/ou runner serverless dedicado.
3. **Client-side quando fizer sentido** (JS/TS via sandbox no browser; Python via
   Pyodide) — casa com curso de jogos, custo zero de servidor, feedback instantâneo.
   Linguagens compiladas continuam no Piston.

O **motor de atividades decide o runner por tipo** — cada tipo de atividade de
código declara qual runner usa. Casos de teste (inclusive **ocultos**, só na
correção final) fazem parte do contrato do exercício, não da tela.

---

## 7. Skins e temas (decisão de design + produto)

### Duas skins base (cada uma com claro/escuro)
- **Educacional / "Caderno"** — **padrão do aluno**: papel pautado, tinta azul
  `#26374F`, marca-texto `#FFE873`, títulos em Caveat, grifos/tape/red pen.
- **8-Dev / "estacao-dev"** — instrutor/coordenador/admin: grafite `#0E1217`,
  âmbar `#FFB454`, JetBrains Mono, chrome de editor.

Skin resolvida por **papel** (atributo `data-skin` no shell); modo claro/escuro por
usuário (classe no `<html>`, com anti-flash antes da hidratação e persistência).

### Temas como recompensa (decidido: Educacional é o padrão)
- **Todo aluno começa no "Caderno"** (educacional).
- **Os outros estilos do protótipo viram itens da loja**, comprados com pontos/XP
  e aplicados como **skin da conta**.
- **Cosmético puro**: um tema só muda aparência (cores/fontes/textura), **nunca**
  usabilidade nem conteúdo — para não criar vantagem/desvantagem entre alunos.
- **Desbloqueio permanente** por pontos (não consome moeda recorrente); alguns
  podem ter trava por nível como marco de progressão.
- Instrutor/admin **não** trocam de skin (produtividade > estética); ficam no 8-Dev.

Fonte da verdade visual: `DESIGN.md` (4 paletas, primitivos, proibições anti-IA).
Protótipo de referência: [prototipos/celeste-6-estilos.html](prototipos/celeste-6-estilos.html)
(auto-contido, fontes em base64), views F (Caderno) e H (Dev).

---

## 8. Design — regra crítica (anti-IA)

**Proibido** (marcas de "feito por IA"): gradiente roxo→azul, glassmorphism,
glow shadows, borda esquerda colorida em card, badge acima de H1, emoji em
navegação, fontes Inter / Space Grotesk, labels CAPS cinza.

**Manter** o conceito celestial (lua, constelação, ouro) com execução própria.
Fontes: Schibsted Grotesk (corpo), Caveat (display caderno), JetBrains Mono
(display dev + código). O tema "Aurora Minimal" (roxo) está **aposentado**.

Requisitos transversais de UI: **imprimível** (relatórios via `window.print()` sem
quebrar), **acessível** (foco visível, teclado, contraste — alunos menores e
inclusão), **PT-BR** em tudo, erros úteis e específicos, toasts em vez de `alert()`.

### 8.1 Animação e movimento (o diferencial nº 1)

Movimento é onde a maioria das interfaces "de IA" se entrega — ou não tem nenhum
(tudo aparece de estalo), ou tem o pacote genérico (fade-in de tudo, `transition:
all`, hover que só escurece). Aqui o movimento é **assinatura do produto**, tratado
com o mesmo cuidado da cor e da tipografia.

**Como acertar:**
- **Movimento com intenção**, não decoração. Toda animação responde a uma ação do
  usuário ou comunica uma mudança de estado (algo entrou, saiu, foi salvo, subiu de
  nível). Nada se mexe "só porque fica bonito".
- **Física, não curvas padrão.** Preferir **spring / easing próprios** a
  `ease-in-out` genérico. Peso e elasticidade coerentes com a skin: no Caderno o
  movimento é de papel/tinta (grifo que "pinta", página que vira, tape que gruda);
  no 8-Dev é de terminal/editor (cursor, typing, slide de painel, log que rola).
- **SvelteKit ajuda de graça:** usar `svelte/transition`, `svelte/animate` (FLIP em
  listas) e `svelte/motion` (`spring`, `tweened`) — movimento reativo nativo, sem
  biblioteca pesada. Só trazer algo externo se um efeito exigir.
- **Micro-interações em tudo que importa:** botão que responde, entrega que
  "voa" para o lugar certo, XP que preenche a barra, conquista que **acende como
  estrela na constelação**, correção que revela resultado com ritmo (não pisca).
- **Estados de carregamento com personalidade** — skeletons e transições que
  mantêm a skin, nunca um spinner genérico centralizado.
- **Coerência de duração/curva** entre telas: um pequeno conjunto de tokens de
  movimento (durações e springs nomeados), como há tokens de cor. Movimento
  inconsistente entre telas grita "gerado".

**Proibido (marcas de movimento "de IA"):** `transition: all`; fade-in
indiscriminado em toda a página ao carregar; parallax gratuito; hover que só muda
opacidade/cor sem propósito; animações que ignoram `prefers-reduced-motion`.

**Acessibilidade:** **respeitar `prefers-reduced-motion`** sempre — quem pediu
menos movimento recebe transições mínimas ou nenhuma, sem quebrar o fluxo. Animação
nunca é a única forma de comunicar um estado.

**Régua de qualidade:** antes de dar uma tela por pronta, a pergunta não é só "está
correta?", é **"parece feita por alguém com gosto, ou parece gerada?"**. Se a
segunda, a tela não está pronta.

---

## 9. Ordem de construção

> Decisão sua: **pensar o sistema completo primeiro, depois construir de uma vez.**
> Este blueprint é essa visão completa. A ordem abaixo é a **sequência de fundação
> → fatias**, para que "de uma vez" não vire caos — cada camada destrava a próxima,
> mas o desenho de todas já está fechado aqui.

**Fase 0 — Fundação (antes de qualquer feature):**
1. Repo SvelteKit + Supabase, deploy free tier funcionando (hello world com auth).
2. Migrations como fonte única; RLS helpers `SECURITY DEFINER` desde a migration 1.
3. Kit de UI + tokens das 2 skins (claro/escuro) **+ tokens de movimento**
   (durações/springs nomeados, §8.1) + shell por papel. UI e animação são o
   diferencial nº 1 — investir aqui desde a fundação, não deixar para "polir depois".
4. Interfaces `AiProvider` e `CodeRunner` (stubs) + gateway de IA server-side.
5. Registro de features + registro de tipos de atividade (contrato vazio, testável).

**Fase 1 — Espinha do currículo e turmas:** CURSO → MÓDULO → UC → TURMA →
`class_unit`; plano de ensino em blocos; membros e grupos; identidades hierárquicas.

**Fase 2 — Jornada da UC + primeiro tipo de atividade (código):** UC navegável
(aprender→praticar); atividade de código com Piston público + casos de teste +
correção automática → nota/XP; antifraude. Prova o motor **e** o loop central.

**Fase 3 — Cockpit "Hoje" do instrutor + frequência:** chamada por aula; painel
"Hoje"; nota manual; quem precisa de atenção.

**Fase 4 — Papelada Zero:** diário de frequência **XLSX** primeiro; depois
Planejamento de UC (3 etapas), ocorrências, menções/situação.

**Fase 5 — Avaliações formais:** SAEP (banco + simulado + dashboard por competência)
e SAP (rubrica). Radar de competências.

**Fase 6 — Mais tipos de atividade:** pixel art/vetor, chat com NPC (IA), duelo X1,
projeto integrador (board realtime), link/embed.

**Fase 7 — Gamificação plena + loja de temas:** XP/níveis/moedas/streak/missões/
conquistas/constelação/ranking; **loja com os temas desbloqueáveis** (§7).

**Fase 8 — Mural/feed estilo Classroom:** por último (é enfeite social, não o core).

**Regra de ouro por fatia:** nenhuma fatia é "pronta" sem (a) **1 teste e2e** do
fluxo que ela entrega — a ausência disso foi o que mais doeu no sistema antigo — e
(b) passar na **régua de UI/movimento** (§8.1): "parece feita por alguém com gosto,
ou parece gerada?".

---

## 10. Papelada de referência (formatos oficiais a reproduzir)

- **Frequência**: planilha QGR-ACRED-01 (colunas por aula, `F`/`.`, % com
  verde/vermelho no corte de 75%).
- **Planejamento de UC SENAI**: 3 etapas (planejamento/situação de aprendizagem,
  roteiro de prática, lista de verificação de critérios).
- **Matriz SAEP/SAP**: capacidades C1–C8 × elementos de competência × objetos de
  conhecimento A–T.
- **Ocorrências**: tabela aluno | turma / informações / data / autor.
- **PPC completo** (Técnico em Programação de Jogos Digitais, SESI/SENAI-ES) —
  usar para importação de currículo por IA.

---

## 11. Decisões travadas (14/jul/2026)

| # | Decisão | Escolha |
|---|---|---|
| 1 | Sistema antigo vira o quê | **Referência apenas** (repo novo, nada copiado sem revisão). |
| 2 | Temas por pontos | **Educacional é o padrão**; demais estilos = itens de loja (cosmético puro, desbloqueio permanente). |
| 3 | Stack de app | **SvelteKit** (com ressalva de reversão para Next limpo — §4). |
| 4 | Backend/DB/Auth | **Supabase** (Postgres + Auth + RLS + Storage + Realtime). |
| 5 | Execução de código | **Piston público + fallback próprio**, sem Docker em produção; runner por tipo de atividade. |
| 6 | Estratégia de entrega | **Desenhar o sistema completo primeiro** (este doc), depois construir por fases de fundação→fatias, cada fatia com e2e. |

**Pendências de produto (não bloqueiam a fundação):** catálogo exato de temas da
loja e preços em pontos; escolha final Monaco vs CodeMirror; host free tier
definitivo (validar SSR do SvelteKit + rate limit do Piston público em produção).
