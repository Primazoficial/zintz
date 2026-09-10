import type { SupabaseClient } from "@supabase/supabase-js";

export type Partner = {
  id: string;
  name: string;
  domain: string | null;
  affiliate_link_template: string | null;
  partner_type: string | null;
};

// Procura um parceiro cadastrado cujo nome bate com a loja/plataforma que a
// IA identificou (ex: likely_store "Shopee" -> partner "Shopee"). Parceiros
// são globais (não presos a pasta/categoria) — comparação simples por nome,
// suficiente para o volume inicial de parceiros do MVP.
export async function buscarParceiro(
  supabase: SupabaseClient,
  likelyStore: string | null
): Promise<Partner | null> {
  if (!likelyStore) return null;

  const { data, error } = await supabase
    .from("partners")
    .select("id, name, domain, affiliate_link_template, partner_type")
    .ilike("name", likelyStore.trim())
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// O template guarda "{url}" onde a URL original (codificada) deve entrar,
// ex: "https://shopee.com.br/redirect?url={url}&afid=zintz".
export function gerarLinkAfiliado(partner: Partner, urlOriginal: string): string | null {
  if (!partner.affiliate_link_template) return null;
  return partner.affiliate_link_template.replace("{url}", encodeURIComponent(urlOriginal));
}
