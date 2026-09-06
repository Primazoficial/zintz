# Instruções para Claude Code — Zintz (nome provisório)

> App que organiza conteúdo salvo de redes sociais (TikTok, Instagram, Pinterest) em quatro categorias: Compras, Receitas, Lugares para Visitar e Beleza. Modelo de referência: ReciMe, generalizado para múltiplos nichos com arquitetura de "categorias plugáveis".

## 1. Visão geral

O usuário compartilha um post/vídeo de rede social pro app. O app identifica automaticamente a que categoria aquele conteúdo pertence (produto, receita, lugar ou rotina de beleza), extrai os dados relevantes via IA e organiza numa vitrine própria por categoria — com o link convertido em afiliado sempre que houver parceiro cadastrado.

## 2. Público-alvo

Usuários de TikTok/Instagram no Brasil que salvam conteúdo de diferentes nichos (achadinhos, receitas, roteiros de viagem, rotinas de beleza) mas perdem o link ou esquecem de agir depois.

## 3. Categorias do MVP

| Categoria | O que salva | Monetização principal |
|---|---|---|
| **Compras** | Produtos vistos em vídeos (achadinhos) | Afiliado direto (Shopee, Amazon, Mercado Livre, TikTok Shop) |
| **Minhas Receitas** | Receitas de culinária de posts/vídeos | Afiliado de utensílios/ingredientes, parceria com apps de entrega (lista de compras → pedido), conteúdo patrocinado de marcas de alimento |
| **Meus Lugares para Visitar** | Destinos, restaurantes, roteiros | Afiliado de reserva (Booking, Decolar, Trivago), passeios (GetYourGuide, Civitatis), restaurante (TheFork) |
| **Beleza** | Produtos e rotinas de skincare/maquiagem | Afiliado de produto (Sephora, Beleza na Web) |

**Monetização transversal (todas as categorias):** assinatura única do Zintz que desbloqueia recursos avançados nas quatro frentes ao mesmo tempo (lista de compras da receita, roteiro organizado, alertas de preço, rotina estruturada). Introduzir depois que o padrão de uso mostrar retorno em mais de uma categoria — não no lançamento.

## 4. Funcionalidades do MVP

1. **Compartilhamento de vídeo → app**: usuário compartilha um link/vídeo pro app (via share sheet nativo do celular, ou colar link manualmente na v0 web)
2. **Classificação automática de categoria**: a IA identifica se o conteúdo é Compras, Receita, Lugar ou Beleza antes de extrair os dados específicos
3. **Extração de dados específica por categoria** (ver seção 7)
4. **Matching com programa de afiliado**: se a loja/plataforma identificada tem parceiro cadastrado, o link é substituído
5. **Vitrine por categoria**: cada categoria tem sua própria tela de listagem, adaptada ao tipo de conteúdo (ver seção 6)
6. **Busca e filtro** dentro de cada categoria
7. **Compartilhar lista** (ex: lista de presentes, roteiro de viagem) com outras pessoas

### Fora do escopo do MVP (fases futuras)
- Comparação de preço entre lojas
- Alertas de queda de preço
- Dashboard de tendências (B2B)
- Assinatura paga / paywall
- Categorias adicionais (Fitness, Moda, Livros, etc. — mesma arquitetura, adicionar depois de validar as quatro primeiras)

## 5. Stack tecnológico sugerido

Mesma base usada no Primaz:
- **Frontend**: Next.js (React), deploy via Vercel
- **Backend/banco**: Supabase (auth, banco Postgres, storage)
- **IA para extração de dados**: API Anthropic (Claude) para interpretar legenda/transcrição do vídeo e extrair os dados estruturados por categoria
- **Autenticação**: Supabase Auth (login social simplifica onboarding — Google/Apple)

## 6. Vitrine do usuário (padrão de UI)

Estrutura inspirada no Mercado Livre — já familiar ao usuário brasileiro — mas adaptada: aqui não é uma loja pra descobrir produto novo, é a coleção pessoal do usuário pra reencontrar o que já salvou.

**Navegação principal:** abas ou bottom navigation por categoria (Compras / Receitas / Lugares / Beleza), cada uma abrindo sua própria vitrine.

