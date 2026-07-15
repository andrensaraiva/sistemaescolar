# Perfil — Instrutor

> Parte da documentação de produto da Celeste Academy. Índice em [CLAUDE.md](CLAUDE.md).
> Arquitetura em [BLUEPRINT.md](BLUEPRINT.md) · Crítica que originou estas decisões em [ANALISE-UX.md](ANALISE-UX.md).
> **Decisões travadas em 15/jul/2026.** PT-BR sempre. Free tier sempre.

---

## 1. Quem é

Professor do técnico SENAI de Programação de Jogos Digitais, **4+ turmas, 100+ alunos**,
e **o único dev da plataforma**. Faz chamada no PC no começo da aula. Corrige em dois
momentos: rápido durante a aula e em lote depois. Usa celular de verdade fora da escola.

Skin: **Dev**, claro e escuro (ver [DESIGN.md](DESIGN.md)).

> **Atenção ao ler os outros docs:** eles falam de "a turma" no singular e mostram
> listas nominais de 26 alunos. Isso está desatualizado. O número real é **100+**, e
> quase toda decisão de densidade muda por causa disso.

---

## 2. A dor central — e a inversão que ela causa

**A dor não é a papelada nem a correção. É perder aluno de vista e descobrir tarde.**

Com 100+ alunos, você não olha todo mundo. Alguém afunda em silêncio por seis semanas
e vira estatística no fechamento do bimestre. Isso reorganiza o produto inteiro:

**O que o BLUEPRINT §9 diz hoje:**
> registre a aula → gere o documento oficial (Papelada Zero)

**O que passa a valer:**
> **registre a aula → veja quem está afundando — e o documento sai de graça**

Chamada e correção deixam de ser fins e viram os **sensores do radar**. A Papelada
Zero continua valendo muito (×4 turmas de retrabalho eliminado), mas é **subproduto,
não motivo**. O radar de risco é o core; a gamificação do aluno é o meio de mantê-lo
produzindo sinal.

**Consequência para a ordem de construção:** o radar não pode ser Fase 5 (como está
no §9), mas também não pode ser Fase 1 — ele é feito de dados que precisam existir
antes. A sequência mínima é: **chamada + correção mínima → radar → papelada**.
Ver §10.

---

## 3. As leis do perfil

1. **O cockpit escolhe por você.** Com 100+ alunos, qualquer tela que peça para você
   varrer uma lista já falhou.
2. **Nada de KPI de vaidade na linha nobre.** "Presença média 87% · +2%" não gera
   ação nenhuma. Presença média é relatório. O topo da tela é para o que tem prazo.
3. **Confirmação nunca é teatro.** Ver §5.
4. **Não existe "aceitar todas".** Você assina nota de menor de idade.
5. **Mono só onde número alinha.** Ver §4.
6. **No desktop você produz; no celular você consulta.** Ver §8.

---

## 4. A skin Dev — o que ela é, agora que não tem chrome

**Decisão: Dev é paleta + mono nos dados + layout de app limpo.** Sem abas, sem
árvore de arquivos, sem cosplay de editor. (O "chrome de editor" existia no protótipo
só na tela do *aluno* em H — a visão não escolhida — e a própria view já desfazia o
mono no corpo com `--fb:'Schibsted Grotesk'`, acertadamente.)

**O preço dessa decisão, dito na cara:** sem chrome, a skin do instrutor não tem
nenhum conceito para segurá-la. O risco de "cara de template" entra exatamente por
essa porta — e não há enfeite que o resolva, porque acabamos de decidir não ter
enfeite. Então a personalidade precisa vir da **disciplina**, e ela só existe se for
aplicada sem exceção:

1. **Mono (JetBrains Mono) só onde número alinha** — KPI, nota, %, hora, contagem, XP,
   ID. **Nunca** em nome de aluno, título, enunciado, feedback. Essa regra, cumprida
   com rigor, é visível e é assinatura. Cumprida pela metade, é só inconsistência.
2. **Âmbar (`#FFB454`) só no que é acionável.** Se tudo é âmbar, nada é. Uma tela do
   instrutor tem pouquíssimo âmbar — e onde ele está, você clica.
3. **`~/` como marca tipográfica**, que já é sua (`~/celeste`, `~/turmas`,
   `~/correções`). É o sabor de terminal sem a fantasia de terminal — um prefixo
   inline autoral, não um badge decorativo.
4. **Densidade real.** Tabela é tabela. Nada de card gigante com um número dentro.
   Com 100+ alunos, densidade é respeito.

