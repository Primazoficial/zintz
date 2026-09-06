import Anthropic from "@anthropic-ai/sdk";
import type { CategoriaSlug, Detalhes } from "./categorias";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type ResultadoExtracao = {
  category: CategoriaSlug;
  title: string | null;
  subcategory: string | null;
  likely_store: string | null;
  product_url: string | null;
  details: Detalhes;
};

const PROMPT_SISTEMA = `Você recebe a legenda e/ou transcrição de um vídeo de rede social (TikTok, Instagram ou Pinterest) que um usuário salvou no app Zintz.

Primeiro classifique o conteúdo em uma destas categorias: "compras", "receitas", "lugares" ou "beleza".

Depois extraia os dados específicos da categoria escolhida:

- compras: product_name, subcategory (ex: casa, eletrônicos, moda), likely_store (loja mais provável de venda, ex: Shopee, Amazon, Mercado Livre), product_url (se mencionada explicitamente no texto)
- receitas: recipe_name, ingredients (lista), prep_time (se mencionado), mentioned_products (utensílios/marcas citados, lista)
- lugares: place_name, place_type (praia, restaurante, trilha, cidade, hotel, atração), location (cidade/região), mentioned_activity
- beleza: product_name, subcategory (skincare, maquiagem, cabelo), likely_store (ex: Sephora, Beleza na Web), routine_step (ex: limpeza, hidratação)

Responda APENAS com um JSON no formato:
{
  "category": "compras" | "receitas" | "lugares" | "beleza",
  "title": string,               // nome curto e legível do item (produto, prato, lugar ou rotina)
  "subcategory": string | null,  // subcategoria do produto/lugar, quando fizer sentido para a categoria
  "likely_store": string | null, // loja mais provável, quando aplicável (compras/beleza)
  "product_url": string | null,  // URL do produto mencionada explicitamente no texto, quando aplicável
  "details": { ... }             // objeto com os campos específicos da categoria listados acima
}

Não inclua nenhum texto fora do JSON.`;

function extrairJson(texto: string): unknown {
  const inicio = texto.indexOf("{");
  const fim = texto.lastIndexOf("}");
  if (inicio === -1 || fim === -1) {
    throw new Error("A resposta da IA não continha um JSON válido.");
  }
  return JSON.parse(texto.slice(inicio, fim + 1));
}

export async function classificarEExtrair(input: {
  url: string;
  caption?: string;
  sourcePlatform?: string | null;
}): Promise<ResultadoExtracao> {
  const conteudoUsuario = [
    `Link: ${input.url}`,
    input.sourcePlatform ? `Plataforma: ${input.sourcePlatform}` : null,
    input.caption ? `Legenda/transcrição:\n${input.caption}` : "Legenda/transcrição: (não informada)",
  ]
    .filter(Boolean)
    .join("\n");

  const resposta = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    system: PROMPT_SISTEMA,
    messages: [{ role: "user", content: conteudoUsuario }],
  });

  const bloco = resposta.content.find((b) => b.type === "text");
  if (!bloco || bloco.type !== "text") {
    throw new Error("A IA não retornou uma resposta em texto.");
  }

  const json = extrairJson(bloco.text) as Partial<ResultadoExtracao>;

  if (!json.category || !["compras", "receitas", "lugares", "beleza"].includes(json.category)) {
    throw new Error("A IA não retornou uma categoria válida.");
  }

  return {
    category: json.category,
    title: json.title ?? null,
    subcategory: json.subcategory ?? null,
    likely_store: json.likely_store ?? null,
    product_url: json.product_url ?? null,
    details: (json.details ?? {}) as Detalhes,
  };
}
