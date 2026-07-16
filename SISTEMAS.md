# Sistemas — o mapa do produto completo

> O inventário de tudo que a Celeste é. Índice em [CLAUDE.md](CLAUDE.md).
> Este doc é **o mapa**, não o detalhe: cada sistema tem aqui o que faz, suas
> funcionalidades, o que já está decidido e o que está aberto. O aprofundamento de cada
> um vira doc próprio conforme atacamos.
> **PT-BR sempre. Free tier sempre.**

**Legenda de status:** ✅ decidido · 🟡 parcial · ⬜ não discutido · ✂️ cortado

---

## O mapa

A leitura importante é a de cima para baixo — ela é a tese do produto
([CLAUDE.md §1](CLAUDE.md)): o dado nasce **uma vez**, no sensor, e tudo o mais é
projeção dele.

```
FUNDAÇÃO      Identidade → Currículo → Plano de ensino → Turmas
                                                  │
                                          class_unit (turma × UC)
                                          o contêiner de tudo
                                                  │
                      ┌───────────────────────────┴───────────────┐
SENSORES              ▼                                           ▼
                 Frequência                        Atividades → Correção ← Antifraude
                      │                                           │
                      └─────────────────┬─────────────────────────┘
                                        ▼
CORE                            RADAR DE RISCO ◄──── a dor central
                                        │
                          ┌─────────────┴─────────────┐
SAÍDAS                    ▼                           ▼
                   Papelada Zero                 Notificações

EM PARALELO   Gamificação — come dos mesmos sensores, devolve motivação ao aluno
TRANSVERSAL   Gateway de IA · Execução de código
FORA DO CORE  Salas/ocupação · Mural/feed
```

---

# Fundação

## 1. Identidade e governança 🟡
**O que faz:** define quem é quem e quem pode o quê.

**Funcionalidades:** papéis (`aluno | professor | coordenador | admin`) · hierarquia
(admin → professor → aluno) · **código de convite por turma** · primeiro acesso (troca
de senha + completar perfil) · dois e-mails por pessoa (institucional + pessoal, ambos
logam) · RLS por funções `SECURITY DEFINER`.

**Decidido:** ✅ sem cadastro aberto, nunca · ✅ onboarding por **código de convite por
turma** (você escreve no quadro, a turma entra sozinha na primeira aula — zero trabalho
seu, e o código é a porta) · ✅ admin é área separada ([PERFIL-ADMIN.md](PERFIL-ADMIN.md)).

**Construído (16/jul):** o código de convite liga um aluno **já existente** a uma turma
(a conta é criada pela escola — o código não cria conta). Ver §4 e [ESTADO.md](ESTADO.md).

**Aberto:** expiração do código (por ora não expira) · **como as contas de aluno nascem
em massa** sem cadastro aberto (é do admin, Fase 1 — o `db:reset` semeia à mão hoje) ·
o que acontece se um aluno usa o código da turma errada (mitigado: o dono remove) ·
recuperação de senha de menor.

---

## 2. Currículo 🟡 — *maior do que o mapa original supunha*
**O que faz:** o currículo vivo — a árvore que tudo pendura.

**Funcionalidades:** `courses` → `course_modules` → `curricular_units` · capacidades,
conhecimentos (em árvore), bibliografia da UC · matriz de competências (C1–C8) e objetos
de conhecimento (A–T) por curso · **importação do PPC por IA** + editor completo.

**Decidido:** ✅ modelo CURSO → MÓDULO → UC → TURMA é o único, desde a migration 1 (sem
`class_id` legado) · ✅ **multi-curso de verdade, e novos cursos aparecem** (não é só
Jogos Digitais — Desenvolvimento de Sistemas já existe no horizonte, e virão outros).

**Consequência:** a **importação do PPC por IA deixa de ser conveniência e vira o
coração do sistema**, com editor completo por trás. Um PPC é um documento longo, denso e
oficial; o currículo inteiro gerado a partir dele vira a base de absolutamente tudo. Por
isso a tela que importa aqui não é o editor — **é a de revisão antes de gravar**. Errar
uma UC no import contamina turmas, planos, atividades e SAEP.

**Aberto:** o fluxo de revisão do import (o mais importante) · o editor · o que acontece
quando um PPC é revisado pelo SENAI e o currículo precisa mudar **com turmas em
andamento** — este é o caso difícil e ninguém pensou nele ainda.

