# Análise de UI/UX — Celeste Academy

> Auditoria crítica do estado atual do design (protótipo `celeste-6-estilos.html` +
> decisões de `CLAUDE.md` e `BLUEPRINT.md`), feita em 15/jul/2026.
> Escrita para o dev solo que também é o professor da turma.
>
> **Ressalva de escopo:** o projeto antigo (`SistemaProgramacaoJogos`) não está nesta
> máquina. A leitura sobre "o design antigo" vem da descrição nos docs, não do código.
> Tudo que é afirmação técnica abaixo foi verificado no protótipo.

---

## 1. Veredito em um parágrafo

O protótipo é bem-feito: tokens limpos, `transition:all` zero, `prefers-reduced-motion`
tratado a sério, momentos de movimento realmente autorais. O problema não é a
qualidade da execução — é o **escopo da decisão**. Foram desenhadas 9 peles para
2 dashboards, e a escolha F/H foi feita olhando as duas telas que menos importam.
As telas onde o produto realmente vive (resolver exercício, corrigir, fazer chamada,
montar plano) **não existem em nenhum dos 9 estilos**. É por isso que existe risco
concreto de você não gostar do design novo daqui a três meses, pelo mesmo motivo que
não gostou do antigo — e a seção 2 é sobre isso.

---

## 2. O diagnóstico central: trocou-se a pele, não a estrutura

Você não gostou do Aurora roxo e o aposentou. Mas repare no que mudou de fato entre
o Aurora e o Caderno: **paleta e fonte**. A estrutura das telas é idêntica — e é a
mesma nos 9 estilos, porque no protótipo os 9 compartilham um único sistema de
componentes (`.greet`, `.lvlcard`, `.trilha`, `.agrid3`, `.pkpis`, `.ptbl`). Trocar
`--acc` e `--fd` gera uma tela diferente aos olhos e a mesma tela na estrutura.

"Cara de IA" quase nunca mora na cor. Mora em:

- **Layout**: tudo dentro de um `max-width:1180px` centralizado, grade de cards
  equivalentes, fileira de KPIs no topo. O protótipo faz exatamente isso, nos 9.
- **Hierarquia plana**: todo bloco tem o mesmo peso visual. Numa tela de professor,
  "Presença média 87%" ocupa a mesma nobreza que "chamada pendente às 07:00" — e uma
  é vaidade, a outra é a única coisa que exige ação nos próximos 10 minutos.
- **Conteúdo genérico**: rótulo curto, número grande, delta colorido, repetir 4×.

O Aurora tinha essa estrutura em roxo. O Caderno tem essa estrutura em creme. Se a
insatisfação com o antigo era estética, o Caderno resolve; se era a sensação de
"parece um template", ele não resolve, e vai reaparecer.

**A consequência prática:** enquanto a estrutura das telas de verdade não for
desenhada, a decisão F/H é reversível demais para valer o que se está apostando nela.

---

## 3. O que o protótipo prova — e o que não prova

**Prova:** que os tokens funcionam; que dá pra dirigir 9 personalidades por variáveis
CSS; que o movimento pode ter assinatura (o marca-texto que pinta em F, o sublinhado
que corre em D, o sheen em A, a barra em `steps(10)` em C); que você tem gosto.

**Não prova nada sobre:**

| Superfície | Existe no protótipo? | Peso no produto |
|---|---|---|
| Aluno resolvendo exercício de código (editor + testes + resultado) | ❌ | O loop central (Fase 2 do blueprint) |
| Fila/tela de correção do professor | ❌ (só uma tabela com botão "Revisar") | Onde o professor passa o tempo dele |
| Chamada de frequência | ❌ (só um botão "Fazer chamada") | Diário, 75%, Papelada Zero |
| Jornada da UC navegável | ❌ (só uma trilha de 5 bolinhas decorativas) | Pilar 1 |
| Montar plano de ensino / criar exercício / rubrica SAP | ❌ | As telas mais complexas do sistema |
| Estados vazio / carregando / erro / sem permissão | ❌ | A primeira tela da vida de todo aluno |
| Modo prova (lockdown) | ❌ | Mudança radical de UI |
| Caderno escuro e Dev claro | ❌ — **zero** ocorrências de `prefers-color-scheme` ou `data-theme` | Metade da decisão travada |

