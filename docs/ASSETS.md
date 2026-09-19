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

## 2. Estrutura de Pastas e Estado Atual dos Arquivos

```text
public/assets/
├── brand/
│   ├── logo.webp (e .png)             # [ATIVO] Logo completo Loopa
│   └── mark.webp (e .png)             # [ATIVO] Símbolo lupa/loop isolado
├── clips/
│   └── paperclip.webp (e .png)        # [ATIVO] Clipe de papel metálico
├── highlights/
│   └── title-underline.webp (e .png)  # [ATIVO] Sublinhado orgânico em tinta
├── tape/
│   └── tape-default.webp (e .png)     # [ATIVO] Fita adesiva / washi tape horizontal
├── notes/
│   ├── note-yellow-taped.webp (e .png)# [ATIVO] Post-it amarelo com fita
│   ├── note-blue-taped.webp (e .png)  # [ATIVO] Post-it azul com fita
│   ├── note-green-taped.webp (e .png) # [ATIVO] Post-it verde com fita
│   └── note-pink-taped.webp (e .png)  # [ATIVO] Post-it rosa com fita
├── paper/
│   └── notebook-sheet.webp (e .png)   # [ATIVO] Folha de caderno pautada com margem
├── doodles/                           # Aguardando círculos, flechas e rabiscos
├── icons/                             # Aguardando ícones de navegação e ações
└── decorations/                       # Aguardando carimbos e selos
```

---

## 3. Catálogo de Tokens e Mapeamento na Interface

| Token CSS | Arquivo Vinculado | Destino no Layout | Status |
|---|---|---|---|
| `--asset-brand-logo` | `/assets/brand/logo.webp` | Logo completo (onboarding, cabeçalhos) | **Ativo** |
| `--asset-brand-mark` | `/assets/brand/mark.webp` | Símbolo Loopa no sidebar e topo mobile | **Ativo** |
| `--asset-tape-default` | `/assets/tape/tape-default.webp` | Topo do card Hero (Início/Economia) e Modais | **Ativo** |
| `--asset-clip-paperclip`| `/assets/clips/paperclip.webp` | Fixador no topo da folha de assinaturas | **Ativo** |
| `--asset-highlight-underline` | `/assets/highlights/title-underline.webp` | Sublinhado abaixo de títulos `h1` | **Ativo** |
| `--asset-note-yellow` | `/assets/notes/note-yellow-taped.webp` | Card de alerta "Atenção" (`.sticky-yellow`) | **Ativo** |
| `--asset-note-blue` | `/assets/notes/note-blue-taped.webp` | Card de alerta "Mudança" (`.sticky-blue`) | **Ativo** |
| `--asset-note-green` | `/assets/notes/note-green-taped.webp` | Card de métrica "Desperdício" (`.sticky-green`) | **Ativo** |
| `--asset-note-pink` | `/assets/notes/note-pink-taped.webp` | Card de cobrança desconhecida (`.sticky-pink`) | **Ativo** |
| `--asset-paper-notebook` | `/assets/paper/notebook-sheet.webp` | Painel de calendário, assinaturas e economia | **Ativo** |
| `--asset-doodle-ring` | *Pendente* | Círculo do contador hero ("3 próximas") | Fallback CSS |
| `--asset-icon-home` | *Pendente* | Aba "Visão geral" / "Início" | Glifo unicode `⌂` |
| `--asset-icon-calendar`| *Pendente* | Aba "Calendário" | Glifo unicode `◫` |
| `--asset-icon-subscriptions` | *Pendente* | Aba "Assinaturas" | Glifo unicode `↻` |
| `--asset-icon-economy` | *Pendente* | Aba "Economia" | Glifo unicode `◇` |

---

## 4. Otimização de Performance Mobile

Todos os assets foram otimizados em formatos **PNG recortado** e **WebP ultraotimizado** (30 KB a 50 KB cada), garantindo carregamento instantâneo em conexões móveis.
