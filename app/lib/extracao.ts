import Anthropic from "@anthropic-ai/sdk";
import type { Detalhes } from "./pastas";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Arquétipo usado só pra sugerir em qual pasta padrão salvar — o item pode
// terminar em qualquer pasta que o usuário escolher, isso não trava nada.
export type ArquetipoPasta = "compras" | "receitas" | "lugares" | "beleza";

export type ResultadoExtracao = {
  arquetipo: ArquetipoPasta;
  title: string | null;
  description: string | null;
  subcategory: string | null;
  likely_store: string | null;
  product_url: string | null;
  details: Detalhes;
};

const PROMPT_SISTEMA = `Você recebe a legenda e/ou transcrição de um vídeo de rede social (TikTok, Instagram ou Pinterest) que um usuário salvou no app Zintz.

Primeiro identifique qual destes arquétipos combina melhor com o conteúdo, só como sugestão de pasta: "compras", "receitas", "lugares" ou "beleza".

Depois extraia os dados específicos do arquétipo escolhido:

- compras: product_name, subcategory (ex: casa, eletrônicos, moda), likely_store (loja mais provável de venda, ex: Shopee, Amazon, Mercado Livre), product_url (se mencionada explicitamente no texto)
- receitas: recipe_name, ingredients (lista), prep_time (se mencionado), mentioned_products (utensílios/marcas citados, lista)
- lugares: place_name, place_type (praia, restaurante, trilha, cidade, hotel, atração), location (cidade/região), mentioned_activity
- beleza: product_name, subcategory (skincare, maquiagem, cabelo), likely_store (ex: Sephora, Beleza na Web), routine_step (ex: limpeza, hidratação)

Responda APENAS com um JSON no formato:
{
  "arquetipo": "compras" | "receitas" | "lugares" | "beleza",
  "title": string,               // nome curto e legível do item (produto, prato, lugar ou rotina)
  "description": string,         // 1-2 frases descrevendo o post, em português, pra mostrar no card
  "subcategory": string | null,  // subcategoria do produto/lugar, quando fizer sentido
  "likely_store": string | null, // loja mais provável, só quando o post tiver um produto à venda
  "product_url": string | null,  // URL do produto mencionada explicitamente no texto, quando aplicável
  "details": { ... }             // objeto com os campos específicos do arquétipo listados acima
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

  if (!json.arquetipo || !["compras", "receitas", "lugares", "beleza"].includes(json.arquetipo)) {
    throw new Error("A IA não retornou um arquétipo válido.");
  }

  return {
    arquetipo: json.arquetipo,
    title: json.title ?? null,
    description: json.description ?? null,
    subcategory: json.subcategory ?? null,
    likely_store: json.likely_store ?? null,
    product_url: json.product_url ?? null,
    details: (json.details ?? {}) as Detalhes,
  };
}