Essa última linha merece destaque. `BLUEPRINT.md §7` e `CLAUDE.md` travam **"duas
skins, cada uma com modo claro e escuro"**. O protótipo não tem modo nenhum: F é só
claro, H é só escuro. As duas variantes que faltam são justamente as difíceis —
**Caderno escuro é uma contradição de metáfora** (papel pautado preto? marca-texto
amarelo neon no escuro?) e **Dev claro** perde o chrome de editor que é a razão de
ser da skin. Ou você desenha essas duas agora, ou muda a decisão para "Caderno é
claro, Dev é escuro, ponto" — que, sinceramente, é a opção honesta e mais barata.

---

## 4. Skin do aluno — "Caderno" (F)

### O que está certo
A metáfora tem alma e é **coerente com o usuário**: caderno é o objeto real da vida
de um aluno de curso técnico. O grifo que pinta (`.hlt::before` com `scaleX` em 0.7s)
é o melhor momento de movimento do protótipo inteiro — responde a uma entrada, tem
física de caneta, e é impossível de confundir com template. O red pen ("Ótimo ritmo
essa semana! — Prof. André ✔") faz a voz do professor existir dentro da UI. Isso é
produto, não enfeite.

### Riscos concretos

**Caveat não escala para conteúdo denso.** Ela está em `--fd` com `--h1:46px`, e é
linda nesse tamanho. Mas Caveat é cursiva: não tem monospace irmã, os numerais não
são confiáveis para tabular, e acentuação PT-BR pesada (ã, õ, ç) em tamanho médio
degrada rápido. Pergunta que ainda não tem resposta: qual é o título de um exercício
de código? Do nome de um arquivo? De uma tabela de notas? Se a resposta for "aí usa
Schibsted", metade da personalidade da skin evapora justamente onde o aluno passa
mais tempo.

**A pauta vira ruído.** `repeating-linear-gradient(transparent 0 27px, #BFD3E64D 27px 28px)`
está aplicada no `.app` inteiro do aluno. Funciona num dashboard arejado. Atrás de um
editor de código, de uma tabela de notas ou de um enunciado longo, é poluição — e a
pauta de 28px não vai casar com o line-height de nenhum desses componentes, então o
texto vai flutuar desalinhado da linha, que é exatamente o detalhe que denuncia a
imitação de papel.

**Amarelo pastel é uma cor de ação primária fraca.** `--acc:#FFE873` com
`--accInk:#26374F` é o botão primário da skin. Marca-texto é uma ótima cor de
*destaque*; como CTA ela não tem urgência, e — pior — ela colide semanticamente
consigo mesma: o mesmo amarelo é "botão de ação", "preenchimento da barra de XP" e
"grifo de texto". Quando tudo é destaque, nada é.

**Ranking, streak e comparação social.** Ver seção 6.

---

## 5. Skin do instrutor — "Dev" (H)

### O achado desconfortável
O "chrome de editor no shell do instrutor" **não existe no protótipo**. Existe na
tela do *aluno* em H (`hoje.md` com números de linha, abas, árvore de arquivos,
status bar) — que é a visão que você **não** escolheu. A tela do instrutor em H é um
dashboard comum com paleta grafite/âmbar. E a própria view desfaz o mono:

```css
#view-h .scr-prof{--fb:'Schibsted Grotesk'}
```

Ou seja: o protótipo já concluiu sozinho que mono no corpo prejudica o instrutor —
e está certo. Mono é excelente para dado tabular (números alinham) e ruim para nome
de aluno, enunciado e diário. Portanto, hoje, a skin do instrutor é **uma paleta,
não um conceito**. A intenção do `CLAUDE.md` ("chrome de editor no shell") está
não-testada, e é a parte cara: aba, árvore, status bar e paleta de comandos são
padrões de *ferramenta*, não de dashboard.

### A violação que ninguém notou
`CLAUDE.md` proíbe explicitamente **"labels CAPS cinza"** como marca de IA. O sistema
de componentes está cheio deles:

```css
.blk .ttl{font-size:11px;font-weight:800;letter-spacing:.16em;color:var(--mut);text-transform:uppercase}
.kpi .lb{font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--mut);text-transform:uppercase}
.ptbl th{font-size:10.5px;font-weight:800;letter-spacing:.12em;color:var(--mut);text-transform:uppercase}
```

A skin F escapa porque sobrescreve tudo para Caveat 20px em caixa baixa
(`#view-f .blk .ttl{font-family:'Caveat';text-transform:none}`) — decisão excelente.
**A skin H não sobrescreve.** Ela ainda reforça: `#view-h .scr-prof .ttl,.kpi .lb,.ptbl th{font-family:'JetBrains Mono';letter-spacing:.12em}`.
Traduzindo: a skin escolhida para o instrutor viola a regra anti-IA nº 1 do próprio
projeto, em CAPS, cinza, 10.5px e com tracking.

---

## 6. UX por fluxo — o que a estrutura das telas está dizendo

### Instrutor: o cockpit "Hoje" está com as prioridades invertidas
A linha mais nobre da tela (topo, 4 cards) é ocupada por KPIs de vaidade: "Presença
média 87% · +2% esta semana". **Nenhum deles gera uma ação.** Enquanto isso, "Aula 07
às 07:00 · chamada pendente" — a única coisa com prazo real — está numa lista
secundária, abaixo.

Um cockpit de professor deveria responder, nessa ordem: **(1)** o que eu faço agora
(a aula que começa em 10 min, com a chamada), **(2)** o que está me travando (14
correções), **(3)** quem está afundando (3 abaixo de 75%). Presença média é
relatório, não cockpit.

### Instrutor: a fila de correção é o maior ganho de UX do sistema, e não foi desenhada
Hoje ela é uma tabela com um botão "Revisar" por linha. Para 14 correções isso são
~42 navegações (entra, corrige, volta). O padrão que resolve é **fila com teclado**:
`J`/`K` navega, nota, `Enter` salva e puxa a próxima, sem sair da tela — a submissão,
a saída dos testes, a sugestão da IA e o campo de feedback na mesma view. Isso é o
que transforma "corrigir" de tarefa de fim de semana em 20 minutos. É, na minha
leitura, a maior alavanca de produto que existe para você, e é onde o conceito
"estação dev" ganharia sentido de verdade (é uma ferramenta, tem atalho, tem fluxo).

**Sintoma menor, mesma origem:** "Gerar diário (XLSX)" aparece **duas vezes** na
mesma tela (header e footer). Isso é preenchimento de espaço.

### Aluno: a gamificação está na tela errada
XP, nível, ranking, streak, figurinhas e missões vivem no **dashboard**. Mas o XP não
acontece no dashboard — acontece na **entrega**. O instante de emoção (os testes
passaram → +120 XP → a barra enche → a estrela acende na constelação) pertence à tela
da atividade, no momento da correção. Concentrar a gamificação num painel separado a
transforma em placar de contabilidade: o aluno lê o número, não sente a conquista.

Isso reforça a seção 2 — o dashboard é a tela mais fácil de desenhar e a que menos
carrega o produto.

### Aluno: comparação social numa turma de menores
Três mecânicas do protótipo apontam para o mesmo problema:

- **Ranking público ordenado** (`.rank` top 5, com "Você" em 3º). No protótipo você é
  sempre 3º. Na sua turma real, alguém é o 26º, e vai ver o próprio nome em último,
  publicamente, toda semana. Isso desmotiva exatamente o aluno que você mais precisa
  segurar — e alunos menores é justamente o caso onde o blueprint pede cuidado.
  Alternativa: **liga/faixa** (grupos de ~5 com movimentação), ou "você subiu 2
  posições", ou top 5 sem ranking negativo visível. Nunca a lista completa ordenada.
- **"Recorde da turma: 21"** ao lado do seu streak de 12 — comparação outra vez, e
  contra o melhor da turma.
- **Streak diário** (`ofensiva de 12 dias`) num curso técnico com aula 2×/semana
  **pune o aluno por não ter aula**. Streak precisa ser por **aula** ou por **semana**,
  não por dia. A UI aqui está pré-julgando uma regra de produto — e julgando errado.

### A regra de skin por papel tem um buraco
"Skin resolvida por papel" (`data-skin` no shell) quebra quando o conteúdo cruza o
papel:

- O professor abre o **preview da atividade como o aluno vê** — Caderno dentro do
  shell Dev? Dev? A pergunta não tem resposta hoje.
- O coordenador abre a entrega de um aluno.
- O professor demonstra a plataforma no projetor para a turma.

Sugestão de regra: **a skin segue o papel no shell, e o conteúdo do aluno é sempre
renderizado na skin do aluno**, num contêiner explícito de preview (com moldura, tipo
"assim o aluno vê"). Alternativa mais simples: um botão "ver como aluno" que troca a
skin inteira da sessão. Qualquer uma serve — mas precisa ser decidida antes do kit de
UI, porque muda a arquitetura dos tokens (`data-skin` no `<html>` vs. em subárvore).

---

## 7. Acessibilidade — auditoria concreta

Requisito do projeto (alunos menores + inclusão), então isto é bug, não polimento.

**Foco invisível na skin do aluno — o mais grave.** O reset define foco global fixo:

```css
button:focus-visible,a:focus-visible{outline:2px solid #E8B44C;outline-offset:2px}
```

Nenhuma view sobrescreve (verificado: é a única regra de `focus` do arquivo). Na skin
F, âmbar `#E8B44C` sobre papel `#FDFBF2` dá **≈1.8:1** — o mínimo para indicador de
foco é 3:1. Um aluno navegando por teclado **não vê onde está** no Caderno. O foco
precisa ser um token por skin (`--focus`), e no Caderno provavelmente é a tinta
`#26374F`, não o amarelo.

**Texto abaixo do mínimo legível.** `.seal` está em **8.5px** e `.tnode span` em
10.5px. 8.5px não passa em critério nenhum; e `--mut:#66748C` sobre `#FDFBF2` dá
**≈4.56:1** — passa AA por 0.06. Não sobra margem para nada.

**107 divs com aparência de controle.** `.task`, `.plitem`, `.seal`, `.tnode`, `.chip`
são `<div>` — vários com afordância de clique (`.task:hover{transform:translateX(3px)}`,
`.plitem .act:hover{background:var(--acc)}`). Nada disso é focável nem anunciável.
As missões (`.mi`) e a árvore (`.hti`) **são** `<button>` — o padrão certo já existe
no arquivo, só não foi aplicado por igual.

**ARIA existe só no chrome do protótipo** (8 ocorrências: o switcher de estilo e 2
SVGs). Nenhum componente de produto tem rótulo, estado ou live region — e a barra de
XP, o toast e o resultado de correção são exatamente os casos que precisam de
`aria-live`.

**Emoji como conteúdo, com hack.** `🔥̶`, `✏️̶` usam combining strikethrough (U+0336)
para "riscar" o emoji visualmente. Leitor de tela lê "fogo", "lápis" — e o risco não
existe para ele. Some-se o `✎` prefixando **todos** os títulos do Caderno ("✎ Missões
de hoje", "✎ Trilha da UC", "✎ Figurinhas", "✎ Pra entregar"): é decoração repetida
em toda seção, primo direto do "badge acima do H1" que o `CLAUDE.md` proíbe.

**Sem `@media print`.** `CLAUDE.md` pede imprimível; não há uma regra de print no
arquivo. Compreensível num protótipo de estilo — mas os relatórios e a Papelada Zero
dependem disso, então precisa entrar no kit de UI, não depois.

---

## 8. Movimento — melhor do que o blueprint teme, com duas contradições

**Crédito onde é devido, porque isto é raro:**
- `transition:all` — **zero ocorrências**. Todas as transições são de propriedade nomeada.
- `prefers-reduced-motion` está tratado a sério, não decorativamente:
  ```css
  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
    .rv,.pop,.tnode{opacity:1!important;transform:none!important}
    #bootC{display:none!important}
  }
  ```
  Repare que ele não só zera durações — ele **restaura a opacidade** dos elementos
  revelados (senão a página ficaria invisível) e mata a sequência de boot. Isso é
  alguém que entendeu o problema, não copiou o snippet.
- O JS lê `matchMedia('(prefers-reduced-motion: reduce)')` e ramifica.

**As duas contradições com o §8.1 do blueprint:**

1. **`.rv` é fade-in indiscriminado no load** — `opacity:0; transform:translateY(22px)`
   aplicado em quase todo painel, com delays escalonados `.d1`–`.d5`. O §8.1 proíbe
   literalmente "fade-in indiscriminado em toda a página ao carregar". É o gesto mais
   genérico do arquivo e está em todas as telas. Num protótipo de vitrine ele se
   justifica (é uma apresentação); num app onde o aluno entra 4× por dia, ele vira
   imposto de 0.65s sobre cada navegação.
2. **Animações infinitas**: `pulse` 2s infinito no nó atual da trilha, `blink` 1.1s
   infinito no cursor. Movimento perpétuo sem input é distração permanente na
   periferia — e no caso de um aluno com déficit de atenção, é ativamente hostil.
   (O reduced-motion salva quem pediu; não salva quem não sabe que existe a opção.)

**O que fazer:** trocar o `.rv` global por movimento **local ao evento** (a coisa que
mudou se move; o resto já está lá), e transformar os três bons momentos autorais
(grifo que pinta, barra que enche, selo que acende) em **tokens nomeados de
movimento** — que é o que o §8.1 pede e ainda não existe.

---

## 9. Recomendações, em ordem

**Antes de escrever a Fase 0 do blueprint:**

1. **Desenhar 5 telas, não mais peles.** Nesta ordem, nas duas skins escolhidas:
   (a) aluno resolvendo exercício de código, com testes rodando e o resultado
   chegando; (b) fila de correção do professor com teclado; (c) **chamada no
   celular** (é a tela mais mobile do sistema — o professor faz de pé, andando pela
   sala; hoje o layout do instrutor simplesmente esconde a navegação em
   `max-width:860px` com `.psb{display:none!important}` e não põe nada no lugar);
   (d) jornada da UC; (e) primeiro acesso / estado vazio. Se F e H sobreviverem a
   essas cinco, a decisão está de fato tomada. Se não sobreviverem, melhor descobrir
   agora do que na Fase 6.
2. **Resolver claro/escuro ou abandonar a exigência.** Caderno escuro e Dev claro,
   desenhados — ou muda o blueprint para "Caderno é claro, Dev é escuro". Manter uma
   decisão travada que nunca foi testada é dívida disfarçada de decisão.
3. **Decidir a regra de skin no cruzamento de papéis** (preview do professor), porque
   ela define se `data-skin` vive no `<html>` ou em subárvore.

**No kit de UI (Fase 0.3), não depois:**

4. **Tokens de estado por skin**: `--focus` (mínimo 3:1 contra o fundo da skin — no
   Caderno, âmbar está reprovado), `--danger`, `--success`. Nunca cor fixa no reset.
5. **Escala tipográfica com piso**: nada abaixo de 12px, `--mut` recalculado para
   sobrar margem (hoje: 4.56:1, ou seja, zero margem).
6. **Matar os labels CAPS cinza da skin H** — a regra anti-IA do próprio projeto.
   F já resolveu isso com Caveat em caixa baixa; H precisa da resposta equivalente.
7. **Botão/afordância**: tudo que responde a clique é `<button>`. O padrão certo já
   existe no protótipo (`.mi`, `.hti`); é só aplicar aos outros 107.
8. **Tokens de movimento nomeados** + trocar o reveal global por movimento local.
9. **`@media print`** desde o começo (Papelada Zero depende).

**Decisões de produto que a UI está prejulgando (resolver antes de codar a gamificação):**

10. **Streak por aula/semana**, não por dia.
11. **Ranking por liga/faixa**, não lista pública ordenada. Alunos menores.
12. **Gamificação no ponto da ação** (a barra enche na tela da correção), não só no painel.
13. **Cockpit por ação, não por KPI**: "o que eu faço agora" ocupa a linha nobre;
    presença média desce para relatório.

---

## 10. A pergunta que resume tudo

O `BLUEPRINT.md §8.1` cravou a régua certa: *"parece feita por alguém com gosto, ou
parece gerada?"*. A régua está correta e o protótipo passa nela — **para as duas
telas que ele desenhou**.

A questão é que essa régua ainda não foi aplicada às telas que são o produto, e é
nelas que o design antigo morreu. Não porque era roxo — porque era estrutura de
template. O Caderno e o Dev merecem sobreviver ao teste da tela de correção antes de
virarem verdade travada.
