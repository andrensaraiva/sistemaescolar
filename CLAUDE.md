# Celeste Academy — sistemaescolar

Índice e leis do projeto. Carregado em toda sessão de Claude Code — **mantenha enxuto**.
O detalhe mora nos docs de §4. Se algo aqui contradiz um doc de detalhe, o doc de
detalhe ganha e este arquivo está desatualizado — corrija-o.

**Responda sempre em PT-BR.** Soluções sempre em **free tier** (Vercel Hobby, Supabase
Free, Gemini free, GitHub) — nunca proponha serviço pago como caminho principal.

---

## 1. O que é

Plataforma educacional gamificada para o técnico SENAI de **Programação de Jogos
Digitais**. O autor é professor do curso e **único dev** (GitHub `andrensaraiva`):
**4+ turmas, 100+ alunos**, todos **menores de idade** (guardrails de IA e privacidade
são requisito, não enfeite).

**A dor central — o motivo do produto existir:**

> **Com 100+ alunos, você perde gente de vista e descobre tarde.**

Isso define a tese, e ela **inverteu** em 15/jul/2026:

```
NÃO É:  registre a aula → gere o documento oficial
É:      registre a aula → veja quem está afundando — e o documento sai de graça
```

Chamada e correção são **sensores do radar**. A Papelada Zero é **subproduto** (vale
muito — ×4 turmas de retrabalho eliminado — mas não é o motivo). O radar de risco é o
core; a gamificação do aluno é o meio de mantê-lo produzindo sinal.

**Reescrita do zero** (decisão 14/jul/2026). O projeto antigo `SistemaProgramacaoJogos`
é **referência apenas** — consultar regras de negócio e SQL, nunca copiar sem revisão.
Stack, modelo de dados e RLS em [BLUEPRINT.md](BLUEPRINT.md).

---

## 2. Leis invioláveis

Uma tela ou um PR que quebre qualquer uma destas não está pronto.

### Lei 0 — a que gera quase todas as outras

> **A plataforma mede; o humano julga.**

A IA sugere → **você** confirma. O antifraude dá score → **você** dá o veredito. O grupo
se avalia → **você** arbitra. O radar mostra → **você** age. A notificação dá o dado →
**o aluno** conclui. Nenhuma delas foi decidida olhando as outras; todas convergiram
aqui.

Em dúvida sobre qualquer decisão de produto, pergunte: *isto está fazendo a máquina
julgar uma pessoa?* Se estiver, está errado. Vale em dobro porque os alunos são
**menores de idade** — a máquina não tem autoridade moral sobre eles, e você tem.

### Lei 1 — a que decide se a plataforma dá ou tira tempo

> **Nada começa em branco.**

A tela em branco é o inimigo de um professor solo com 4 turmas. Toda criação parte de
algo: o plano **clona** do semestre passado · o exercício **clona** do banco (comum a
todos os docentes) · o Planejamento de UC a **IA rascunha** · o briefing do substituto
vem do **rastro** · a nota a **IA sugere** · o dossiê do aluno é **projeção** dos
sensores.

Se uma tela de criação abre vazia e espera que você escreva, ela está cobrando trabalho
em vez de devolver. Reveja.

### Produto
1. **Desktop produz; celular consulta e recebe.** Vale para aluno **e** instrutor.
   Exercício de código não precisa funcionar no celular — assumido, não lamentado.
2. **XP e nota nunca aparecem sozinhos.** XP mede esforço; nota mede competência
   (aprovação = 70% nota **+** 75% frequência). Nenhum aluno pode chegar em nível 30 e
   descobrir tarde que reprovou. Número sem régua é ansiedade: `8,2 · aprova com 7,0`.
3. **A gamificação acontece onde o trabalho acontece.** A barra de XP enche na tela da
   correção, não num painel à parte. O painel lembra; nunca é o palco.
4. **A Celeste não finge ser o sistema da escola.** UC sem conteúdo **não aparece** —
   sem card vazio, sem "em breve". Quando um colega adota, a UC nasce.
5. **Lista vazia não aparece.** Numa semana boa, o bloco de atenção some inteiro.
   Cockpit de tamanho fixo vira papel de parede.
6. **Nenhum aluno é publicamente o último.** Liga (fases da lua), nunca lista ordenada
   da turma inteira.
7. **Não existe "aceitar todas"** na correção. Nenhuma variante. Você assina nota de
   menor de idade.