**Elementos de cada vitrine:**
- **Busca no topo** — filtra apenas dentro dos itens já salvos naquela categoria
- **Chips de subcategoria** (rolagem horizontal) — gerados automaticamente pela IA (ex: em Compras: Casa, Eletrônicos; em Lugares: Praia, Restaurante, Trilha)
- **Ordenação** — padrão "recentes", com opção por subcategoria ou por origem/loja
- **Grid ou lista de cards** — adaptado ao tipo de conteúdo:
  - Compras/Beleza: grid 2 colunas, imagem + nome + badge da loja
  - Receitas: card com imagem, nome do prato, tempo de preparo (se extraído)
  - Lugares: card com imagem, nome do local, cidade/região
- **Toque no card** → abre o link de afiliado (ou original, se não houver match)

**Diferença importante em relação ao padrão de marketplace tradicional:** sem "patrocinados" competindo por espaço dentro da coleção do próprio usuário — preserva a confiança que sustenta o modelo de afiliado.

## 7. Modelo de dados (schema inicial no Supabase)

Arquitetura de "categorias plugáveis": uma tabela genérica de itens salvos (`saved_items`) com um campo de dados específicos em JSON (`details`), mais tabelas de parceiros por tipo de categoria.

```sql
-- categorias do app
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,    -- 'compras', 'receitas', 'lugares', 'beleza'
  name text not null,
  created_at timestamptz default now()
);

-- parceiros/lojas com programa de afiliado, por categoria
create table partners (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) not null,
  name text not null,                -- ex: "Shopee", "Booking.com", "Sephora"
  domain text,
  affiliate_link_template text,
  partner_type text,                 -- 'loja', 'reserva_hotel', 'passeio', 'restaurante', 'delivery'
  created_at timestamptz default now()
);

-- itens salvos pelo usuário (genérico entre categorias)
create table saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  category_id uuid references categories(id) not null,
  source_url text not null,         -- link original do vídeo/post
  source_platform text,             -- 'tiktok', 'instagram', 'pinterest'
  title text,                       -- nome do produto/receita/lugar
  image_url text,
  subcategory text,                 -- ex: 'casa', 'praia', 'skincare'
  details jsonb,                    -- campos específicos da categoria (ver seção 8)
  original_url text,                -- link extraído do conteúdo original
  affiliate_url text,               -- link convertido, se houver match
  partner_id uuid references partners(id),
  created_at timestamptz default now()
);

-- listas do usuário (para organizar por tema/ocasião, dentro de uma categoria)
create table lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  category_id uuid references categories(id) not null,
  name text not null,
  created_at timestamptz default now()
);

create table list_items (
  list_id uuid references lists(id),
  item_id uuid references saved_items(id),
  primary key (list_id, item_id)
);
```

## 8. Extração via IA — por categoria

### 8.1 Classificação inicial (roda sempre, primeiro passo)

```
Você recebe a legenda e/ou transcrição de um vídeo de rede social.
Classifique em uma destas categorias: "compras", "receitas", "lugares", "beleza".

Responda apenas com o JSON: { "category": "..." }
```

### 8.2 Compras

```
Extraia em JSON:
- product_name: nome do produto mencionado
- subcategory: categoria do produto (ex: casa, eletrônicos, moda)
- likely_store: loja mais provável de venda (ex: Shopee, Amazon, Mercado Livre)
- product_url: URL do produto, se mencionada explicitamente no texto
```

### 8.3 Receitas

```
Extraia em JSON:
- recipe_name: nome do prato
- ingredients: lista de ingredientes mencionados
- prep_time: tempo de preparo, se mencionado
- mentioned_products: produtos/utensílios específicos citados (ex: "air fryer", marca de tempero)
```

### 8.4 Lugares

```
Extraia em JSON:
- place_name: nome do lugar/destino
- place_type: tipo (praia, restaurante, trilha, cidade, hotel, atração)
- location: cidade/região, se mencionada
- mentioned_activity: atividade associada (ex: mergulho, trilha, jantar)
```

### 8.5 Beleza

```
Extraia em JSON:
- product_name: nome do produto de beleza/skincare mencionado
- subcategory: tipo (skincare, maquiagem, cabelo)
- likely_store: loja mais provável (ex: Sephora, Beleza na Web)
- routine_step: em que etapa da rotina se encaixa, se mencionado (ex: limpeza, hidratação)
```

## 9. Fluxo técnico principal