**Depende de:** Gateway de IA (§13). Alimenta: tudo.

---

## 3. Plano de ensino 🟡 — *o plano não é escrito; ele se materializa*

> **Correção registrada (15/jul):** este sistema foi documentado duas vezes em cima de
> uma suposição errada — a de que existe um plano escrito. **Não existe.** O plano do
> autor mora nos **slides e no material da aula**; não há documento separado. A ideia
> de "o Planejamento de UC é o briefing do substituto" **morreu nessa forma** e foi
> substituída pelo que está abaixo, que é mais barato e mais coerente com a tese.

**O que faz:** dá à UC uma espinha de blocos, sem exigir que você escreva um plano que
hoje você não escreve.

**Decidido:** ✅ **a plataforma nunca pede que você escreva um plano.** Pedir isso seria
trabalho novo disfarçado de economia — o oposto do produto.

### Como o plano existe sem ser escrito
Os **blocos são as aulas** (numeradas, datadas). Elas existem porque acontecem. O
"plano" **se materializa conforme você pendura material e atividade nas aulas** — é
subproduto de dar aula, não pré-requisito para dar aula.

### O briefing do substituto vem do rastro, não do plano
O sistema já sabe, sem você escrever nada: a turma está no bloco 3 de 7 · a última aula
foi 05/07, aplicada por você · 6 exercícios entregues · a próxima atividade é a colisão
em C#, entrega sexta.

**Isso é projeção de sensor** — o mesmo padrão da Papelada Zero (§10), o mesmo padrão de
tudo aqui. O briefing ([PERFIL-COORDENADOR.md §4.3](PERFIL-COORDENADOR.md)) sobrevive
inteiro; só mudou de fonte, e a fonte nova é de graça.

### O Planejamento de UC oficial (3 etapas SENAI)
Segue o padrão da casa: **a IA gera o rascunho** (a partir da UC + PPC + do que de fato
aconteceu na turma), **você revisa e assina**. É "sugere, humano confirma" outra vez —
e é papelada de verdade, resolvida sem você preencher formulário.

**Aberto:** a IA pode gerar o plano **antes** do semestre (planejamento de verdade, a
partir da UC + PPC) ou **depois** (descrevendo o que aconteceu)? Provavelmente os dois,
e são fluxos diferentes · clonagem entre turmas/semestres · o que a projeção faz quando
não tem de onde tirar um campo do formulário oficial.

---

## 4. Turmas ✅🟡
**O que faz:** onde as pessoas e o currículo se encontram.

**Funcionalidades:** `classes` (dono `owner_id`) → `class_members` → `class_groups` ·
`class_teachers` (co-docência) · **`class_units` (turma × UC × plano) = o contêiner
central de tudo** · substituição por falta.

**Decidido:** ✅ toda atividade nasce ligada a `class_unit_id` · ✅ **substituição por
falta** inteira ([PERFIL-COORDENADOR.md §4](PERFIL-COORDENADOR.md)): coordenador designa
com prazo que expira sozinho + quebra-vidro registrado e notificado; substituto faz
chamada e nota **registradas como dele**; handoff de ida **e volta**.

**Construído (16/jul):** `classes` (dono) + `class_members` + **código de convite**
(6 chars sem ambíguos, sem expirar, regenerável — decisão 16/jul). Entrar é por RPC
`SECURITY DEFINER` (turma não enumerável); RLS **provada com 12 ataques**. Telas
`/turmas` (Dev + Caderno) e `/turmas/[id]` (dono: lista, código, regenerar, remover).
`class_units` **ainda não** — depende de UC (currículo). Ver [ESTADO.md](ESTADO.md).

**Aberto:** co-docência permanente (dois titulares dividindo a UC por opção, não por
falta) — você mencionou que divide a turma; falta detalhar quem lança o quê ·
expiração/uso do código pela turma errada (mitigado por ora: o dono remove o aluno).

---

# Sensores

## 5. Frequência ✅🟡
**O que faz:** o sensor mais barato do radar, e documento oficial ao mesmo tempo.

**Funcionalidades:** `attendance_sessions` (aula = número/período/data) →
`attendance_marks` (presente / atraso / falta) · frequência **por aula**, não por dia ·
corte de 75%.