8. **O radar nunca agrega, rankeia ou compara professor.** A adoção voluntária dos
   colegas morre no dia em que a ferramenta dedurar quem quer que seja.
9. **Ausência de dado nunca pune.** Chamada esquecida não quebra o streak de ninguém.
10. **A IA nunca fala com o aluno.** Toda saída de IA passa por um humano antes de
    chegar a um menor de idade. Todos os usos são voltados a adulto (importar PPC,
    gerar exercício, sugerir feedback) — o chat com NPC foi cortado justamente por ser
    o único caminho IA→aluno. A mediação não é um filtro que pode falhar: é a
    arquitetura.
11. **IA, o resto**: gateway server-side único, chave nunca no cliente. **Nunca fecha
    nota sozinha**, **nunca julga fraude** — o antifraude dá score, o humano dá veredito.

### Design — a UI é o produto
12. **Proibido** (marcas de "feito por IA"): gradiente roxo→azul, glassmorphism, glow
    shadows, borda esquerda colorida em card, badge acima de H1, emoji em navegação,
    fontes Inter / Space Grotesk, **labels CAPS cinza**.
13. **"Cara de IA" mora na estrutura, não na cor.** Trocar paleta não resolve layout de
    template, hierarquia plana e KPI de vaidade. Ver [ANALISE-UX.md §2](ANALISE-UX.md) —
    é caminho crítico, principalmente para a skin do instrutor (§3 aqui).
14. **Movimento é assinatura**: com intenção, física própria, tokens nomeados.
    Proibido: `transition:all`, fade-in de página no load, parallax, hover que só muda
    opacidade, animação infinita na periferia, ignorar `prefers-reduced-motion`.
15. **Régua final:** *"parece feita por alguém com gosto, ou parece gerada?"* Se a
    segunda, não está pronta.

### Acessibilidade — requisito, não polimento
16. Foco visível é **token da skin** (`--focus`), nunca cor fixa (âmbar sobre papel dá
    1.8:1 — reprovado). Piso de **12px**. Tudo que clica é `<button>`. `aria-live` no
    XP, no toast e no resultado da correção. `prefers-reduced-motion` respeitado.
    `@media print` desde o começo (a Papelada depende dele). Erros em PT-BR,
    específicos, com saída. Toast, nunca `alert()`.

---

## 3. Design — o essencial

**Duas skins, cada uma com claro e escuro** — as 4 variantes, decidido 15/jul/2026:

- **Aluno = "Caderno"**: papel `#FDFBF2`, tinta `#26374F`, marca-texto `#FFE873`,
  títulos em Caveat. **O escuro não é papel invertido** — é o caderno ao luar: o creme
  vira grafite azulado, a pauta escurece em vez de clarear, a tinta vira giz. (Conversa
  com o conceito celestial: lua, constelação, ouro.)
- **Instrutor / coordenador = "Dev"**: grafite `#0E1217`, âmbar `#FFB454`, JetBrains
  Mono, layout de app limpo. **Sem chrome de editor** (sem abas, sem árvore) — decidido.
  Por isso a personalidade vem de **disciplina, não de enfeite**: mono **só** onde
  número alinha (nunca em nome, título ou enunciado); âmbar **só** no que é acionável;
  `~/` como marca tipográfica; densidade real.

Skin resolvida **por papel**, `data-skin` no `<html>`. **O professor vê tudo em Dev,
inclusive preview de atividade** — nunca duas skins na tela ao mesmo tempo. (Custo
aceito: você monta a atividade e não vê como ela chega ao aluno. Mitigação opcional:
uma conta-aluno de teste sua na turma.)

Fontes: Schibsted Grotesk (corpo), Caveat (display caderno), JetBrains Mono (dados +
código). "Aurora Minimal" (roxo) **aposentado**.

**Os tokens completos das 4 variantes, a tipografia, a regra da pauta e o movimento
estão em [DESIGN.md](DESIGN.md)** — escrito depois do protótipo, com tudo já visto.

