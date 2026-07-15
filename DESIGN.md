# Design — a fonte da verdade

> Índice em [CLAUDE.md](CLAUDE.md) · as proibições e a régua estão lá (§2.12–§2.16) e
> **não são repetidas aqui**. Este doc é o *como*: tokens, tipografia, pauta, movimento.
> **Escrito depois do protótipo, não antes** — tudo aqui foi visto antes de ser escrito.

**Protótipo de referência (aprovado 15/jul/2026):**
[prototipos/celeste-atividade.html](prototipos/celeste-atividade.html) — auto-contido
(fontes em base64), basta abrir no navegador. Hospedado em
https://claude.ai/code/artifact/e361eb92-e48f-444b-8835-06ce5dec1aeb

A tela de atividade de pseudocódigo nas 4 variantes, com o loop assíncrono inteiro
(escrever → entregar → a correção voltando como caneta vermelha na página). **Este
arquivo é a implementação de referência dos tokens abaixo** — em caso de dúvida, ele
manda.

> O protótipo antigo ([prototipos/celeste-6-estilos.html](prototipos/celeste-6-estilos.html),
> 9 estilos × 2 dashboards) continua útil como **paleta de referência dos estilos não
> escolhidos** (para a loja de temas, §7 do blueprint). Para tudo mais, ele está
> superado — ver [ANALISE-UX.md](ANALISE-UX.md).

---

## 1. As 4 variantes

Skin por **papel** (`data-skin` no `<html>`), modo claro/escuro por usuário.
O professor vê tudo em Dev, inclusive preview — **nunca duas skins na tela ao mesmo tempo**.

| Token | Caderno claro | Caderno escuro | Dev escuro | Dev claro |
|---|---|---|---|---|
| `--mesa` | `#E7E0CE` | `#171512` | `#0A0E12` | `#E4E4E0` |
| `--folha` | `#FDFBF2` | `#2B2823` | `#141A21` | `#FAFAF8` |
| `--tinta` | `#26374F` | `#E9E3D6` | `#D5DDE7` | `#16191D` |
| `--mut` | `#5B6A80` | `#9C9486` | `#8A95A3` | `#5C6167` |
| `--pauta` | `#BFD3E6` | `#403A32` | `#232B36` | `#E0E0DB` |
| `--linha` | `#26374F` | `#4A4339` | `#232B36` | `#D6D6D1` |
| `--acc` | `#FFE873` | `#E8C547` | `#FFB454` | `#FFB454` |
| `--acc-ink` | `#26374F` | `#211F1B` | `#1A1206` | `#1A1206` |
| `--acc-tx` | `#26374F` | `#E8C547` | `#FFC276` | `#8A5100` |
| `--caneta` | `#D9534F` | `#FF8A80` | `#F0716B` | `#B3261E` |
| `--foco` | `#26374F` | `#E9E3D6` | `#FFB454` | `#8A5100` |
| `--bw` | `2px` | `2px` | `1px` | `1px` |
| `--raio` | `10px` | `10px` | `9px` | `9px` |
| `--sombra` | `3px 4px 0 #26374F1F` | `3px 4px 0 #00000059` | `none` | `0 1px 2px #16191D14` |

### Os três tokens de acento — a distinção que evita o bug clássico
- **`--acc`** = a cor como **preenchimento** (grifo, botão, barra de XP).
- **`--acc-ink`** = o texto **em cima** do preenchimento.
- **`--acc-tx`** = o acento como **cor de texto**, sobre `--folha`.

São três porque **um acento que funciona como fundo raramente funciona como texto**.
No Caderno claro, `--acc-tx` **não é o amarelo** — é a tinta, porque marca-texto não é
cor de letra. No Dev claro, o âmbar escurece para `#8A5100` (6,2:1) porque `#FFB454`
sobre papel dá **1,8:1** e reprova. Foi exatamente esse o bug que a auditoria encontrou
no protótipo antigo, e é ele que estes três tokens tornam impossível.

### Caderno escuro — moleskine, não papel invertido
O caderno **não anoitece: ele muda de objeto.** Capa de couro escura (`--mesa`), papel
creme **escurecido** (`--folha`, não preto), tinta clara.

**A regra que importa:** o grifo (`--acc: #E8C547`) continua **brilhante**, com texto
escuro em cima (`--acc-ink: #211F1B`) — porque um marca-texto de verdade não inverte no
escuro. Ele é uma mancha de luz. Inverter o grifo (amarelo escuro, texto claro) é o
erro óbvio e mata a metáfora.

### Dev claro — o modo documento
Dev claro **não é "Dev com a luz acesa": é o modo em que a papelada sai.** Papel de
impressora (`#FAFAF8`, mais frio e clínico que o creme do Caderno — mundos diferentes),
tinta quase preta, acento em ocre.

Isso dá ao modo claro uma **função** em vez de uma preferência, e casa com
`@media print` e a Papelada Zero. **O instrutor trabalha no escuro e imprime no claro.**
(Continua sendo escolha do usuário — o conceito dá identidade ao modo, não restringe
quando ele aparece.)

