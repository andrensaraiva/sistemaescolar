# Perfil — Aluno

> Parte da documentação de produto da Celeste Academy. Índice em [CLAUDE.md](CLAUDE.md).
> Arquitetura em [BLUEPRINT.md](BLUEPRINT.md) · Crítica que originou estas decisões em [ANALISE-UX.md](ANALISE-UX.md).
> **Decisões travadas em 15/jul/2026.** PT-BR sempre. Free tier sempre.

---

## 1. Quem é

Adolescente, **menor de idade**, aluno do técnico SENAI de Programação de Jogos
Digitais. Cursa **várias UCs com professores diferentes** — nem todos usam a Celeste
(adoção parcial e voluntária). Usa a plataforma **no lab (desktop) durante a aula** e
**no celular fora dela**.

Skin: **Caderno**, claro e escuro (ver [DESIGN.md](DESIGN.md)).

---

## 2. As leis do perfil

Regras duras. Uma tela que quebre qualquer uma delas não está pronta.

1. **No desktop o aluno produz; no celular o aluno consulta e recebe.**
   Resolver exercício, entregar, desenhar, duelar = desktop. Ver nota, XP, prazo,
   missão, resultado da correção = **mobile-first de verdade**, não breakpoint.
   Corolário: **exercício de código não precisa funcionar no celular.** Assumido, não
   lamentado.
2. **XP e nota nunca aparecem sozinhos.** Ver §3.
3. **A Celeste não finge ser o sistema da escola.** UC sem conteúdo na plataforma
   **não aparece** — não existe card vazio, aviso de pendência ou "em breve". Quando
   um colega adota, a UC nasce. É crescimento, nunca conserto.
4. **A gamificação acontece onde o trabalho acontece.** O XP entra na barra na tela da
   correção, não num painel à parte. Ver §6.
5. **Nenhum aluno é publicamente o último.** Ver §6.2.
6. **Nada compete com o conteúdo do aluno pela atenção.** Sem enfeite que se mexe
   sozinho na periferia.

---

## 3. Os dois eixos — XP e nota

A decisão mais importante do perfil, e a que o sistema antigo nunca tornou explícita.

| | O que mede | Como se ganha | O que decide |
|---|---|---|---|
| **XP / nível** | Esforço e hábito | Entregar, tentar, comparecer, resolver | Gamificação, liga, loja, céu |
| **Nota + frequência** | Competência | Correção da entrega / presença na aula | **Aprovação** (70% nota **+** 75% freq.) |

**Lei:** onde aparecer um, aparece o outro. Sem exceção — nem no celular, nem no
topo, nem no perfil. O aluno **nunca** pode chegar em nível 30 e descobrir tarde que
está reprovado. Se a tela não tem espaço para os dois, a tela está errada.

A linha canônica, presente na home e no perfil:

```
nível 12 · 840/1.200 XP        nota 8,2 · frequência 91%
└─ o quanto você trabalhou ─┘  └─ o quanto você aprendeu ─┘
```

**Consequência de design:** a nota nunca é um número solto. Ela vem sempre com o
critério (`8,2 · aprova com 7,0`) e a frequência com o corte (`91% · precisa de 75%`).
Número sem régua é ansiedade.

---

## 4. Navegação — "Hoje" é a casa

O aluno loga e cai em **Hoje**: uma agenda transversal que atravessa todas as UCs e
responde uma pergunta só — *o que eu faço agora*.

```
Hoje  ──▸  UC  ──▸  Atividade
 │
 ├──▸  Meu céu (perfil, conquistas, nota, frequência)
 └──▸  Loja
```

Quatro destinos. Só isso. Sem mural, sem feed, sem "explorar".

**Por que Hoje e não um hub de UCs:** o hub promete completude e a adoção é parcial —
uma UC sem conteúdo vira card quebrado. Hoje não promete nada além do dia: um dia
leve tem 2 itens e isso não parece defeito, parece terça-feira. A agenda **degrada
com elegância**; o hub não.

### 4.1 Hoje
Ordem fixa, de cima pra baixo — é uma ordem de **urgência**, não de importância
institucional:

