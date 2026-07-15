# Celeste Academy — sistemaescolar

Contexto do projeto para qualquer sessão de Claude Code, em qualquer máquina.
**Responda sempre em PT-BR.** Soluções sempre em **free tier** (Vercel Hobby, Supabase Free, Gemini free, GitHub) — nunca proponha serviço pago como caminho principal.

## O que é

Plataforma educacional gamificada para curso técnico SENAI de **Programação de Jogos Digitais**. O autor é o professor da turma e único dev (GitHub `andrensaraiva`). Alunos são **menores de idade** (guardrails de IA e privacidade são requisito).

> **DECISÃO 14/jul/2026 — REESCREVER DO ZERO.** A diretriz antiga ("não reescrever, evoluir o codebase") está **superada**. O plano completo está em **[BLUEPRINT.md](BLUEPRINT.md)** (leia-o antes de qualquer coisa). O projeto **`SistemaProgramacaoJogos`** (Next.js + Supabase + Piston Docker + Gemini; modelo CURSO→UC→TURMA, código+correção automática, antifraude, gamificação, SAEP/SAP, RLS madura, ~50 migrations) passa a ser **referência apenas** — consultar regras de negócio e SQL, nunca copiar sem revisão.

**Stack da reescrita (ver BLUEPRINT §4):** SvelteKit + Supabase (Postgres/Auth/RLS/Storage/Realtime) + Piston público (sem Docker em prod) + Gemini via gateway server-side. Ressalva: reverter para Next.js limpo é o fallback aceito se o atrito com Svelte pesar.

**Diferencial nº 1 (BLUEPRINT §8/§8.1): UI e animações.** A interface e o movimento são o produto — feitos à mão, com gosto, e **nunca** com cara de gerado por IA.

## Visão (decidida em jul/2026)

1. **Loop "tudo em um só lugar"**: plano de curso → aula → atividade → correção → nota/frequência → XP → relatório, sem sair da plataforma.
2. **Duas caras, um sistema**: aluno = gamificado e divertido; **instrutor = clean e fácil, estilo Teams**.
3. **Motor modular de atividades**: contrato/registro de tipos (editor do professor + player do aluno + schema de entrega JSONB/Zod + corretor + XP por tipo). Tipos: código, pixel art/vetor, chat com NPC (IA), link/embed, duelo X1, projeto em grupo. IA sempre por gateway server-side único (chave nunca no cliente; transcrições visíveis ao professor; guardrails — alunos são menores).
4. **Papelada Zero**: gerar documentos oficiais SENAI a partir dos dados já registrados — diário de frequência (planilha QGR, F/`.`/%, corte 75%), Planejamento de UC (3 etapas: plano, roteiro de prática, lista de verificação), livro de ocorrências, menções do PPC (PPS 80-100 / PPM 70-79 / PPI 0-69; APA/RPA; aprovação = 70% + frequência 75%).

Prioridade de construção: (1) Jornada da UC amarrada aos blocos do plano de ensino; (2) cockpit "Hoje" do instrutor; (3) Papelada Zero (diário XLSX primeiro); (4) radar de competências SAEP; (5) mural/feed estilo Classroom por último.

## Design — regra crítica

**A UI não pode parecer feita por IA.** Proibido: gradiente roxo→azul, glassmorphism, glow shadows, borda esquerda colorida em card, badge acima de H1, emoji em navegação, Inter/Space Grotesk, labels CAPS cinza. Manter o conceito celestial (lua, constelação, ouro) com execução própria.

**DECISÃO TOMADA (13/jul/2026):** duas skins, cada uma com modo claro e escuro —
- **Aluno = "Caderno"** (estilo F do protótipo: papel pautado, tinta azul #26374F, marca-texto #FFE873, títulos em Caveat);
- **Instrutor/admin/coordenador = "Dev"** (estilo H "estacao-dev": grafite #0E1217, âmbar #FFB454, JetBrains Mono, chrome de editor).

A fonte da verdade do design é o **`DESIGN.md` na raiz do `SistemaProgramacaoJogos`** (4 paletas completas, primitivos visuais, proibições anti-IA). Os tokens já estão implementados em `web/src/app/globals.css` (skin via `data-skin` no layout `(app)` por papel; modo via `.dark` no `<html>`). Fontes: Schibsted Grotesk (corpo), Caveat (display caderno), JetBrains Mono (display dev + código). O tema antigo "Aurora Minimal" (roxo) foi aposentado.

Protótipo de referência (9 estilos × 2 visões): https://claude.ai/code/artifact/9f5a0dbc-e463-4f7c-b03f-39ff09a08155 — fonte em [prototipos/celeste-6-estilos.html](prototipos/celeste-6-estilos.html) (auto-contido, fontes em base64), views F e H. Próxima etapa de design: passada de componentes (pauta no painel do aluno, chrome de editor no shell do instrutor, grifos/tape/red pen).

## Papelada de referência (formatos oficiais a reproduzir)

- Controle de frequência: planilha QGR-ACRED-01 (colunas por aula, F/`.`, % com verde/vermelho no corte de 75%).
- Planejamento de Unidade Curricular SENAI: 3 etapas (planejamento da UC/situação de aprendizagem, roteiro de prática, lista de verificação de critérios).
- Matriz SAEP/SAP: capacidades C1–C8 × elementos de competência × objetos de conhecimento A–T.
- Ocorrências: tabela aluno|turma / informações / data / autor.
- PPC completo do curso (Técnico em Programação de Jogos Digitais, SESI/SENAI-ES) — usar para importação de currículo por IA.
