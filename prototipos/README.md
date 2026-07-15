# Protótipos de design — Celeste Academy

## Atual

- **`celeste-atividade.html`** — ⭐ **a referência viva do design** (aprovada 15/jul/2026).
  A tela de atividade de pseudocódigo nas **4 variantes** (Caderno claro/escuro, Dev
  claro/escuro), com o loop assíncrono inteiro: escrever → entregar → a correção
  voltando como caneta vermelha na página. Auto-contido (Schibsted Grotesk, Caveat e
  JetBrains Mono em base64): basta abrir no navegador.
  Controles: **Aluno/Professor** × **Claro/Escuro** no topo; botão **Entregar** roda o loop.
  Especificado em [DESIGN.md](../DESIGN.md) — em caso de dúvida, **este arquivo manda**.

## Histórico

- `celeste-6-estilos.html` — 9 estilos × 2 visões (aluno/instrutor), o protótipo que
  originou a escolha das skins F (Caderno) e H (Dev). **Superado**: ele prova a pele,
  não o produto — as duas telas dele são dashboards, e as telas que importam não existem
  nele. Ver [ANALISE-UX.md](../ANALISE-UX.md).
  **Ainda útil** como paleta dos estilos **não** escolhidos, que viram itens da loja de
  temas ([BLUEPRINT.md §7](../BLUEPRINT.md)).
  Teclas: 1–6 trocam estilo, V troca a visão, 0 volta ao seletor.
  Versão hospedada: https://claude.ai/code/artifact/9f5a0dbc-e463-4f7c-b03f-39ff09a08155

- `fonts/fonts-all.css` — `@font-face` em base64 (Clash Display, Schibsted Grotesk,
  Archivo Black, Press Start 2P, VT323, Fraunces, IBM Plex Mono, Caveat) para
  reaproveitar em protótipos futuros. **Atenção:** não contém JetBrains Mono — ela existe
  embutida dentro de `celeste-6-estilos.html` (que tem 11 famílias, contra as 8 deste
  arquivo). As três faces do design atual saíram de lá.