**Decidido:** ✅ chamada no **PC, no começo da aula** (não é mobile — mata a hipótese da
auditoria e economiza muito) · ✅ lista densa, teclado, rápida (×4 turmas/dia) ·
✅ **todo lançamento tem autor** (`registered_by`) · ✅ **ausência de chamada nunca
quebra streak** — fica pendente até você confirmar · ✅ **atraso existe e conta como
presença**.

**Sobre o atraso:** ele vale os 75% igual à presença — não pune duas vezes e não muda o
documento oficial (o QGR só tem `F` e `.`, então atraso é **dado interno**). Mas ele
alimenta o radar: atraso crônico é sintoma precoce, e é de graça registrar. Você **não**
arbitra relógio na porta — não existe "X minutos vira falta".

**Aberto:** como corrigir chamada de uma semana atrás sem bagunçar o diário (e sem
quebrar streak retroativamente).

---

## 6. Motor modular de atividades 🟡 — *o maior sistema*
**O que faz:** o contrato que permite adicionar um tipo de atividade sem tocar em
nenhuma tela existente.

**Funcionalidades:** registro central de tipos — cada tipo = **editor (professor) +
player (aluno) + schema de entrega (JSONB/Zod) + corretor + regra de XP + runner +
política de tentativas** · `assignments` (ligada a `class_unit_id`) · `exercises` =
banco reutilizável **clonável** · `submissions` tipadas por JSONB.

**Os 6 tipos** (eram 8 — **duelo X1** e **chat com NPC** foram cortados, ver §17):
**pseudocódigo/lógica** · código · pixel art/vetor · link/embed · projeto em grupo ·
SAEP (quiz) · SAP (rubrica).

> **`pseudocódigo/lógica` é o tipo nº 1 a construir** — ele declara `runner: none`,
> exercita o motor inteiro e não encosta no maior risco técnico do projeto. Ver §14.

### O banco de exercícios — comum, voluntário, sem curadoria
✅ **Comum a TODOS os docentes, não só do curso.** Não é generosidade, é estrutura:
*Lógica de Programação existe em Jogos Digitais **e** em Desenvolvimento de Sistemas*.
As UCs se repetem entre cursos — um banco que parasse na fronteira do curso estaria
errado por construção.

✅ **Voluntário e sem curadoria.** Cada docente cria o seu. Publicar no comum é opcional;
se outro achar interessante, clona. **Ninguém aprova nada, ninguém é obrigado a nada.**
Exercício ruim simplesmente não é clonado — e nenhum professor vira juiz do trabalho de
outro, que é o mesmo veneno que fez a gente proibir o radar por professor (§9).

✅ **Clonar é livre; editar o original é só do dono.** O clone é seu para sempre.

**É a única alavanca concreta de adoção voluntária que apareceu:** o colega entra pra
pegar exercício pronto e fica pelo resto. É dar antes de pedir.

**Aberto:** banco comum vazio é banco morto — ele nasce com os exercícios do autor (que é
o primeiro usuário), e cresce ou não. Sinal de uso ("clonado 14×") ordenaria sozinho, sem
julgar ninguém — vale a pena?

**Decidido:** ✅ nenhuma tela compara tipo por string — o registro decide ·
✅ **tentativas por tipo, declaradas no registro**: prática = **ilimitada** (errar é de
graça e é como se aprende a programar), prova/boss = **uma**, lockdown ·
✅ **XP cheio no acerto, sem decaimento por tentativa** (punir tentativa é punir o
método de aprender; quem protege contra força bruta é o antifraude e a prova) ·
✅ a tela de atividade é **desktop** e é onde a gamificação acontece.

**Aberto:** **a tela de atividade em si** — a mais importante do sistema e a única que
nenhum protótipo desenhou · os 6 tipos, um a um (começando por pseudocódigo) · Monaco vs
CodeMirror · casos de teste ocultos.

---

## 7. Correção ✅🟡 — *a maior alavanca de tempo*
**O que faz:** transforma entrega em nota, sem consumir seu sábado.

**Funcionalidades:** fila · correção automática (testes) · sugestão da IA · nota manual
+ feedback · dois modos (rápido na aula / em lote depois).

