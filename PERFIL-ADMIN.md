# Perfil — Admin

> Parte da documentação de produto da Celeste Academy. Índice em [CLAUDE.md](CLAUDE.md).
> **Decisões travadas em 15/jul/2026.** PT-BR sempre. Free tier sempre.

---

## 1. Quem é

**É você, com o outro chapéu.** `is_master_admin` = o autor. Não existe TI da escola,
não existe outra pessoa. O coordenador **não** acumula admin — quem supervisiona não
deveria poder criar professor nem mexer em corte de nota.

**Área separada, decidido.** Dar aula e governar a instância não se misturam na mesma
tela. Você entra aqui de propósito, sabendo que entrou.

Skin: **Dev**, claro e escuro.

---

## 2. A tese do perfil — o inverso do cockpit

Toda outra tela do projeto é otimizada para **velocidade**. Esta é otimizada
**contra o erro**.

| | Cockpit / fila de correção | Admin |
|---|---|---|
| Frequência de uso | Todo dia, muitas vezes | Uma vez por semestre |
| Custo de errar | Baixo, e você percebe na hora | **Alto, e afeta 100+ alunos de uma vez** |
| Otimizar para | Teclado, atalho, zero fricção | Confirmação, preview, reversibilidade |

**Leis:**

1. **Ação de admin nunca é rápida.** Nada de atalho de teclado, nada de ação em massa
   com um clique. A fricção aqui é a feature.
2. **Toda ação destrutiva mostra o estrago antes.** "Mudar o corte de 70 para 75 vai
   reprovar 14 alunos que hoje passam. Aqui estão eles." Preview do impacto, sempre.
3. **A tela se explica.** Você vai voltar aqui em seis meses sem lembrar de nada. Cada
   configuração diz o que faz e o que quebra — em PT-BR, na tela, não num tooltip.
4. **Nada é anônimo.** Toda mudança de config fica registrada com autor e data — mesmo
   sendo você sozinho. É o que te salva de "por que isso mudou em março?".

---

## 3. O que ele faz

| Área | Funcionalidade | Nota |
|---|---|---|
| **Gente** | Criar professor, criar coordenador | Hierárquico. Sem cadastro aberto, nunca. |
| **Currículo** | Criar curso, módulos, UCs | Alimenta tudo. Ver `SISTEMAS.md`. |
| | **Importar PPC por IA** | O PPC do curso vira currículo. Maior alavanca de tempo do perfil — e a que mais exige preview antes de gravar. |
| **Config institucional** | Corte de nota (70%), corte de frequência (75%), menções (PPS/PPM/PPI) | **A config mais perigosa do sistema.** Lei §2.2 se aplica com força. |
| | Feriados, calendário do curso | Afeta chamada e o diário. |
| **Instância** | Stats, saúde, uso | Você é o dev — isto é observabilidade, não vaidade. |

---

## 4. O que ele **não** faz

- Não dá aula, não corrige, não faz chamada. Para isso você troca de chapéu.
- Não vê o radar. O radar é do instrutor e do coordenador.
- Não é gamificado.
- Não substitui professor (isso é do coordenador — [PERFIL-COORDENADOR.md §4](PERFIL-COORDENADOR.md)).

---

## 5. A troca de chapéu — sessão separada

✅ **Decidido: sessão própria. Você loga de novo pra entrar no admin.**

Parece exagero — é você dos dois lados, então não é segurança contra ninguém. **E é
exatamente esse o ponto.** Não é segurança: é **cerimônia**. Logar de novo é o ritual que
te faz *saber* que trocou de chapéu, e isso é a tese deste perfil inteiro (§2): a fricção
aqui **é** a feature.

Um item de menu deixaria o corte de nota a um clique de distância enquanto você corrige
100 entregas às onze da noite. É assim que se reprova 14 alunos sem querer.

---

## 6. Inventário de funcionalidades

### Tem
| Funcionalidade | Nota |
|---|---|
| **Criar professor, criar coordenador** | Hierárquico. Sem cadastro aberto, nunca. |
| **Currículo**: curso → módulos → UCs | **Multi-curso de verdade** — Jogos e Desenvolvimento de Sistemas, e virão outros. |
| **Importar PPC por IA** | O coração do sistema de currículo. Maior alavanca e maior risco. |
| **Config institucional** | Cortes (70%/75%), menções PPS/PPM/PPI. **A config mais perigosa do sistema.** |
| **Feriados, calendário do curso** | Afeta chamada e diário. |
| **Stats da instância** | Você é o dev — isto é observabilidade, não vaidade. |
| **Sessão separada** | §5 |

### Não tem — por decisão
| | Por quê |
|---|---|
| **Dar aula, corrigir, chamada, radar** | Troca de chapéu. §4 |
| **Curar o banco de exercícios** | Sem curadoria, por decisão — ninguém aprova nada, ninguém vira juiz do trabalho de colega. [SISTEMAS.md §6](SISTEMAS.md) |
| **Coordenador acumulando admin** | Quem supervisiona não cria professor nem mexe em corte de nota. §1 |
| **Gamificação** | Óbvio. |

## 7. Pendências

- Importação do PPC por IA: **o fluxo de revisão antes de gravar** — é currículo inteiro,
  gerado por IA, virando a base de tudo. É a tela que mais importa deste perfil, e a
  Lei §2.2 (mostrar o estrago antes) se aplica com força máxima.
- Config institucional é global ou por curso?
- O que acontece quando o SENAI revisa um PPC e o currículo precisa mudar **com turmas em
  andamento**? O caso difícil, ainda sem resposta.