**A dívida a pagar primeiro:** os labels **CAPS cinza** (`.blk .ttl`, `.kpi .lb`,
`.ptbl th` — 10.5px, `letter-spacing`, `color:var(--mut)`, `text-transform:uppercase`).
O `CLAUDE.md` proíbe isso explicitamente como marca de IA. A skin Caderno escapou
porque sobrescreve tudo para Caveat em caixa baixa; **a Dev não sobrescreve nada, e
ainda reforça.** Sem chrome, esses labels deixam de ser detalhe e passam a ser a cara
da skin. Substituir por título em caixa baixa, peso e tamanho — hierarquia por
tipografia, não por CAPS.

> **Isto torna o [ANALISE-UX.md §2](ANALISE-UX.md) caminho crítico para este perfil:**
> se a personalidade não vem da pele, ela tem que vir da estrutura. Não há terceira opção.

---

## 5. A fila de correção — a maior alavanca do produto

Serve **dois modos** (você corrige nos dois): rápido durante a aula, em lote depois.

### 5.1 A regra contra o teatro de confirmação
Você decidiu: **IA sugere, você confirma sempre.** Com 100+ alunos isso tem um modo
de falha óbvio — clique repetido vira clique automático. Você assina do mesmo jeito,
só que se sentindo bem. O design tem que impedir isso:

- **A entrega inteira está na tela onde você confirma.** Nunca uma linha de tabela com
  "IA sugere 9,0 · [Confirmar]". Se confirmar exige zero troca de contexto, a
  confirmação é real; se exige um clique para ver, ela é teatro.
- **A IA mostra o porquê, curto e ao lado**: "9,0 — passou 8/8 testes, código legível,
  sem tratamento de borda". Nota sem razão é palpite com autoridade.
- **Não existe "aceitar todas".** Nem "aceitar todas acima de 8". Nenhuma variante.
- **A fila carrega as incertas primeiro**, enquanto você está fresco. As óbvias ficam
  para o fim, quando você já está no automático — e aí o automático custa pouco.

### 5.2 Fluxo
Teclado primeiro: navega, nota, confirma, próxima — **sem sair da tela**. Para 100+
alunos, cada navegação a mais é multiplicada por cem. É aqui que "Dev = ferramenta"
ganha sentido de verdade: não pelas abas, pelo atalho.

**Interrompível:** você corrige duas, um aluno chama, você volta e não perde o lugar.
Estado preservado importa tanto quanto velocidade — é o modo "durante a aula".

### 5.3 O que a IA nunca faz
Não fecha nota sozinha. Não conversa com o aluno sem você poder ler (transcrições
visíveis ao professor — Pilar 3 do blueprint). Não julga suspeita de fraude: o
antifraude dá **score**, você dá o veredito.

---

## 6. O cockpit "Hoje"

Ordem de urgência, não de importância institucional:

1. **O que começa agora** — a aula das 07:00 com chamada pendente. É a única coisa da
   tela com prazo em minutos.
2. **Atenção** — as duas listas (§6.1).
3. **A fila** — quantas correções esperam, com entrada direta.
4. **Papelada** — quando tem documento pronto para sair.

**Fora do cockpit:** presença média, "no prazo 74%", "+6% no bimestre". Isso é
relatório. No protótipo atual esses quatro KPIs ocupam a linha mais nobre da tela e
não geram ação nenhuma — é a estrutura, não a cor, que faz aquela tela parecer gerada.

### 6.1 As duas listas de atenção
**Uma lista por ação, não uma por sinal.** Nomes em PT-BR simples:

| Lista | Sinal | O que você faz |
|---|---|---|
| **Prestes a reprovar** | freq. < 75% **ou** nota < 70% | Ação formal: ocorrência, conversa, RPA. É o corte que o SENAI cobra de você. |
| **Sumindo** | parou de entregar **ou** parou de vir | **Procurar o aluno.** Chega semanas antes do corte — é o sinal preventivo. |

**Por que duas e não três** (começaram como três): o sinal de queda que você apontou é
*parar de entregar / atrasar* — não a nota caindo, porque quando a nota cai o problema
já tem semanas. Só que com esse sinal, "Caindo" e "Sumindo" viraram a mesma coisa: as
duas são *parou de produzir sinal*. E **a ação é a mesma — procurar o aluno**. Então são
uma lista só. O grau vive dentro dela, como badge: `atrasou as 2 últimas` ·
`3 semanas sem entregar` · `faltou 4 aulas seguidas`.

