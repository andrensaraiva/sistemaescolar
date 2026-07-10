# Celeste Academy — sistemaescolar

Contexto do projeto para qualquer sessão de Claude Code, em qualquer máquina.
**Responda sempre em PT-BR.** Soluções sempre em **free tier** (Vercel Hobby, Supabase Free, Gemini free, GitHub) — nunca proponha serviço pago como caminho principal.

## O que é

Plataforma educacional gamificada para curso técnico SENAI de **Programação de Jogos Digitais**. O autor é o professor da turma e único dev (GitHub `andrensaraiva`). O codebase principal já existe no projeto **`SistemaProgramacaoJogos`** (Next.js + Supabase + Piston local via Docker + Gemini): turmas, modelo CURSO→UC→TURMA, exercícios de código com correção automática, antifraude, gamificação (XP/streak/loja/conquistas), SAEP/SAP, calendário, relatórios, RLS madura (~50 migrations). **Não reescrever do zero — evoluir aquele codebase.**

## Visão (decidida em jul/2026)

1. **Loop "tudo em um só lugar"**: plano de curso → aula → atividade → correção → nota/frequência → XP → relatório, sem sair da plataforma.
2. **Duas caras, um sistema**: aluno = gamificado e divertido; **instrutor = clean e fácil, estilo Teams**.
3. **Motor modular de atividades**: contrato/registro de tipos (editor do professor + player do aluno + schema de entrega JSONB/Zod + corretor + XP por tipo). Tipos: código, pixel art/vetor, chat com NPC (IA), link/embed, duelo X1, projeto em grupo. IA sempre por gateway server-side único (chave nunca no cliente; transcrições visíveis ao professor; guardrails — alunos são menores).
4. **Papelada Zero**: gerar documentos oficiais SENAI a partir dos dados já registrados — diário de frequência (planilha QGR, F/`.`/%, corte 75%), Planejamento de UC (3 etapas: plano, roteiro de prática, lista de verificação), livro de ocorrências, menções do PPC (PPS 80-100 / PPM 70-79 / PPI 0-69; APA/RPA; aprovação = 70% + frequência 75%).

Prioridade de construção: (1) Jornada da UC amarrada aos blocos do plano de ensino; (2) cockpit "Hoje" do instrutor; (3) Papelada Zero (diário XLSX primeiro); (4) radar de competências SAEP; (5) mural/feed estilo Classroom por último.

## Design — regra crítica

**A UI não pode parecer feita por IA.** Proibido: gradiente roxo→azul, glassmorphism, glow shadows, borda esquerda colorida em card, badge acima de H1, emoji em navegação, Inter/Space Grotesk, labels CAPS cinza. Manter o conceito celestial (lua, constelação, ouro) com execução própria.

**Protótipo de 6 estilos × 2 visões (aluno/instrutor)** publicado em:
https://claude.ai/code/artifact/9f5a0dbc-e463-4f7c-b03f-39ff09a08155
Fonte em [prototipos/celeste-6-estilos.html](prototipos/celeste-6-estilos.html) (auto-contido, fontes em base64 — abra no navegador). Estilos: A HUD Celestial (navy #0A0F1E + ouro #E8B44C, Clash Display), B Sticker Brutalista, C Pixel Arcade, D Editorial Acadêmico (papel + verde #1E5C46, Fraunces), E Grafite Pro (grafite + azul-aço #6EA8FF, IBM Plex Mono), F Caderno do Aluno (Caveat). Arquitetura do protótipo: componentes compartilhados dirigidos por CSS vars (tokens por estilo) — mesma abordagem planejada para o produto. **Decisão de estilo ainda pendente** — quando o autor escolher, transformar em DESIGN.md + kit de componentes.

## Papelada de referência (formatos oficiais a reproduzir)

- Controle de frequência: planilha QGR-ACRED-01 (colunas por aula, F/`.`, % com verde/vermelho no corte de 75%).
- Planejamento de Unidade Curricular SENAI: 3 etapas (planejamento da UC/situação de aprendizagem, roteiro de prática, lista de verificação de critérios).
- Matriz SAEP/SAP: capacidades C1–C8 × elementos de competência × objetos de conhecimento A–T.
- Ocorrências: tabela aluno|turma / informações / data / autor.
- PPC completo do curso (Técnico em Programação de Jogos Digitais, SESI/SENAI-ES) — usar para importação de currículo por IA.
