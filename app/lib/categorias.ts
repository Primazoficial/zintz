export type CategoriaSlug = "compras" | "receitas" | "lugares" | "beleza";

export type Categoria = {
  slug: CategoriaSlug;
  nome: string;
  nomePlural: string;
  corAcento: string;
  corAcentoBg: string;
};

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  compras: {
    slug: "compras",
    nome: "Compras",
    nomePlural: "Compras",
    corAcento: "#2F6FED",
    corAcentoBg: "#EAF1FE",
  },
  receitas: {
    slug: "receitas",
    nome: "Receitas",
    nomePlural: "Minhas Receitas",
    corAcento: "#D89A2B",
    corAcentoBg: "#FBF1DF",
  },
  lugares: {
    slug: "lugares",
    nome: "Lugares",
    nomePlural: "Meus Lugares para Visitar",
    corAcento: "#2E9E6B",
    corAcentoBg: "#E5F5EE",
  },
  beleza: {
    slug: "beleza",
    nome: "Beleza",
    nomePlural: "Beleza",
    corAcento: "#D94F4F",
    corAcentoBg: "#FBE8E8",
  },
};

export const ORDEM_CATEGORIAS: CategoriaSlug[] = ["compras", "receitas", "lugares", "beleza"];

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
  category_id: string;
  source_url: string;
  source_platform: string | null;
  title: string | null;
  image_url: string | null;
  subcategory: string | null;
  details: Detalhes | null;
  original_url: string | null;
  affiliate_url: string | null;
  partner_id: string | null;
  created_at: string;
};

export type Lista = {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  is_public: boolean;
  created_at: string;
};
