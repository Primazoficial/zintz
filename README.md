# Zitz

App que organiza conteúdo salvo de redes sociais (TikTok, Instagram, Pinterest) em quatro
categorias: Compras, Receitas, Lugares para Visitar e Beleza. Ver `docs/instrucoes-zitz.md` para a
especificação completa.

## Stack

- Next.js 16 (App Router) + Tailwind v4
- Supabase (Postgres + Auth) — projeto `zitz` (`olcmukadkfhslbmxynjy`, org Primazoficial)
- Anthropic API (Claude) para classificar e extrair dados dos links salvos

## Setup

```bash
npm install
cp .env.local.example .env.local   # já preenchido com a URL/anon key do Supabase; falta a ANTHROPIC_API_KEY
npm run dev
```

Gere uma chave em [console.anthropic.com](https://console.anthropic.com) e cole em
`ANTHROPIC_API_KEY` no `.env.local` — sem ela, o endpoint `POST /api/items` (classificação e
extração via IA) retorna erro 502.

## Banco de dados

Schema já aplicado no projeto Supabase `zitz` (tabelas `categories`, `partners`, `saved_items`,
`lists`, `list_items` — ver seção 7 da spec). As 4 categorias iniciais já estão populadas. A tabela
`partners` está vazia — sem parceiros cadastrados, os itens salvos ficam sem link de afiliado
(usam o link original). Para gerar links de afiliado, insira linhas em `partners` com
`affiliate_link_template` contendo `{url}` como placeholder da URL original, ex:
`https://shopee.com.br/redirect?url={url}&afid=zitz`.

## Estrutura

- `app/[compras|receitas|lugares|beleza]` — vitrine de cada categoria (`app/lib/pagina-categoria.tsx`)
- `app/novo` — formulário de "colar link" (MVP sem share extension nativo, ver seção 13 da spec)
- `app/listas` — listas personalizadas por categoria, com opção de tornar pública e compartilhar
- `app/api/items` — recebe o link, chama a IA para classificar/extrair, faz o matching de afiliado
- `app/lib/extracao.ts` — prompt e chamada à API do Claude
- `app/lib/afiliados.ts` — matching de parceiro e geração do link de afiliado

## Limitações conhecidas do MVP

- Não há scraping automático de legenda/thumbnail do TikTok/Instagram/Pinterest — o usuário cola a
  legenda manualmente no formulário (a IA extrai bem melhor com ela).
- Login é e-mail/senha (a spec sugere login social Google/Apple como melhoria futura).
- Share extension nativo (iOS/Android) fica para depois — ver seção 8 da spec.