**Decidido:** ✅ **IA sugere, você confirma sempre** · ✅ **não existe "aceitar todas"**,
nenhuma variante · ✅ **a entrega inteira está na tela onde você confirma** — nunca uma
linha de tabela com "IA sugere 9,0 [Confirmar]"; se confirmar exige troca de contexto, a
confirmação é teatro · ✅ a IA mostra o **porquê**, curto e ao lado · ✅ **a fila carrega
as incertas primeiro**, enquanto você está fresco · ✅ teclado primeiro, sem sair da tela
· ✅ **interrompível** (corrige duas, um aluno chama, volta e não perde o lugar).

**Aberto:** a tela em si · como o feedback chega ao aluno · reabrir correção já lançada.

---

## 8. Antifraude 🟡
**O que faz:** dá **score**, nunca veredito.

**Funcionalidades:** eventos de paste · tempo · edições · similaridade entre alunos →
score de suspeita.

**Decidido:** ✅ **colou = sem XP** (mas a nota é decisão humana) · ✅ **nunca acusa na
cara do aluno** — coleta em silêncio, o resultado vai para o professor · ✅ a IA **nunca**
julga fraude · ✅ **sempre visível, junto da entrega** (não escondido até você dar a nota).

### Evidência, não veredito — o que "sempre visível" significa
Você escolheu ver junto da entrega, e o custo é conhecido: ver um número antes de ler o
código enviesa o julgamento, e viés é invisível para quem está dentro dele.

A saída não é esconder — é **mostrar a coisa certa**. Repare:

| ❌ Veredito (a máquina julgando) | ✅ Evidência (a máquina medindo) |
|---|---|
| `suspeita: 87%` | `colou 3× · 40s entre abrir e entregar · 0 edições` |
| `provável fraude` | `95% igual à entrega do Miguel B.` |

Mesma visibilidade, mesmo instante, zero perda de informação — e o veredito continua
seu. Um **score** é a máquina dizendo "este aluno é desonesto"; os **eventos** são a
máquina dizendo o que aconteceu. [Lei 0](CLAUDE.md).

Isso não é preciosismo: `87%` não te deixa discordar (de quê? do número?), enquanto
`40s entre abrir e entregar` você bate o olho e sabe se faz sentido — o aluno pode ter
resolvido no papel antes.

**Aberto:** limiares · o que fazer com similaridade entre turmas diferentes (e entre
semestres — o irmão mais velho fez a mesma UC ano passado).

---

# Core

## 9. Radar de risco ✅🟡 — *o motivo do produto existir*
**O que faz:** responde a dor central — **com 100+ alunos você perde gente de vista e
descobre tarde**.

**Funcionalidades: duas listas** — uma por ação, não uma por sinal.

| Lista | Sinal | Ação |
|---|---|---|
| **Prestes a reprovar** | freq. < 75% **ou** nota < 70% | Formal: ocorrência, conversa, RPA. O corte institucional que o SENAI cobra de você. |
| **Sumindo** | parou de entregar **ou** parou de vir | **Procurar o aluno.** O sinal precoce — chega semanas antes do corte. |

**Por que duas e não três** (eram três; fundidas em 15/jul): o sinal de queda decidido é
**parar de entregar / atrasar** — não a nota caindo, porque quando a nota cai o problema
começou semanas antes, e a entrega é o dado mais precoce **e** mais barato (a plataforma
já sabe o prazo e já sabe se chegou). Só que com esse sinal, "Caindo" e "Sumindo"
viraram a mesma coisa: as duas são *parou de produzir sinal*. E como **a ação é a mesma —
procurar o aluno** —, são uma lista só. Parar de entregar e parar de vir também vão
juntas, pelo mesmo motivo.

O **grau** vive dentro da lista, como badge: `atrasou as 2 últimas` · `3 semanas sem
entregar` · `faltou 4 aulas seguidas`.

**Decidido:** ✅ **lista vazia não aparece** (numa semana boa o bloco some inteiro —
cockpit de tamanho fixo vira papel de parede) · ✅ teto visível de 5 nomes + "mais N" ·
✅ o coordenador vê o mesmo radar agregado **por turma e por UC** · ✅ **jamais agrega,
rankeia ou compara professor** — a adoção voluntária dos colegas morre no dia em que a
ferramenta dedurar alguém.

**Aberto:** os limiares numéricos — quantos atrasos, em quanto tempo, quantas faltas.
Precisa de dado real; hoje qualquer número é chute. **Nasce ajustável**, e o primeiro
semestre é que calibra.