1. **A frase do dia** — em Caveat, dizendo o tamanho real do dia ("Oi, Yanka. Hoje tem
   2 coisas."). Não é enfeite: é a única tela que diz ao aluno que o dia é
   administrável.
2. **Pra entregar** — o que tem prazo, de todas as UCs, ordenado por prazo. Cada item
   diz de qual UC veio.
3. **Suas UCs** — barras de progresso, só das UCs que existem na plataforma.
4. **A linha dos dois eixos** (§3).

### 4.2 UC
A jornada amarrada aos blocos do plano de ensino (Pilar 1 do blueprint):
**aprender → praticar → avaliar**. A trilha é a espinha da tela e mostra onde o aluno
está no plano real do professor — não uma barra de progresso genérica.

### 4.3 Atividade (player) — **a tela mais importante do sistema**
É aqui que o produto acontece e é a única que o protótipo nunca desenhou. Requisitos:

- **Desktop.** Enunciado + área de trabalho (editor / canvas / chat) + resultado.
- **Tentativas por tipo, declaradas no registro** (§5).
- **O resultado da correção é o clímax** e tem ritmo: testes rodando → veredito →
  o XP **voa para a barra** → se fechou conquista, a estrela acende. Revelar com
  ritmo, nunca piscar. É o momento-assinatura do produto inteiro (§8.1 do blueprint).
- **Erro é informação, não punição.** Teste que falhou mostra o que se esperava e o
  que veio, em PT-BR. Nunca stack trace cru.
- Antifraude coleta em silêncio (paste, tempo, edições). **Nunca acusa na cara do
  aluno** — o score vai para o professor. Colou = sem XP, e a nota é decisão humana.

### 4.4 Meu céu
Perfil = **o céu do aluno**. Conquistas são **estrelas que acendem**; cada UC
concluída vira uma **constelação** no céu. Ao longo dos anos do curso o céu enche —
é o arco longo da gamificação, e é onde o conceito celestial (lua, constelação, ouro)
ganha função em vez de ser tema.

Aqui também moram nota e frequência por UC, com as réguas (§3).

> **Proposta, não decidida:** o desenho exato das constelações (uma por UC, com N
> estrelas = N conquistas daquela UC). Confirmar antes da Fase 7.

### 4.5 Loja
Temas desbloqueáveis por pontos. **Cosmético puro** — nunca muda usabilidade nem
conteúdo, para não criar vantagem entre alunos (§7 do blueprint). Desbloqueio
permanente.

---

## 5. Tentativas — o registro decide

**Decisão: depende do tipo de atividade, e o tipo declara isso no registro.**
Nenhuma tela compara tipo por string (regra herdada do sistema antigo, é ouro).

| Tipo | Tentativas | Por quê |
|---|---|---|
| **Prática** (pseudocódigo, código, pixel art, quiz de treino) | **Ilimitadas** | Errar é de graça e é como se aprende a programar. |
| **Prova / boss / SAEP valendo** | **Uma**, modo lockdown | É avaliação. |

O XP é **cheio no acerto**, sem decaimento por tentativa — punir tentativa é punir o
método de aprender. O que protege contra força bruta não é o XP: é o **antifraude**
(tempo, edições, paste, similaridade) e a **prova**, que vale nota e tem uma chance.

---

## 6. Gamificação

### 6.1 Onde ela vive
**No ponto da ação.** A barra de XP enche na tela da correção, na frente do aluno, no
segundo em que ele merece. O painel só *lembra* o que aconteceu — ele nunca é o palco.

Esse é o erro estrutural do protótipo atual: toda a gamificação (XP, nível, ranking,
streak, figurinhas) vive num dashboard separado do trabalho. O aluno lê o número em
vez de sentir a conquista.

### 6.2 Liga — dentro da turma, em fases da lua
Grupos de ~5 alunos de XP parecido, **dentro da turma** (26 alunos ≈ 5 ligas).
Ciclo semanal: sobe quem lidera, desce quem fica atrás — **movimentação entre ligas,
nunca uma lista pública ordenada da turma inteira.**

Você compete com quem você vê na sala e com quem tem XP parecido com o seu — a
rivalidade é real e a chance de subir também. Ninguém é publicamente o 26º de 26.

**Proposta de nomeação (usa o conceito celestial com função):** as 5 ligas são as
**fases da lua** — Nova → Crescente → Quarto → Gibosa → **Cheia**. Subir de liga é
literalmente a lua crescendo. Não precisa de mais nenhuma explicação, e é a única
nomenclatura de liga que já vem com metáfora pronta e sem cheiro de RPG genérico.

### 6.3 Streak — por aula, e o sistema nunca é o culpado
**Streak = compareceu à aula E produziu algo nela.** Casa com o ritmo real (2×/semana)
e reforça a frequência, que é critério institucional.

**Cuidado crítico:** isso acopla o streak do aluno à chamada do professor. Se o
professor esquece a chamada de sexta, a ofensiva da turma inteira quebraria por culpa
do sistema. **Lei: o streak só quebra depois de uma chamada confirmada.** Ausência de
dado nunca quebra nada — no máximo deixa pendente.

Vocabulário: **"3 aulas seguidas"**. PT-BR simples, sem jargão importado.

### 6.4 Moedas e conquistas
Moedas derivadas do nível; conquistas = estrelas no céu (§4.4).

---

## 7. Estados — o que o protótipo esqueceu

A primeira tela da vida de um aluno na Celeste é um estado vazio. É a mais importante
e é a que ninguém desenha.

| Estado | Regra |
|---|---|
| **Primeiro acesso** | Troca de senha + completar perfil. Depois: Hoje com nada a entregar. Precisa parecer **começo**, não vazio — o Caderno em branco é uma vantagem aqui, use-a. |
| **Dia sem nada** | "Hoje não tem nada pra entregar." Isso é uma **boa notícia** e a tela deve tratar como tal. Não inventar tarefa pra preencher. |
| **Carregando** | Skeleton na skin do Caderno. Nunca spinner genérico centralizado. |
| **Erro** | PT-BR, específico, com saída. Toast, nunca `alert()`. |
| **Sem permissão** | Não existe: o aluno nunca vê link para o que não pode abrir. |

---

## 8. O contrato desktop / celular

| | Desktop (lab, na aula) | Celular (fora da aula) |
|---|---|---|
| **Verbo** | Produzir | Consultar e receber |
| **Telas** | Todas | Hoje, Meu céu, notificação de correção |
| **Atividade** | Player completo | **Não existe** — mostra o enunciado e diz "isso é pra fazer no lab" |
| **Densidade** | Alta | Uma coisa por vez, polegar alcança |

Hoje e Meu céu são **desenhados no celular primeiro** e crescem para o desktop. O
resto é desktop e não pede desculpa.

---

## 9. Acessibilidade do perfil

Requisito, não polimento — alunos menores e inclusão. Herdado da auditoria:

- **Foco visível é token da skin** (`--focus`). No Caderno o âmbar dá 1.8:1 contra o
  papel e está proibido; o foco é a tinta.
- **Piso de 12px.** O protótipo tem texto de 8.5px.
- **Tudo que clica é `<button>`.**
- **`aria-live` na barra de XP, no toast e no resultado da correção** — a animação
  nunca é a única forma de saber o que aconteceu.
- **`prefers-reduced-motion`** respeitado (o protótipo já acerta nisso — manter).
- **Sem emoji carregando significado**, e sem `✎` decorando toda seção.

---

## 10. Inventário de funcionalidades

Varredura completa (15/jul/2026). O que existe, o que **não** existe por decisão, e o
que ainda está em aberto.

### Tem
| Funcionalidade | Nota |
|---|---|
| **Hoje** — agenda transversal | A casa. §4.1 |
| **Jornada da UC** — trilha nos blocos do plano | §4.2 |
| **Player de atividade** — 6 tipos | §4.3. Desktop. |
| **Meu céu** — perfil, conquistas, constelações | §4.4 |
| **Loja de temas** | Cosmético puro, desbloqueio permanente. §4.5 |
| **Dois eixos** — XP + nota, sempre juntos | Lei. §3 |
| **Liga** — fases da lua, dentro da turma, ciclo semanal | §6.2 |
| **Streak por aula** | §6.3 |
| **Tentativas por tipo** — prática ilimitada, prova uma | §5 |
| **Refazer pra treinar** | Ver abaixo ⚠️ |
| **Pedir ajuda na atividade** | Ver abaixo ⚠️ |
| **Material da aula, por link** | Ver abaixo ⚠️ |
| **Frequência: só o total com a régua** | `91% · precisa de 75%`. Sem detalhe aula a aula — "por que 71%?" é conversa sua, não tela. |
| **Notificação: só o dado, sem juízo** | A plataforma nunca diz a um adolescente que ele está mal. [SISTEMAS.md §11](SISTEMAS.md) |
| **Código de convite + primeiro acesso** | Você escreve no quadro; a turma entra na 1ª aula. |
| **Projeto em grupo: avaliação entre pares** | Cega, nunca pública, insumo e não resultado. [SISTEMAS.md §12](SISTEMAS.md) |
| **Responder pesquisa de UC** | ⚠️ Ver abaixo. |

> **⚠️ Responder pesquisa de UC** entrou tarde (o coordenador revelou que o SENAI cobra
> isso). É a **única coisa que o aluno faz que não é atividade nem consulta** — e por isso
> ela não pode parecer tarefa: **não vale XP, não vale nota, não entra na trilha, não
> aparece em "Pra entregar"**. Se ela virar mais uma pendência na cara dele, a pesquisa
> some e o dado apodrece. [SISTEMAS.md §10.1](SISTEMAS.md)

### ⚠️ As três decididas em 15/jul, com suas consequências

**Material da aula = link, não upload.** A Celeste **referencia** o material onde ele já
está (Drive/OneDrive); não hospeda. Zero trabalho novo pra você, e salva o 1GB do
Supabase free — slide come isso numa semana.
*Cuidado:* o Storage **continua existindo** — entrega de pixel art é arquivo. A distinção
é **material (link)** vs **entrega (arquivo)**.

**Pedir ajuda é campo da entrega, não canal.** Não é chat: é um "travei aqui" amarrado a
uma atividade, que chega **junto da entrega na sua fila**, com o contexto embutido. Não
cria expectativa de resposta às 23h, e **é sinal pro radar** — um aluno travado e pedindo
não está sumindo, está tentando. Isso é o oposto de silêncio.
*Requisito:* a fila precisa marcar quem pediu ajuda.

**Refazer é treino; a nota já foi.** O aluno refaz à vontade (a prática é ilimitada), mas
a nota daquela entrega está lançada. Coerente com os dois eixos: XP é hábito, nota é
competência. E você não recorrige ×100 — a fila continua esvaziando, que é o que ela foi
desenhada pra fazer.
*Requisito de honestidade:* **o botão tem que dizer que é treino** antes do aluno gastar
meia hora achando que a nota vai subir. "Tentar de novo" sozinho é armadilha.

### Não tem — por decisão, não por falta de tempo
| | Por quê |
|---|---|
| **Chat com NPC (IA)** | Cortado. Era o único caminho IA→aluno. [SISTEMAS.md §17](SISTEMAS.md) |
| **Duelo X1** | Cortado. A competição vive na liga. |
| **Chat livre com o professor** | 100+ adolescentes com canal direto, sem horário, e conversa privada adulto/menor. |
| **Frequência detalhada aula a aula** | Só o total com a régua. |
| **Contestar frequência na plataforma** | Vira mais uma fila na sua vida. |
| **Ranking público ordenado** | Lei: nenhum aluno é publicamente o último. |
| **Upload de material** | É link. |

## 11. Pendências deste perfil

- Desenho das constelações do céu (§4.4).
- Catálogo e preço dos temas da loja.
- **Refazer dá XP?** O XP já foi no primeiro acerto e não decai por tentativa (§5). Então
  refazer depois de corrigido provavelmente não vale XP — e aí a recompensa é entender,
  o que é a coisa mais saudável do produto, mas precisa ser dito na tela. Decidir.
- **Pedir ajuda sem entregar?** Hoje o pedido é campo da entrega. Mas um aluno travado
  antes de entregar é exatamente quem você quer achar — e ele não tem como levantar a
  mão. Vale um "travei" solto, que vira sinal do radar sem virar chat?
- **Mural/feed** — por último, se um dia ([SISTEMAS.md §16](SISTEMAS.md)).

**Cortados (15/jul):** **duelo X1** e **chat com NPC** — ver [SISTEMAS.md §17](SISTEMAS.md).
Consequências para este perfil: a competição do aluno vive **inteira na liga** (§6.2),
que é a mecânica saudável; e **nenhuma IA fala com o aluno** — o guardrail mais difícil
do projeto deixou de existir em vez de precisar ser contido.

**Projeto em grupo:** o grupo se avalia entre si, mas isso **nunca vira XP ou nota
sozinho** — é insumo para o professor arbitrar ([SISTEMAS.md §12](SISTEMAS.md)).
Avaliação cega, nunca pública: nenhum aluno descobre que o grupo o avaliou mal.
