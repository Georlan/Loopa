# Loopa

Radar de gastos recorrentes: descubra, organize e antecipe assinaturas antes da próxima cobrança.

Esta é a primeira versão funcional e visual da Loopa. Ela foi construída como uma aplicação estática, sem login e sem backend, para permitir validação rápida em produção antes de aumentar a complexidade.

## O que já funciona

- onboarding curto inspirado em apps de consumo;
- dashboard com próximas cobranças e totais;
- projeção mensal e anual;
- calendário com peso financeiro por dia;
- lista de assinaturas;
- cadastro manual;
- armazenamento local no navegador;
- importação de CSV processada no próprio navegador;
- reconhecimento básico de serviços conhecidos no CSV;
- alertas demonstrativos de teste grátis, aumento de preço e cobrança desconhecida;
- oportunidades de economia;
- layout responsivo para desktop e celular;
- manifest básico para instalação como app.

Os valores e serviços iniciais são **dados de demonstração**, não uma tabela oficial de preços.

## Estrutura

```text
.
├── docs/
│   ├── ASSETS.md
│   └── PRODUCT.md
├── examples/
│   └── fatura-demo.csv
├── public/
│   ├── assets/
│   │   ├── brand/
│   │   ├── clips/
│   │   ├── decorations/
│   │   ├── doodles/
│   │   ├── highlights/
│   │   ├── icons/
│   │   ├── notes/
│   │   ├── paper/
│   │   └── tape/
│   ├── _headers
│   ├── _redirects
│   ├── app.js
│   ├── assets.css
│   ├── favicon.svg
│   ├── index.html
│   ├── manifest.webmanifest
│   └── styles.css
├── .gitignore
├── README.md
└── wrangler.toml
```

## Testar localmente

Como não há etapa de build, qualquer servidor estático funciona:

```bash
python -m http.server 8788 --directory public
```

Depois abra `http://localhost:8788`.

Para testar a importação, use `examples/fatura-demo.csv`.

## Publicar no Cloudflare Pages

### Git integration

1. Abra **Workers & Pages → Create → Pages → Connect to Git**.
2. Selecione o repositório `Georlan/Loopa`.
3. Framework preset: **None**.
4. Build command: deixe vazio.
5. Build output directory: **public**.
6. Salve e faça o primeiro deploy.

Não há variáveis de ambiente nesta versão.

### Wrangler

Com Wrangler autenticado:

```bash
npx wrangler pages deploy public --project-name loopa
```

## Privacidade deste MVP

Não existe backend. Assinaturas criadas manualmente e dados importados são mantidos no `localStorage` do navegador. O CSV é lido no cliente e não é enviado para nenhum servidor pela aplicação atual.

Isso também significa que limpar os dados do navegador ou trocar de dispositivo remove o estado local.

## Próximas etapas sugeridas

1. validar a experiência real no Cloudflare;
2. ajustar identidade visual e logo Loopa;
3. substituir alertas demonstrativos por insights derivados dos dados;
4. melhorar o parser/importação de faturas;
5. adicionar PDF;
6. projetar conexão segura com e-mail;
7. somente depois introduzir conta, backend e sincronização.

A identidade visual explora o conceito **loop + lupa**: recorrência e descoberta.
