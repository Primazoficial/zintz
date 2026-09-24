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

// Emoji padrão de cada pasta pré-determinada, usado até o usuário escolher
// outro ícone. O quadrado do ícone em si usa sempre a mesma cor (azul-nuvem
// de fundo, azul Zintz no traço) — a identidade visual da Beta não varia essa
// cor por pasta.
const EMOJI_PADRAO_POR_SLUG: Record<string, string> = {
  compras: "🛍️",
  receitas: "🍳",
  lugares: "📍",
  beleza: "💄",
};

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
  const corAcento = "#1D4ED8";
  const corAcentoBg = "#DBEAFE";
  const emojiPadrao = (pasta.slug && EMOJI_PADRAO_POR_SLUG[pasta.slug]) || "📁";

  if (pasta.icon_image_url) {
    return { corAcento, corAcentoBg, tipo: "imagem", emoji: emojiPadrao, imagemUrl: pasta.icon_image_url };
  }
  return {
    corAcento,
    corAcentoBg,
    tipo: "emoji",
    emoji: pasta.icon_emoji ?? emojiPadrao,
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
