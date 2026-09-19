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

## 2. Tipografia do Sistema

Para manter harmonia e seriedade sem perder o calor artesanal, o sistema utiliza rigorosamente duas famílias tipográficas:
- **Principal (UI & Dados):** `DM Sans` (Google Fonts) — títulos, números financeiros, botões, textos corridos, listas e nomes de serviços.
- **Manuscrita (Anotações & Microtextos):** `Kalam` (Google Fonts) — pequenos labels, datas, eyebrows, anotações de rodapé, dicas e contadores de caderno.

---

## 3. Catálogo de Tokens e Mapeamento na Interface

| Token CSS | Arquivo Vinculado | Destino no Layout | Status |
|---|---|---|---|
| `--asset-brand-logo` | `/assets/brand/logo.webp` | Logo completo na sidebar desktop | **Ativo** |
| `--asset-brand-mark` | `/assets/brand/mark.webp` | Símbolo Loopa no topo mobile | **Ativo** |
| `--asset-tape-default` | `/assets/tape/tape-default.webp` | Topo do card Hero (Início) e Modais | **Ativo** |
| `--asset-clip-paperclip`| `/assets/clips/paperclip.webp` | Fixador no topo da folha de assinaturas | **Ativo** |
| `--asset-highlight-underline` | `/assets/highlights/title-underline.webp` | Sublinhado orgânico abaixo de títulos `h1` | **Ativo** |
| `--asset-note-yellow` | `/assets/notes/note-yellow-taped.webp` | Card de alerta "Atenção" (`.sticky-yellow`) | **Ativo** |
| `--asset-note-blue` | `/assets/notes/note-blue-taped.webp` | Card de alerta "Mudança" (`.sticky-blue`) | **Ativo** |
| `--asset-note-green` | `/assets/notes/note-green-taped.webp` | Card de métrica "Desperdício" (`.sticky-green`) | **Ativo** |
| `--asset-note-pink` | `/assets/notes/note-pink-taped.webp` | Card de cobrança desconhecida (`.sticky-pink`) | **Ativo** |
| `--asset-banner-green` | `/assets/notes/banner-green-taped.webp` | Card Hero de Economia anual (`.economy-hero`) | **Ativo** |
| `--asset-banner-yellow` | `/assets/notes/banner-yellow.webp` | Resumo de 7 dias e recorrências no Calendário | **Ativo** |
| `--asset-paper-blank` | `/assets/paper/paper-sheet-blank.webp` | Folha sem pauta do painel de Calendário | **Ativo** |
| `--asset-paper-folded` | `/assets/paper/notebook-sheet-folded.webp`| Folha pautada com margem para Assinaturas | **Ativo** |
| `--asset-paper-notebook` | `/assets/paper/notebook-sheet.webp` | Painel de oportunidades na tela de Economia | **Ativo** |
| `--asset-counter-ring` | `/assets/doodles/counter-ring.webp` | Círculo artesanal do contador ("3 próximas") | **Ativo** |
| `--asset-nav-home` | `/assets/icons/nav-home.webp` | Ícone de navegação Início / Visão geral | **Ativo** |
| `--asset-nav-calendar` | `/assets/icons/nav-calendar.webp` | Ícone de navegação Calendário | **Ativo** |
| `--asset-nav-subscriptions` | `/assets/icons/nav-subscriptions.webp` | Ícone de navegação Assinaturas | **Ativo** |
| `--asset-nav-economy` | `/assets/icons/nav-economy.webp` | Ícone de navegação Economia | **Ativo** |
| `--asset-action-plus` | `/assets/icons/action-plus.webp` | Ícone do botão flutuante de adicionar (+) | **Ativo** |

---

## 4. Otimização de Performance Mobile

Todos os assets foram recortados, normalizados opticamente em caixas delimitadoras limpas (sem margens transparentes vazias) e convertidos em formatos **PNG** e **WebP** leves (10 KB a 60 KB cada), garantindo carregamento instantâneo em conexões móveis.
