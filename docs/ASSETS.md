# Loopa — Sistema de Assets Visuais & Identidade

Este documento define a arquitetura, convenções e o catálogo de assets visuais do projeto Loopa.

---

## 1. Princípios de Arquitetura Visual

Para garantir manutenibilidade e facilidade de troca de identidade, o projeto segue a separação estrita de três camadas:

1. **CONTEÚDO (Dados & Lógica)**
   - Valores monetários (`R$ 187,60`), datas, nomes de serviços, contadores e textos de alerta são **100% dinâmicos**, controlados por HTML e JavaScript (`app.js`).
   - **Nenhum asset gráfico deve conter texto financeiro ou dados dinâmicos fixos.**
2. **ESTRUTURA (Layout & Responsividade)**
   - O arquivo `public/styles.css` controla posicionamento, flexbox/grid, breakpoints e comportamento mobile.
   - Mobile-first: elementos visuais não podem comprometer área útil, velocidade de carregamento ou toque.
3. **IDENTIDADE (Design Tokens & Assets)**
   - Gerenciada através de `public/assets.css` e da pasta `public/assets/`.
   - Utiliza **CSS Custom Properties** como ponte de desacoplamento (`--asset-*`).
   - Permite plugar artes reais ou manter fallbacks desenhados em CSS puro quando o arquivo de imagem não estiver definido.

---

## 2. Estrutura de Pastas

```text
public/assets/
├── brand/         # Logo, símbolo da Loopa, variantes da marca
├── icons/         # Ícones de navegação (início, calendário, assinaturas, economia) e ações (+, ×)
├── paper/         # Texturas de fundo, folhas pautadas, papéis de caderno
├── notes/         # Post-its e retalhos coloridos (amarelo, azul, verde, rosa)
├── tape/          # Fitas adesivas / washi tape (padrão, estreita, angulada)
├── clips/         # Clipes de papel metálicos e fixadores
├── doodles/       # Círculos de destaque, flechas, rabiscos de canto, carimbos
├── highlights/    # Sublinhados manuais, traços de marca-texto
└── decorations/   # Elementos decorativos complementares
```

---

## 3. Catálogo de Tokens e Mapeamento na Interface

| Token CSS | Destino no Layout | Fallback CSS Ativo |
|---|---|---|
| `--asset-brand-mark` | Símbolo Loopa no sidebar e topo mobile | Desenho vetorial CSS da lupa/loop |
| `--asset-brand-scribble` | Rabisco abaixo da marca no topo mobile | Traço curvo em CSS |
| `--asset-highlight-underline` | Sublinhado abaixo de títulos `h1` | Curva sublinhada com borda orgânica |
| `--asset-tape-default` | Topo do card Hero (Início e Economia) e Modais | Fita bege semitransparente em CSS |
| `--asset-tape-small` | Topo dos cards de alerta e nota da sidebar | Fita adesiva reduzida em CSS |
| `--asset-clip-paperclip` | Fixador no topo da folha de assinaturas | Clipe metálico com bordas arredondadas |
| `--asset-note-yellow` | Card de alerta "Atenção" / Calendário resumo | Post-it amarelo pastel em CSS |
| `--asset-note-blue` | Card de alerta "Mudança" / Nota da sidebar | Post-it azul pastel em CSS |
| `--asset-note-green` | Card de desperdício na grade de métricas | Post-it verde pastel em CSS |
| `--asset-note-pink` | Card de cobrança desconhecida | Post-it rosa pastel em CSS |
| `--asset-note-scrap` | Retalhos de papel da grade de 4 métricas | Retalho off-white em CSS |
| `--asset-paper-notebook` | Folha pautada de fundo (calendário, listas) | Gradientes repetitivos com margem vermelha |
| `--asset-doodle-ring` | Círculo do contador hero ("3 próximas") | Anéis duplos desenhados com CSS |
| `--asset-icon-home` | Aba "Visão geral" / "Início" | Glifo unicode `⌂` |
| `--asset-icon-calendar` | Aba "Calendário" | Glifo unicode `◫` |
| `--asset-icon-subscriptions` | Aba "Assinaturas" | Glifo unicode `↻` |
| `--asset-icon-economy` | Aba "Economia" | Glifo unicode `◇` |
| `--asset-icon-alert` | Ícone de alerta / atenção | Ícone circular com `!` |
| `--asset-icon-trend-up` | Ícone de aumento de preço | Ícone circular com `↑` |

---

## 4. Como Integrar uma Nova Arte

Quando um novo asset estiver pronto (ex.: uma fita adesiva `fita-hero.webp` salva em `public/assets/tape/`):

1. Salve o arquivo na subpasta apropriada em `public/assets/`.
2. Em `public/assets.css`, atualize a variável correspondente:
   ```css
   :root {
     --asset-tape-default: url("/assets/tape/fita-hero.webp");
     --fallback-tape-bg: transparent;
     --fallback-tape-border: none;
     --fallback-tape-shadow: none;
   }
   ```
3. A interface adotará a arte imediatamente, preservando alinhamentos, responsividade e textos sem necessidade de refatorar o HTML.

---

## 5. Diretrizes de Estilo & Consistência

Todas as artes geradas devem obedecer ao mesmo universo estético:
- **Técnica:** Desenho manual, tinta preta/grafite com imperfeições sutis.
- **Paleta:** Tons pastel amigáveis (amarelo manteiga, verde menta suave, azul céu lavado, rosa claro), papel off-white (`#f4efe4`).
- **Linguagem:** Caderno pessoal de anotações + clareza de produto financeiro. Amigável e adulto, sem infantilização excessiva.
- **Otimização:** Formatos SVG (para linhas, vetores e ícones) e WebP/PNG com transparência (para texturas e fitas), sempre visando peso reduzido para carregamento ultrarrápido em redes móveis.