**Depende de:** Frequência (§5) + Correção (§7). Por isso o radar não pode ser a Fase 1
mesmo sendo o core.

---

# Saídas

## 10. Papelada Zero 🟡
**O que faz:** gera documento oficial do dado que já existe. **Não tem tabela própria —
são projeções.** O dado nasce uma vez.

**Funcionalidades:** diário de frequência **XLSX** (QGR-ACRED-01: colunas por aula,
`F`/`.`, % com verde/vermelho no corte de 75%) · Planejamento de UC (3 etapas) · livro
de ocorrências (aluno|turma / info / data / **autor**) · menções do PPC (PPS 80–100 /
PPM 70–79 / PPI 0–69; APA/RPA; aprovação = 70% + 75%).

**Decidido:** ✅ diário XLSX primeiro · ✅ é **subproduto, não motivo** — mas vale ×4
turmas de retrabalho eliminado · ✅ **o diário mostra quem aplicou cada aula**
(exigência da substituição) · ✅ o coordenador é o segundo cliente dos mesmos geradores.

**Aberto:** os formatos exatos — **os arquivos oficiais estão no seu Desktop** (`PPC
Jogos.pdf`, `Matriz_SAEP_*.xls`, `avaliações.pdf`, `Matriz vertical.pdf`). Posso lê-los
de verdade quando atacarmos este sistema.

**Depende de:** `@media print` e geração XLSX no free tier.

---

## 10.1 Pesquisas de UC 🟡 — *real, o SENAI cobra*
**O que faz:** o aluno avalia a UC/o curso; o relatório institucional sai pronto.

**Decidido:** ✅ **é obrigação institucional, não enfeite** — então é **Papelada Zero com
coleta**: aplica a pesquisa, e o relatório é projeção das respostas. Mesmo padrão de tudo:
o dado nasce uma vez.

**Consequência que abre escopo:** é a **única coisa que o aluno faz que não é atividade
nem consulta**. Cria uma tela nova no perfil dele (responder), e ela não pode parecer
tarefa — não vale XP, não vale nota, não entra na trilha.

**Aberto:** anonimato (é o ponto todo de uma pesquisa — mas o sistema sabe quem
respondeu; precisa ser anônimo **na leitura**, não na coleta) · quando aplica (fim da UC?)
· o formulário é fixo do SENAI ou você monta?

**Depende de:** [PERFIL-COORDENADOR.md](PERFIL-COORDENADOR.md) — é tarefa dele.

---

## 11. Notificações 🟡
**O que faz:** avisa sem virar ruído.

**Funcionalidades:** in-app · **notifica o titular quando alguém entra na sua UC**
(inclusive quebra-vidro) · correção lançada → aluno.

**Decidido:** ✅ nada que se mexa sozinho na periferia da tela ([CLAUDE.md §2.14](CLAUDE.md))
· ✅ **ao aluno, só o dado, sem juízo.**

A plataforma **nunca** diz a um adolescente que ele está mal. Ela mostra
`frequência 71% · precisa de 75%` e ele tira a própria conclusão. É a lei "número sem
régua é ansiedade" ([CLAUDE.md §2.2](CLAUDE.md)) fazendo o trabalho sozinha: com a régua
ao lado, o dado já é o aviso — e sem um sistema julgando quem ele é.

O juízo é humano: o radar é o **seu** instrumento, a conversa é sua.

**Aberto:** push no celular? · o que notifica de verdade vs. o que só aparece quando você
abre · com que frequência o professor é notificado sem virar ruído (100+ alunos gerando
evento).

---

# Em paralelo

## 12. Gamificação ✅🟡
**O que faz:** mantém o aluno produzindo sinal para o radar. É **meio**, não fim.

**Funcionalidades:** XP/nível · **liga (fases da lua)** · streak · **céu/constelações** ·
conquistas · moedas · loja de temas.

**Decidido:** ✅ **XP e nota são dois eixos, ambos sempre visíveis** — nunca aparecem
sozinhos · ✅ **acontece no ponto da ação** (a barra enche na tela da correção) ·
✅ **liga dentro da turma**, ~5 alunos, ciclo semanal, sobe/desce — **nunca lista
ordenada da turma** · ✅ as 5 ligas são as **fases da lua**: Nova → Crescente → Quarto →
Gibosa → **Cheia** · ✅ **streak por aula** (compareceu **e** produziu) — nunca por dia ·
✅ ausência de chamada não quebra streak · ✅ loja é **cosmético puro**, desbloqueio
permanente, nunca muda usabilidade nem conteúdo.

