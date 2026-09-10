import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { buscarParceiro, gerarLinkAfiliado } from "@/app/lib/afiliados";
import { detectarPlataforma } from "@/app/lib/plataforma";
import type { ResultadoExtracao } from "@/app/lib/extracao";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const sourceUrl = typeof body?.source_url === "string" ? body.source_url.trim() : "";
  const imagemInformada = typeof body?.image_url === "string" ? body.image_url.trim() : undefined;
  const folderId = typeof body?.folder_id === "string" ? body.folder_id : "";
  const extraido = body?.extraido as Partial<ResultadoExtracao> | undefined;

  if (!sourceUrl) {
    return NextResponse.json({ error: "Informe o link do post/vídeo." }, { status: 400 });
  }
  if (!folderId) {
    return NextResponse.json({ error: "Escolha uma pasta para salvar." }, { status: 400 });
  }
  if (!extraido) {
    return NextResponse.json({ error: "Faltam os dados classificados do item." }, { status: 400 });
  }

  const { data: pasta, error: erroPasta } = await supabase
    .from("folders")
    .select("id")
    .eq("id", folderId)
    .eq("user_id", user.id)
    .single();

  if (erroPasta || !pasta) {
    return NextResponse.json({ error: "Pasta não encontrada." }, { status: 404 });
  }

  const parceiro = await buscarParceiro(supabase, extraido.likely_store ?? null);
  const urlOriginalDoConteudo = extraido.product_url ?? sourceUrl;
  const affiliateUrl = parceiro ? gerarLinkAfiliado(parceiro, urlOriginalDoConteudo) : null;

  const { data: item, error: erroInsercao } = await supabase
    .from("saved_items")
    .insert({
      user_id: user.id,
      folder_id: folderId,
      source_url: sourceUrl,
      source_platform: detectarPlataforma(sourceUrl),
      title: extraido.title ?? null,
      description: extraido.description ?? null,
      image_url: imagemInformada || null,
      subcategory: extraido.subcategory ?? null,
      details: extraido.details ?? {},
      original_url: extraido.product_url ?? null,
      affiliate_url: affiliateUrl,
      partner_id: parceiro?.id ?? null,
    })
    .select()
    .single();

  if (erroInsercao) {
    return NextResponse.json({ error: erroInsercao.message }, { status: 500 });
  }

  return NextResponse.json({ item });
}
