# Perfil — Coordenador

> Parte da documentação de produto da Celeste Academy. Índice em [CLAUDE.md](CLAUDE.md).
> Arquitetura em [BLUEPRINT.md](BLUEPRINT.md) · Crítica em [ANALISE-UX.md](ANALISE-UX.md).
> **Decisões travadas em 15/jul/2026.** PT-BR sempre. Free tier sempre.

---

## 1. Quem é

Supervisiona turmas, professores, salas e relatórios. **Não dá aula.** Existe de
verdade e vai usar de verdade — ou seja: **é a primeira pessoa fora do seu controle
que depende do sistema funcionar.** Isso muda o padrão de qualidade (não dá pra
"consertar depois, eu sei o workaround") e cria carga de suporte.

Skin: **Dev**, claro e escuro. **Fora da área gamificada** — sem XP, sem liga, sem céu.

**Vê aluno nominal em tudo** (nome, nota, frequência). Decisão sua, e legítima: ele já
tem controle dos alunos por fora da plataforma, então esconder aqui seria teatro de
privacidade sem ganho real.

---

## 2. As leis do perfil

1. **O radar agrega por turma e por UC. Jamais rankeia professor.**
   Ver §3 — é a lei mais importante deste documento.
2. **Coordenador não corrige, não dá aula, não joga.** Se ele precisa de uma função do
   instrutor, ele vira instrutor daquela turma — não ganha um botão a mais.
3. **Todo acesso de exceção deixa rastro.** Ver §4.

---

## 3. O radar do coordenador — e o risco que ele carrega

É o mesmo radar do instrutor ([PERFIL-INSTRUTOR.md §6.1](PERFIL-INSTRUTOR.md)), um
nível acima: agrega **por turma e por UC** em vez de por aluno. Reaproveita
integralmente o que já será construído — as duas listas (**Prestes a reprovar** e
**Sumindo**) continuam as mesmas, só mudam de granularidade.

### A lei, e por quê

> **O radar nunca agrega por professor. Nunca rankeia professor. Nunca compara professor.**

O [PERFIL-ALUNO.md §1](PERFIL-ALUNO.md) aposta em **adoção parcial e voluntária** dos
colegas — é o que sustenta a decisão de "Hoje" como casa do aluno e a promessa de que
a UC nasce quando um colega entra.

Uma ferramenta que mostra à coordenação "o professor X tem 12 alunos em risco e o
professor Y tem 2" **não é adotada voluntariamente por ninguém, nunca**. Um colega
olha isso uma vez e some — e ele estaria certo. Se o radar por professor existir, a
hipótese de adoção morre, e com ela morre metade do desenho do perfil do aluno.

Turma e UC **têm** dono, então o agregado por turma já dá ao coordenador tudo o que
ele precisa para agir — sem transformar a plataforma num instrumento de vigilância
sobre quem você quer que a adote.

---

## 4. Substituição por falta — o sistema

Nasceu de uma necessidade real sua e virou uma das melhores coisas do produto.

### 4.1 O caso
O professor titular falta (geralmente **de surpresa** — doença, imprevisto). Alguém
cobre a aula, entrando na UC **com minutos de antecedência**, e precisa: entender onde
a turma está, e aplicar a aula planejada **ou** algo próprio.

### 4.2 Quem autoriza
**Coordenador designa** — turma + UC + professor + **prazo** (aula / dia / semana).
O acesso **expira sozinho**; ninguém precisa lembrar de revogar.

**Quebra-vidro:** em emergência (o coordenador também está fora), qualquer professor
do curso entra. Mas:
- fica **registrado**;
- **notifica o titular** e o coordenador, na hora.

Não é acesso secreto. É acesso rápido com rastro — que é o desenho certo para dado de
100+ menores de idade.

### 4.3 O briefing — feito de rastro, não de plano
O substituto cai numa tela que responde, em segundos:

```
Você está cobrindo · Lógica de Programação · 2ª série B
A turma está no bloco 3 de 7 (aulas 05–08, loops e coleções).
Última aula: 05/07, aplicada pelo Prof. André.
6 exercícios entregues · 3 alunos com entrega atrasada.
Pendurado na aula de hoje: material "loops e coleções" +
desafio "colisão em C#", entrega sexta.

[ Aplicar o que está pendurado ]   [ Aplicar outra coisa ]
```

**Nada disso o titular escreveu.** Tudo ali é projeção dos sensores que já existem —
frequência, entregas, o material pendurado na aula. O briefing é **de graça**.

> **Correção registrada (15/jul):** a versão anterior deste doc dizia que o
> **Planejamento de UC** (as 3 etapas SENAI) viraria o briefing. Aquilo dependia do
> titular escrever um plano — e ele **não escreve** (o plano dele mora nos slides). A
> ideia foi refeita: o briefing vem do rastro. Ver [SISTEMAS.md §3](SISTEMAS.md).

Isso é mais barato **e** mais coerente: o mesmo padrão da Papelada Zero (o dado nasce
uma vez no sensor; tudo o mais é projeção) agora vale também para o briefing. Nenhum
documento novo precisa existir para um colega conseguir salvar sua aula.

### 4.4 O que o substituto pode fazer
**Chamada e nota, tudo registrado como dele.** A aula dele é dele.

Consequência de schema, não só de tela: **todo lançamento tem autor**
(`registered_by`) — frequência e nota, não só ocorrência. O **diário oficial mostra
quem aplicou cada aula**. Isso já era o padrão do formato de ocorrências
("data / autor"); agora vale para tudo.

### 4.5 O handoff de volta
**"Aplicar outra coisa" registra o que foi dado.** Isso não é burocracia: é a viagem
de volta. Quando você retorna, precisa saber o que aconteceu com a sua turma na sua
ausência — senão você recomeça no escuro e o aluno paga.

**A substituição é um handoff de ida e volta.** Só metade dela é sobre o substituto.

---

## 5. As outras tarefas

Você pediu todas as quatro. Em ordem de quanto reaproveitam do que já existe:

| # | Tarefa | Reaproveita | Nota |
|---|---|---|---|
| 1 | **Radar por turma/UC** | Tudo do instrutor | Só muda a granularidade. §3. |
| 2 | **Cobrir falta** | Nada — é novo, mas é pequeno | §4. Conecta com tudo. |
| 3 | **Relatórios institucionais** | A Papelada Zero inteira | Ele é o segundo cliente dos mesmos geradores. |
| 4 | **Salas, ocupação, calendário** | Nada | **Na prática, é outro produto.** Ver §6. |

---

## 6. O aviso sobre escopo

Este perfil foi a **maior expansão de escopo da sessão**. "Todas as quatro" tarefas
significa que o coordenador não é um perfil pequeno de leitura — ele tem radar
próprio, um sistema novo (substituição), a Papelada como cliente, e logística de salas.

**Salas/ocupação/calendário é o item que eu tiraria.** Ele não reaproveita nada, não
alimenta o radar, não gera documento oficial e não tem relação com a dor central
("saber quem está afundando"). É um sistema de agendamento morando dentro de uma
plataforma pedagógica. Ele pode existir — mas depois de tudo, e sabendo que é um
produto diferente com uma cara diferente.

Como dev solo com 4+ turmas para dar aula, cada perfil que existe é um sistema inteiro
de telas, RLS e suporte. Este é o único perfil onde a pessoa do outro lado **não é
você** — e por isso é o único que você não pode abandonar pela metade.

---

## 7. Pendências deste perfil

- **Admin**: ficou sem resposta. Presumo `is_master_admin` = você, e "admin" = umas
  telas de configuração dentro do seu perfil, não uma área própria. **Confirmar.**
- Quantos coordenadores existem? Um só, ou um por curso?
- O coordenador pode designar a si mesmo como substituto?
- Prazo padrão do quebra-vidro (a aula? o dia?).
- Relatórios: quais, exatamente? (a lista sai da Papelada Zero, não daqui)