### Projeto em grupo — o grupo se avalia, **você** arbitra
✅ **Decidido: avaliação entre pares.** É o único jeito de enxergar o que você não viu
(quem carregou o grupo e quem pegou carona).

**Mas com menores de idade isso vira política, amizade e retaliação** se for automático.
Então ela obedece a [Lei 0](CLAUDE.md): **a avaliação dos pares nunca vira XP ou nota
sozinha — é insumo para o seu julgamento**, exatamente como a sugestão da IA e o score
do antifraude. Guardrails:

- **Cega**: ninguém vê quem avaliou o quê. Nem depois.
- **Nunca automática**: entra na sua tela como sinal, não como resultado.
- **Nunca pública**: nenhum aluno descobre que o grupo o avaliou mal. Isso é o
  suficiente para destruir um adolescente, e não é o objetivo.
- **Discordância é informação**: se o grupo diverge muito, isso é o sinal — é o momento
  de você olhar, não de a média decidir.

**Aberto:** desenho das constelações (uma por UC?) · catálogo e preço dos temas ·
economia de moedas · a forma da pergunta feita ao grupo (uma pergunta ruim aqui envenena
tudo).

**Nota:** com o **duelo X1 cortado** (§17), a competição do aluno vive inteira na liga —
coerente com a lei "nenhum aluno é publicamente o último". Sobrou uma só mecânica
competitiva, e ela é a saudável.

---

# Transversal

## 13. Gateway de IA ✅🟡 — *ficou muito mais simples*
**O que faz:** **um** ponto server-side por onde toda IA passa.

**Funcionalidades:** importar PPC (admin) · gerar exercício (professor) · sugerir
feedback/nota (professor).

### A lei que caiu do colo com o corte do NPC

> **A IA nunca fala com o aluno. Toda saída de IA passa por um humano antes de chegar a
> um menor de idade.**

Olhe a lista de usos acima: **todos são voltados a adulto**. Com o chat com NPC cortado
(§17), não sobrou nenhum caminho pelo qual um modelo converse com um adolescente. O
guardrail mais caro, mais arriscado e mais impossível de garantir do projeto inteiro —
menor de idade conversando livremente com uma IA — **deixou de existir**, em vez de
precisar ser contido.

O aluno ainda consome coisa que a IA tocou (exercício gerado, feedback sugerido), mas
**sempre depois de um humano revisar e assinar**. A mediação não é um filtro que pode
falhar: é a arquitetura.

Esta foi a maior redução de risco da sessão, e ela veio de cortar, não de construir.

**Decidido:** ✅ chave **nunca** no cliente · ✅ Gemini free atrás de interface trocável
(`AiProvider`) · ✅ **nunca fecha nota sozinha, nunca julga fraude** · ✅ **nunca fala com
o aluno**.

**Aberto:** rate limit do free tier (o import de PPC é uma chamada grande) · o que
acontece quando a IA está fora do ar (resposta provável: nada quebra — nenhum uso é de
caminho crítico do aluno).

---

## 14. Execução de código 🟡
**O que faz:** roda o código do aluno sem Docker em produção.

**Funcionalidades:** interface `CodeRunner` · Piston público (`emkc.org`) + fila +
cache + degradação graciosa · fallback próprio · client-side quando fizer sentido (JS/TS
sandbox, Python via Pyodide).

**Decidido:** ✅ sem Docker em produção · ✅ **o tipo de atividade declara qual runner
usa** · ✅ **são várias linguagens ao longo do curso** — o que confirma que `CodeRunner`
plugável por tipo estava certo desde o começo, e não é over-engineering.

**A realidade das linguagens** (levantada 15/jul): varia por professor e por curso. O
autor começa **Jogos Digitais com C#** e **Desenvolvimento de Sistemas com
pseudocódigo**. Às vezes lógica pura, às vezes linguagem direto.

**O risco, dito com precisão:** client-side (JS/TS via sandbox, Python via Pyodide)
resolve o problema **de graça** — sem rate limit, sem servidor, sem fila. **C# não roda
no browser** e cai obrigatoriamente no Piston público, com 100+ alunos apertando "rodar"
às 07:15 da mesma aula contra um serviço gratuito. O risco não é do sistema — **é por
linguagem**.

