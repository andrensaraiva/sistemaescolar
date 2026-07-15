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

## 5. Pendências

- Como você troca de chapéu? (menu? URL separada? sessão distinta?) — precisa ser
  explícito o bastante para você **saber** que está no admin.
- Importação do PPC por IA: o fluxo de revisão antes de gravar (é currículo inteiro,
  gerado por IA, e vira a base de tudo).
- Config institucional é global ou por curso?