```
Usuário compartilha link do TikTok/Instagram/Pinterest
        ↓
App recebe a URL via share extension / deep link (ou colado manualmente na v0)
        ↓
Backend busca metadados do post (legenda, thumbnail, transcrição se necessário)
        ↓
Claude (API) classifica a categoria (seção 8.1)
        ↓
Claude (API) extrai os dados específicos da categoria (seção 8.2 a 8.5)
        ↓
Sistema verifica se o parceiro identificado está cadastrado em `partners`
        ↓
   Se sim → gera affiliate_url a partir do template
   Se não → salva original_url sem conversão
        ↓
Item aparece na vitrine da categoria correspondente
```

## 10. Monetização (para configurar desde o início)

- Cadastrar-se nos programas de afiliados antes do lançamento:
  - Compras/Beleza: Shopee, Amazon Associados, Mercado Livre, TikTok Shop, Sephora, Beleza na Web
  - Lugares: Booking.com, Decolar, Trivago, GetYourGuide, Civitatis, TheFork
  - Receitas: programas de afiliado de e-commerce de utensílios (Amazon), parceria com apps de entrega (Rappi, iFood) a negociar depois de validar tração
- Guardar os IDs/templates de afiliado na tabela `partners`
- Adicionar aviso de transparência no app (ex: "este app pode usar links de afiliado") — exigido pelos termos da maioria dos programas
- Assinatura única (fase futura) desbloqueando recursos avançados nas quatro categorias

## 11. Paleta de cores (compartilhada entre os apps)

Base visual pensada pra ficar consistente com o Primaz, com leitura clean e clara — reaproveitável em qualquer app novo, ajustando só o acento por app.

```css
:root {
  /* fundo e superfícies */
  --bg-page: #FAFAF9;        /* fundo geral, off-white suave */
  --bg-surface: #FFFFFF;     /* cards, containers */
  --bg-surface-alt: #F2F1EE; /* superfícies secundárias, chips não-selecionados */

  /* texto */
  --text-primary: #1C1C1A;   /* texto principal, quase preto */
  --text-secondary: #6B6A65; /* texto de apoio */
  --text-muted: #A3A199;     /* placeholders, hints */

  /* bordas */
  --border: #E5E3DD;

  /* acento (cor de marca — mesma família em todos os apps) */
  --accent: #2F6FED;         /* azul, ação primária, links, itens selecionados */
  --accent-bg: #EAF1FE;      /* fundo suave do acento (chips ativos, badges) */
  --accent-text: #1C4FB8;    /* texto sobre --accent-bg */

  /* apoio semântico */
  --success: #2E9E6B;
  --warning: #D89A2B;
  --danger: #D94F4F;
}
```

**Como aplicar no Zintz:** `--accent` pode ser trocado por app (mantendo azul no Primaz, por exemplo) sem alterar o resto da paleta. Dentro do próprio Zintz, cada categoria pode ter um tom de destaque sutil dentro da mesma família (ex: chip ativo de "Lugares" um pouco diferente do de "Compras"), mas a base neutra é sempre a mesma.

## 12. Ordem de implementação sugerida para o Claude Code

1. Setup do projeto Next.js + conexão com Supabase (reaproveitar padrão do Primaz)
2. Criar schema do banco (seção 7) e popular a tabela `categories` com as quatro categorias iniciais
3. Tela de login (Supabase Auth)
4. Endpoint que recebe URL compartilhada, classifica a categoria e extrai os dados específicos via API do Claude
5. Lógica de matching com tabela `partners` e geração de `affiliate_url`
6. Navegação por categoria (abas/bottom nav) + vitrine adaptada a cada tipo de card
7. Criação/organização de listas personalizadas dentro de cada categoria
8. Share extension / deep link (parte mais delicada — começar com formulário manual de "colar link" no MVP antes do share nativo)

## 13. Observação sobre o MVP mais simples possível

Antes de implementar o share extension nativo (que exige configuração específica por plataforma iOS/Android), a versão mais rápida de validar é: usuário cola o link manualmente num campo de texto do app web. Isso permite testar a classificação, extração e matching de afiliados nas quatro categorias sem a complexidade de integração nativa com o sistema operacional.

Recomendação de validação: lançar com Compras + uma segunda categoria (Receitas ou Beleza) primeiro, medir se o usuário realmente volta a usar mais de uma categoria, e só então liberar as quatro de uma vez — isso confirma se a arquitetura de "categorias plugáveis" realmente aumenta retenção antes de investir na extração de todas.