### ⭐ O caminho que desarma o risco: `runner: none` primeiro

**Pseudocódigo não precisa de runner nenhum.** O tipo declara `runner: none` e a
correção é humana/IA. Isso não é um caso especial: é o `CodeRunner` plugável fazendo
exatamente o que foi desenhado para fazer — e um dos runners é **nenhum**.

Consequência de sequenciamento, e é a melhor notícia técnica do projeto:

> **Construa o tipo pseudocódigo/lógica primeiro.** Ele exercita o motor de atividades
> **inteiro** — editor do professor, player do aluno, schema de entrega, correção, nota,
> XP, antifraude, fila — **sem encostar no maior risco técnico do projeto**.

Com o motor provado e em uso real, o C#/Piston entra como **segundo runner**, e o teste
de carga é feito com calma, fora da aula, em vez de ser descoberto às 07:15 com a turma
olhando. Se o Piston não aguentar, você descobre isso com um sistema funcionando ao lado
— não com a Fase 1 travada.

**Decidido:** ✅ construir `runner: none` (pseudocódigo) antes de qualquer runner real.

**Aberto:** o teste de carga do Piston com C# (pré-requisito para a UC de Jogos, não
para a Fase 1) · qual sandbox para JS/TS quando chegar a vez.

---

# Fora do core

## 15. Salas, ocupação, calendário 🟡 — *mantido*
Tarefa do coordenador. **Mantido por decisão sua**, contra minha recomendação (registro
aqui só para o histórico, não para reabrir): não reaproveita nada, não alimenta o radar,
não gera documento oficial e não toca a dor central. Ver
[PERFIL-COORDENADOR.md §6](PERFIL-COORDENADOR.md).

**Consequência de construir:** é o último da fila, e ele tem cara própria (agendamento),
não a cara do resto do produto.

## 16. Mural / feed estilo Classroom ⬜ — *mantido*
Por último. É enfeite social, não core.

---

## 17. Cortados ✂️

| Sistema | Por que saiu |
|---|---|
| **Chat com NPC (IA)** | O uso de IA mais caro e mais arriscado: menor de idade conversando livremente com um modelo. Guardrail de verdade é trabalho pesado e o retorno pedagógico era hipótese. **Cortá-lo eliminou o único caminho IA→aluno** — ver §13. |
| **Duelo X1 (ELO por UC)** | Divertido e caro: pareamento, tempo real, ELO contextual e antifraude próprio. Um jogo dentro do produto. A competição vive na liga (§12), e a liga é a mecânica saudável. |

Cortes são decisões de produto, não adiamentos. Se voltarem, voltam por um motivo novo —
não por saudade.

---

## Ordem de construção

Substitui o [BLUEPRINT.md §9](BLUEPRINT.md) no que ele tem de invertido:

**Fase 0 — Fundação:** repo + deploy free tier com auth · migrations como fonte única +
RLS helpers · **kit de UI, 4 variantes de skin, tokens de movimento** · interfaces
`AiProvider`/`CodeRunner` (stubs) · registro de features e de tipos de atividade.

**Depois, guiado pela dor:**
1. **Identidade + turmas + código de convite** — sem gente, nada existe.
2. **Chamada** — o sensor mais barato; já vale sozinho (×4 turmas/dia).
3. **Atividade de pseudocódigo (`runner: none`) + correção + fila** — o segundo sensor e
   a maior alavanca de tempo. **Prova o motor inteiro sem tocar no Piston** (§14).
4. **Radar** — o motivo de tudo. Nasce com limiares ajustáveis; o 1º semestre calibra.
5. **Papelada Zero** (diário XLSX) — sai de graça de 2 e 3.
6. **Substituição** — pequena; o briefing sai do rastro que 2 e 3 já produzem (§3).
7. **C# via Piston** — como 2º runner, **depois** do teste de carga, com o motor já
   provado ao lado.
8. **Gamificação plena** · **SAEP/SAP** · **demais tipos** · salas e mural por último.

**Regra de ouro por fatia:** não é "pronta" sem (a) **1 teste e2e** do fluxo que ela
entrega e (b) passar na régua de UI ([CLAUDE.md §2.15](CLAUDE.md)).