**Lei contra o cockpit cheio: lista vazia não aparece.** Numa semana boa o bloco de
atenção some inteiro, e isso é uma informação ótima. O cockpit encolhe quando a turma
vai bem — se ele tem sempre o mesmo tamanho, vira papel de parede e você para de ler.

Cada lista tem **teto visível** (5 nomes + "mais N"). Lista de 40 nomes é lista que
ninguém lê.

---

## 7. Chamada

**Desktop, começo da aula.** (Isso mata a hipótese de "chamada no celular andando pela
sala" que a auditoria levantou — e economiza muito trabalho.)

Lista densa, teclado, rápida. ×4 turmas por dia, então cada segundo conta.

**Acoplamento crítico com o aluno:** o streak do aluno depende da sua chamada
([PERFIL-ALUNO.md §6.3](PERFIL-ALUNO.md)). Se você esquece a chamada de sexta, a
ofensiva da turma inteira quebraria por culpa do sistema. **Lei: ausência de chamada
nunca quebra streak** — fica pendente até você confirmar.

---

## 8. O contrato desktop / celular

Você usa celular de verdade fora da escola — então o perfil **é** responsivo, e essa
é a parte que a decisão "Dev = layout limpo" encareceu (dito na hora, mantido aqui).

| | Desktop | Celular (fora da escola) |
|---|---|---|
| **Verbo** | Produzir | Consultar e receber |
| **Faz** | Chamada, correção, plano, exercício, papelada | Ver o radar, ler uma entrega, receber alerta |
| **Não faz** | — | Chamada, correção em lote, montar plano |

É a **mesma lei do aluno** ([PERFIL-ALUNO.md §2](PERFIL-ALUNO.md)), o que é uma boa
notícia: uma regra só para o sistema inteiro.

---

## 9. Acessibilidade

Mesma régua do outro perfil: foco como token da skin, piso de 12px, tudo que clica é
`<button>`, `prefers-reduced-motion` respeitado, `@media print` desde o começo (a
Papelada depende), erros em PT-BR e específicos, toast em vez de `alert()`.

---

## 10. Ordem de construção deste perfil

Derivada da dor (§2), substitui o §9 do blueprint no que toca o instrutor:

1. **Chamada** — o sensor mais barato e o que já vale sozinho (×4 turmas/dia).
2. **Correção mínima + fila** — o segundo sensor, e a maior alavanca de tempo.
3. **Radar de risco** — as duas listas. É o motivo de tudo.
4. **Papelada Zero** — diário XLSX primeiro. Sai de graça dos dados de 1 e 2.
5. **Plano de ensino / banco de exercícios** — o que vem antes da aula.

---

## 11. Co-docência e substituição — resolvido

Você divide turma, e a UC pode ser dividida quando precisa de **substituição por
falta**. O sistema inteiro está em
[PERFIL-COORDENADOR.md §4](PERFIL-COORDENADOR.md) (é o coordenador quem designa).

O que te afeta diretamente:

- **O substituto faz chamada e lança nota, registrados como dele.** Todo lançamento
  tem autor; o diário mostra quem aplicou cada aula.
- **Você não escreve nada para ele.** O briefing é montado do rastro que a plataforma já
  tem (onde a turma está, última aula, entregas, o que está pendurado na aula de hoje).
  Ver [SISTEMAS.md §3](SISTEMAS.md) — a versão anterior deste doc supunha que você
  escrevia um plano; você não escreve, e a ideia foi refeita.
- **Você é notificado** quando alguém entra na sua UC, sempre — inclusive no
  quebra-vidro de emergência.
- **Quando você volta, você lê o que aconteceu.** A substituição é um handoff de ida
  **e volta**; o substituto registra o que aplicou, inclusive se aplicou algo próprio.

**Decidido e cortado:** modo aula/projetor não existe. Você dá aula com outra coisa;
a Celeste é ferramenta de bastidor.

## 12. Inventário de funcionalidades

Varredura completa (15/jul/2026). Duas descobertas grandes estão em §12.1 e §12.2 — as
duas eram buracos que nenhum doc tinha visto.

### Tem
| Funcionalidade | Nota |
|---|---|
| **Cockpit "Hoje"** — por ação, nunca por KPI | §6 |
| **As 2 listas de atenção** | §6.1 |
| **Fila de correção** — teclado, IA sugere, sem "aceitar todas" | §5. Protótipo aprovado. |
| **Chamada** — PC, começo da aula, atraso conta como presença | §7 |
| **Papelada Zero** — diário XLSX, Planejamento de UC, ocorrências, menções | [SISTEMAS.md §10](SISTEMAS.md) |
| **Criar atividade** — banco → IA → do zero | §12.1 |
| **Banco de exercícios** — comum a **todos os docentes** | §12.1 |
| **Dossiê do aluno** — a linha do tempo | §12.2 |
| **Ocorrências** — radar **e** papelada | Registrar uma ocorrência é sinal forte: alguém já se incomodou o bastante pra escrever. O dado nasce uma vez. |
| **Substituição** — notificado sempre, briefing de rastro | §11 |
| **Desktop produz / celular consulta** | §8 |

### 12.1 Criar atividade — o editor, e a Lei 1
**O motor promete "editor do professor + player do aluno". Só o player existia.**

**Decidido: os três caminhos, com o banco na frente.**

| Caminho | Quando |
|---|---|
| **Clonar do banco** | O padrão. Você quase nunca cria do zero. |
| **IA gera o rascunho** | Quando não tem no banco. Uso voltado a adulto, mediado — dentro da Lei 0. |
| **Do zero** | A saída, não a porta. |

**Consequência dura: o editor nunca abre em branco** ([Lei 1](CLAUDE.md)). Ele abre com
um clone ou um rascunho, e o trabalho é **editar**. Uma tela de criação vazia aqui seria
a plataforma cobrando trabalho em vez de devolver.

**O banco é comum a TODOS os docentes — não só do seu curso.** Isso não é generosidade,
é estrutura: **Lógica de Programação existe em Jogos Digitais e em Desenvolvimento de
Sistemas**. As UCs se repetem entre cursos, então um banco que parasse na fronteira do
curso estaria errado por construção.

E é a **única alavanca concreta de adoção voluntária** que apareceu: o colega entra pra
pegar exercício pronto e fica pelo resto. É dar antes de pedir — e, ao contrário do radar
por professor (proibido), não dedura ninguém.

*Governança:* **clonar é livre; editar o original é só do dono.** O clone é seu para
sempre; o original de quem o escreveu.

### 12.2 O dossiê do aluno — o alvo do core
O radar diz "Sumindo · Adryan S.". **Você clica. Antes desta varredura, não havia nada
do outro lado** — a ação-alvo da feature principal do produto não existia.

**Decidido: a linha do tempo dele** — entregas, faltas, notas, ocorrências, em ordem.
Você bate o olho e entende a história: *"parou em 12/06, faltou 3 seguidas, entregou meia
colisão com um 'travei aqui'"*.

**Sai de graça:** é **projeção dos sensores**, que já existem. Nenhuma tabela nova, nenhum
dado registrado duas vezes. Mesmo padrão do briefing do substituto e da Papelada Zero.

É também o que torna o radar honesto: com 100+ alunos você **não** lembra do Adryan — e
é exatamente por isso que o radar existe. Apontar um nome sem contar a história seria
pedir que você agisse no escuro.

### Não tem — por decisão
| | Por quê |
|---|---|
| **Modo aula / projetor** | Você dá aula com outra coisa; a Celeste é bastidor. |
| **Chamada no celular** | É no PC, começo da aula. |
| **"Aceitar todas"** na correção | Nenhuma variante, nunca. |
| **Radar por professor** | Mata a adoção voluntária dos colegas. [PERFIL-COORDENADOR.md §3](PERFIL-COORDENADOR.md) |
| **Chat com aluno** | O aluno pede ajuda **dentro da atividade**; chega na fila com contexto. |
| **Upload de material** | É link. [PERFIL-ALUNO.md §10](PERFIL-ALUNO.md) |

## 13. Pendências deste perfil

- **Limiares do radar**: quantos atrasos, quantas faltas, em quanto tempo. Nascem
  ajustáveis; o 1º semestre calibra.
- **Banco comum vazio é banco morto** — como ele nasce com conteúdo? (o seu, importado?)
- **Qualidade do banco comum**: exercício ruim de colega aparece pra todo mundo. Tem
  curadoria, ou clonar-e-consertar já resolve?
- A fila precisa marcar **quem pediu ajuda** (o campo "travei aqui" da entrega) — o
  protótipo ainda não mostra isso.
- **Lançar nota sem atividade na plataforma** (prova em papel) — existe?
- Modo prova/lockdown: como você ativa?
- O que exatamente o celular mostra do radar (alerta push? só leitura?).
