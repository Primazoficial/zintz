export type Pasta = {
  id: string;
  user_id: string;
  name: string;
  slug: string | null;
  is_default: boolean;
  icon_emoji: string | null;
  icon_image_url: string | null;
  created_at: string;
};

export type PastaComContagem = Pasta & { itens: number };

export type FolderCategoria = {
  id: string;
  folder_id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export const LIMITE_PASTAS = 10;

// Emojis oferecidos no seletor de ícone — cobre os casos mais comuns sem virar
// um seletor de emoji completo.
export const EMOJIS_PADRAO = [
  "🛍️", "🛒", "🍳", "🍰", "📍", "✈️", "💄", "💅", "📦", "🎁",
  "📚", "🎬", "🎵", "🏠", "🐾", "💪", "🧴", "👗", "💻", "🎮",
  "🌿", "⭐", "❤️", "📁",
];

// Paleta usada pra cor de fundo do ícone das pastas. As 4 pastas padrão têm
// cor fixa pelo slug; pastas criadas pelo usuário recebem uma cor da paleta
// por ordem de criação, pra cada uma ter uma identidade visual sem precisar
// perguntar.
const CORES_PADRAO: Record<string, { corAcento: string; corAcentoBg: string; icone: string }> = {
  compras: { corAcento: "#2F6FED", corAcentoBg: "#EAF1FE", icone: "🛍️" },
  receitas: { corAcento: "#D89A2B", corAcentoBg: "#FBF1DF", icone: "🍳" },
  lugares: { corAcento: "#2E9E6B", corAcentoBg: "#E5F5EE", icone: "📍" },
  beleza: { corAcento: "#D94F4F", corAcentoBg: "#FBE8E8", icone: "💄" },
};

const PALETA_ROTATIVA = [
  { corAcento: "#7C5FE0", corAcentoBg: "#EFEAFC", icone: "📁" },
  { corAcento: "#1FA2B8", corAcentoBg: "#E3F5F8", icone: "📁" },
  { corAcento: "#C2588A", corAcentoBg: "#FAEAF1", icone: "📁" },
  { corAcento: "#6B8E23", corAcentoBg: "#EFF5E3", icone: "📁" },
  { corAcento: "#B8722E", corAcentoBg: "#FBEEE2", icone: "📁" },
  { corAcento: "#4A6FA5", corAcentoBg: "#E7EFF8", icone: "📁" },
];

export type AparenciaPasta = {
  corAcento: string;
  corAcentoBg: string;
  tipo: "imagem" | "emoji";
  emoji: string;
  imagemUrl: string | null;
};

export function aparenciaDaPasta(
  pasta: Pick<Pasta, "slug" | "id" | "icon_emoji" | "icon_image_url">
): AparenciaPasta {
  let padrao = pasta.slug ? CORES_PADRAO[pasta.slug] : undefined;
  if (!padrao) {
    let hash = 0;
    for (let i = 0; i < pasta.id.length; i++) hash = (hash * 31 + pasta.id.charCodeAt(i)) >>> 0;
    padrao = PALETA_ROTATIVA[hash % PALETA_ROTATIVA.length];
  }

  const { corAcento, corAcentoBg, icone } = padrao;

  if (pasta.icon_image_url) {
    return { corAcento, corAcentoBg, tipo: "imagem", emoji: icone, imagemUrl: pasta.icon_image_url };
  }
  return {
    corAcento,
    corAcentoBg,
    tipo: "emoji",
    emoji: pasta.icon_emoji ?? icone,
    imagemUrl: null,
  };
}

export type DetalhesCompras = {
  product_name?: string;
  subcategory?: string;
  likely_store?: string;
  product_url?: string;
};

export type DetalhesReceitas = {
  recipe_name?: string;
  ingredients?: string[];
  prep_time?: string;
  mentioned_products?: string[];
};

export type DetalhesLugares = {
  place_name?: string;
  place_type?: string;
  location?: string;
  mentioned_activity?: string;
};

export type DetalhesBeleza = {
  product_name?: string;
  subcategory?: string;
  likely_store?: string;
  routine_step?: string;
};

export type Detalhes = DetalhesCompras | DetalhesReceitas | DetalhesLugares | DetalhesBeleza;

export type SavedItem = {
  id: string;
  user_id: string;
  folder_id: string;
  categoria_id: string | null;
  source_url: string;
  source_platform: string | null;
  title: string | null;
  description: string | null;
  image_url: string | null;
  subcategory: string | null;
  details: Detalhes | null;
  is_purchase: boolean;
  original_url: string | null;
  affiliate_url: string | null;
  partner_id: string | null;
  created_at: string;
};

// Um item é "de compras" quando a IA identificou que o post é sobre um
// produto à venda — sinalizador salvo no item, independe da pasta em que ele
// foi guardado (mesmo se o usuário salvar em "Receitas", por exemplo) e
// independe de já termos um link de afiliado resolvido pra ele ou não.
export function ehItemDeCompra(item: SavedItem): boolean {
  return item.is_purchase;
}

export function linkDoItem(item: SavedItem): string {
  if (ehItemDeCompra(item)) return item.affiliate_url ?? item.original_url ?? item.source_url;
  return item.source_url;
}

const NOMES_PLATAFORMA: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  pinterest: "Pinterest",
};

export function nomeDaPlataforma(sourcePlatform: string | null): string {
  if (!sourcePlatform) return "Rede social não identificada";
  return NOMES_PLATAFORMA[sourcePlatform] ?? sourcePlatform;
}
