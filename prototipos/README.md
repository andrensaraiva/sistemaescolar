# Protótipos de design — Celeste Academy

## Atual — ⭐ a referência viva do design (aprovados 15/jul/2026)

Auto-contidos (Schibsted Grotesk, Caveat e JetBrains Mono em base64): basta abrir no
navegador. Especificados em [DESIGN.md](../DESIGN.md) — em caso de dúvida, **estes
arquivos mandam**.

- **`celeste-atividade.html`** — a tela de atividade de pseudocódigo nas **4 variantes**
  (Caderno claro/escuro, Dev claro/escuro), com o loop assíncrono inteiro: escrever →
  entregar → a correção voltando como caneta vermelha na página.
  Controles: **Aluno/Professor** × **Claro/Escuro** no topo; **Entregar** roda o loop.
  Prova a regra da pauta (o `line-height` do editor é o passo da régua).

- **`celeste-fila-correcao.html`** — a fila do instrutor, Dev claro/escuro.
  **O teclado funciona de verdade: J, K e Enter.** Prova que a skin Dev tem
  personalidade sem chrome. As três entregas são argumentos: a Yanka (a IA não sabe
  opinar porque ela foi melhor que o gabarito), o Renato (evidência de cola, nunca
  veredito) e o Adryan (entrega pela metade, cruzando com o radar).

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