**Protótipos aprovados (15/jul/2026)** — [atividade nas 4 variantes](https://claude.ai/code/artifact/e361eb92-e48f-444b-8835-06ce5dec1aeb)
· [fila de correção](https://claude.ai/code/artifact/5d3d8b65-e601-458b-a86b-abc8e8a3c6e9).
Fontes em [prototipos/](prototipos/). A skin Dev **sem chrome** foi testada na fila (a
tela mais dura possível) e aprovada: a disciplina bastou.

O protótipo antigo ([prototipos/celeste-6-estilos.html](prototipos/celeste-6-estilos.html),
9 estilos × 2 dashboards) serve hoje só como paleta dos estilos **não** escolhidos, para
a loja de temas. Para o resto está superado — ver [ANALISE-UX.md](ANALISE-UX.md).

---

## 4. Índice

| Doc | O que tem |
|---|---|
| **[ESTADO.md](ESTADO.md)** | **Onde a construção parou.** Handoff entre sessões: o que existe, o que está aberto, as armadilhas já pagas. Leia antes de escrever código. |
| **[SISTEMAS.md](SISTEMAS.md)** | **O mapa do produto completo.** Todos os sistemas, o que cada um faz, status, o que foi cortado e a ordem de construção. Comece por aqui. |
| [BLUEPRINT.md](BLUEPRINT.md) | Arquitetura, stack, modelo de dados, RLS. ⚠️ O §9 (ordem de construção) foi invertido pela dor central — vale o de [SISTEMAS.md](SISTEMAS.md). |
| [ANALISE-UX.md](ANALISE-UX.md) | Auditoria crítica que originou as decisões de 15/jul. Leia antes de mexer em design. |
| [PERFIL-ALUNO.md](PERFIL-ALUNO.md) | Home "Hoje", os dois eixos, tentativas por tipo, liga/streak/céu, estados vazios. |
| [PERFIL-INSTRUTOR.md](PERFIL-INSTRUTOR.md) | Cockpit, as 2 listas de atenção, fila de correção, chamada, o que é a skin Dev. |
| [PERFIL-COORDENADOR.md](PERFIL-COORDENADOR.md) | Radar agregado, **substituição por falta**, aviso de escopo. |
| [PERFIL-ADMIN.md](PERFIL-ADMIN.md) | Área separada. Otimizado **contra o erro**, não para velocidade. |
| [DESIGN.md](DESIGN.md) | **Fonte da verdade visual.** Tokens das 4 variantes, tipografia, a regra da pauta, movimento, contrastes medidos. |

**Papelada de referência** (formatos oficiais a reproduzir): diário QGR-ACRED-01
(colunas por aula, `F`/`.`, % com corte 75% verde/vermelho); Planejamento de UC SENAI
(3 etapas: plano/situação de aprendizagem, roteiro de prática, lista de verificação);
matriz SAEP/SAP (C1–C8 × objetos A–T); ocorrências (aluno|turma / info / data /
**autor**); menções do PPC (PPS 80–100 / PPM 70–79 / PPI 0–69; APA/RPA); PPC completo
do curso (para importação de currículo por IA).

> **Todo lançamento tem autor** (`registered_by`) — frequência e nota, não só
> ocorrência. Exigido pela substituição por falta: o diário mostra quem aplicou cada
> aula.

---

## 5. Estado — o que ainda está aberto

> **Código:** a **Fase 0 (Fundação) está construída** em [web/](web/) — SvelteKit +
> Supabase, kit de UI das 4 skins, migration 1 com RLS provada contra 7 ataques,
> gateway de IA e registros. Falta fechar 1 bug de e2e e implantar.
> **O detalhe vive em [ESTADO.md](ESTADO.md)** — este parágrafo só aponta pra lá.

**Perfis:** os quatro definidos e **inventariados** (15/jul/2026) — cada PERFIL-*.md tem
a lista completa do que **tem**, do que **não tem por decisão** (não por falta de tempo)
e do que está aberto.

**Sistemas:** mapeados em [SISTEMAS.md](SISTEMAS.md) com status por sistema. Os menos
definidos são **currículo** (o fluxo de revisão do import de PPC) e **notificações**.

**O maior risco técnico** segue sendo o **rate limit do Piston público** com 100+ alunos
rodando na mesma aula — mas ele **saiu da Fase 1**: pseudocódigo declara `runner: none` e
prova o motor inteiro sem encostar nele. O risco é por linguagem, não do sistema, e só
volta na UC de Jogos (C#).

**Design:** as 4 variantes existem, foram testadas em duas telas reais e estão aprovadas
([DESIGN.md](DESIGN.md)). Feitas: **atividade** (o maior buraco do produto) e **fila de
correção** (a maior alavanca de tempo). Faltam: **chamada**, **jornada da UC**, **"Hoje"
do aluno no celular** (o único mobile-first, e o teste que falta pro Caderno) e
`@media print`.