---

## 2. Tipografia

| Face | Papel | Onde |
|---|---|---|
| **Caveat** 700 | Display do Caderno | Título de tela, anotação de caneta vermelha, marca |
| **Schibsted Grotesk** (variável 100–900) | Corpo, **nas duas skins** | Enunciado, texto, rótulo, nome de gente |
| **JetBrains Mono** (400–700) | Código + dados | Pseudocódigo (as duas skins), números do Dev |

Todas embutidas em **base64** (a CSP do artifact bloqueia CDN, e um fallback silencioso
destrói a identidade sem avisar). Schibsted é **variável** — um arquivo, todos os pesos.

### Escala
`12 · 12,5 · 13 · 13,5 · 14 · 14,5 · 15 · 17 · 21 · 26 · 38 · 42`
Corpo 15px/1.55. Código 14,5px/**28px** (Caderno) e 13,5px/26px (Dev).
**Piso de 12px, sem exceção** — o protótipo antigo tinha texto de 8,5px.

### ⚠️ O limite do Caveat — nomeado, não descoberto tarde
**Caveat só serve para display.** Título, anotação, marca. **Nunca** para enunciado,
nome de aluno, tabela, rótulo ou qualquer texto corrido.

Isso ficou visível no protótipo aprovado: o título "Achar o maior de dez números" é
Caveat 42px e funciona; **o enunciado logo abaixo é Schibsted**, porque Caveat é
cursiva — não tem monoespaçada irmã, os numerais não são confiáveis em coluna, e
acentuação PT-BR densa (ã, õ, ç) degrada em tamanho médio.

**Consequência aceita:** a personalidade do Caderno vive no título, no grifo e na
caneta — não no corpo. Quem espera "tudo escrito à mão" vai se decepcionar, e isso é
melhor do que texto ilegível. A skin não é uma fonte; é um sistema.

### Mono com propósito — a disciplina que segura a skin Dev
Como a skin Dev **não tem chrome** (sem abas, sem árvore — decidido), a personalidade
dela vem de disciplina. Ela só existe se for cumprida sem exceção:

1. **Mono só onde número alinha** — nota, %, hora, contagem, XP, ID, e o código.
   **Nunca** em nome de aluno, título, enunciado, feedback.
2. **Âmbar só no que é acionável.** Uma tela do instrutor tem pouquíssimo âmbar; onde
   ele está, você clica.
3. **`~/` como marca tipográfica** (`~/celeste`) — o sabor de terminal sem a fantasia.
4. **Densidade real.** Com 100+ alunos, densidade é respeito.
5. **Zero labels CAPS cinza.** Hierarquia por peso e tamanho, em caixa baixa.

Cumprida pela metade, isso não é personalidade — é inconsistência.

---

## 3. A pauta — a regra-assinatura

> **O `line-height` do editor é exatamente o passo da pauta: 28px.**

Cada linha de pseudocódigo assenta sobre uma linha do caderno. A régua fica em `y=19px`
dentro da banda de 28px, logo abaixo da linha de base — como num caderno de verdade,
onde o texto se apoia na linha.

```css
.linhas{
  font-family:'JetBrains Mono'; font-size:14.5px; line-height:28px;
  background-image:repeating-linear-gradient(to bottom,
    transparent 0 19px, var(--pauta) 19px 20px, transparent 20px 28px);
}
.l{ height:28px }
```

**Por que isso é a regra e não um detalhe:** a auditoria acusou a pauta de virar ruído
atrás de conteúdo denso, e estava certa — **enquanto a pauta fosse textura**. Ao fazer
dela a grade do conteúdo, o problema desaparece por construção: não há como o texto
desalinhar da linha, porque a linha *é* onde o texto está.

É também a coisa mais difícil de um gerador produzir, porque exige que tipografia e
fundo tenham sido decididos **juntos**.

**Corolário:** a pauta só aparece onde há conteúdo em grade de 28px. Não é papel de
parede — **nunca** aplicar no `<body>` inteiro. Na skin Dev ela não existe
(`background-image:none`): editor não tem pauta.

---

## 4. Movimento

Movimento é assinatura ([CLAUDE.md §2.14](CLAUDE.md)). Estes são os tokens; usar
**estes**, não inventar curva por tela — movimento inconsistente entre telas grita
"gerado".

| Token | Valor | Sensação |
|---|---|---|
| `--mov-grifo` | `.62s cubic-bezier(.2,.75,.25,1)` | tinta que espalha |
| `--mov-caneta` | `.45s cubic-bezier(.2,.9,.3,1)` | mão que pousa |
| `--mov-sobe` | `.4s cubic-bezier(.2,.8,.3,1)` | algo que chega |
| `--mov-voa` | `.55s cubic-bezier(.2,.9,.3,1)` | XP indo pro lugar (com overshoot) |
| `--mov-barra` | `.9s cubic-bezier(.25,.8,.3,1)` | preenchimento |
| `--mov-troca` | `.35s ease` | skin/modo |
| `--mov-toque` | `.13s ease` | botão sob o dedo |

### A coreografia da correção — um momento, não efeitos soltos
A entrega corrigida **não pisca na tela**: ela chega em ordem, e a ordem conta a
história de alguém corrigindo.

| t | O quê |
|---|---|
| `+0,35s` | a linha 4 ganha o traço vermelho — *o professor achou* |
| `+0,50s` | a anotação pousa na margem, com rotação que assenta — *ele escreveu* |
| `+0,75s` | a seta aparece apontando pra linha — *ele ligou uma coisa na outra* |
| `+0,60s` | o veredito sobe embaixo — *a nota e o porquê* |
| `+0,95s` | o XP voa pra barra — *o que você ganhou* |

Isso é o que o §8.1 do blueprint pedia por "movimento com intenção": cada passo comunica
uma mudança de estado, e a sequência inteira dura menos de 1,5s.

**Por que a correção é o clímax e não a entrega:** pseudocódigo é `runner: none` — não
há correção automática, então **o aluno não está lá quando você corrige**. O momento de
emoção não pode ser a entrega (ele já foi embora); é **o retorno**. Isso vale para todo
tipo sem correção automática, e nuança a Lei 3: a gamificação acontece onde o
**resultado aparece**.

**Proibido, e o protótipo antigo fazia:** `.rv` — fade-in de página inteira no load.
Nada se move só porque a página carregou. O que se move é o que mudou.

**`prefers-reduced-motion`:** o protótipo antigo acertava nisso e a regra dele foi
mantida — não basta zerar durações, é preciso **restaurar o estado final** (o grifo
pintado, o traço visível, o XP em 1), senão a tela some.

---

## 5. Primitivos

- **A folha** (`.folha`) — o contêiner de conteúdo do aluno: `--folha` sobre `--mesa`,
  borda `--bw`, `--raio`, `--sombra`. É uma página numa mesa, não um card num grid.
- **O grifo** (`.grifo`) — `scaleX(0→1)` origem à esquerda, atrás do texto (`z-index:-1`).
  Marca **uma** coisa por tela. Dois grifos = nenhum grifo.
- **A caneta** (`.caneta`) — Caveat em `--caneta`, rotação de −2,5°. É a voz do professor
  **dentro** do trabalho do aluno. Nunca um modal.
- **Os dois eixos** — XP e nota lado a lado, **sempre com a régua**
  (`nota 8,2 · aprova com 7,0`). [Lei 2](CLAUDE.md).
- **A lua** (`.lua`) — círculo de 15px, só contorno. O conceito celestial aparece assim:
  discreto, na marca e nas ligas (fases da lua), nunca como tema espacial.
- **Evidência, nunca veredito** — `0 colagens · 6min 12s escrevendo · 14 edições`, jamais
  `suspeita 87%`. [Lei 0](CLAUDE.md).

---

## 6. Acessibilidade — os números medidos

Contrastes calculados sobre `--folha` (mínimo AA = 4,5:1 para texto; 3:1 para foco):

| | Caderno claro | Caderno escuro | Dev escuro | Dev claro |
|---|---|---|---|---|
| `--mut` | **5,3:1** ✅ | **4,9:1** ✅ | **5,8:1** ✅ | **6,0:1** ✅ |
| `--foco` | **11,6:1** ✅ | **11,5:1** ✅ | **9,2:1** ✅ | **6,2:1** ✅ |

> O protótipo antigo tinha `--mut` em **4,56:1** (passava por 0,06 — zero margem) e o
> foco em **1,8:1** (âmbar fixo no reset, reprovado em todas as skins claras: um aluno
> navegando por teclado não via onde estava). Ambos estão consertados pela raiz: `--mut`
> nasceu com margem e `--foco` é **token por skin**, nunca cor fixa.

Mais: piso de 12px · tudo que clica é `<button>` · `aria-live` no toast e no veredito ·
`prefers-reduced-motion` respeitado com estado final restaurado · `@media print`
(a Papelada depende — **ainda não implementado**, ver §7).

---

## 7. Pendências

- **`@media print`** — não existe ainda. A Papelada Zero depende, e o modo "Dev claro =
  documento" foi desenhado pensando nele. Fazer junto com o diário XLSX.
- **Os tokens de movimento como CSS vars** — o protótipo tem os valores certos, mas
  hard-coded nas animações. Extrair para `--mov-*` no kit de UI.
- As 4 telas restantes que nunca existiram: fila de correção (o teste mais duro da skin
  Dev), chamada, jornada da UC, "Hoje" do aluno no celular (o único mobile-first).
- Skeletons na skin (nunca spinner genérico).
- Loja de temas: os estilos não escolhidos do protótipo antigo viram itens
  ([BLUEPRINT.md §7](BLUEPRINT.md)) — cosmético puro.
