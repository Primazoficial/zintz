import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { classificarEExtrair } from "@/app/lib/extracao";
import { buscarParceiro, gerarLinkAfiliado } from "@/app/lib/afiliados";
import { detectarPlataforma } from "@/app/lib/plataforma";

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
  const caption = typeof body?.caption === "string" ? body.caption.trim() : undefined;
  const imagemInformada = typeof body?.image_url === "string" ? body.image_url.trim() : undefined;

  if (!sourceUrl) {
    return NextResponse.json({ error: "Informe o link do post/vídeo." }, { status: 400 });
  }

  let extraido;
  try {
    extraido = await classificarEExtrair({
      url: sourceUrl,
      caption,
      sourcePlatform: detectarPlataforma(sourceUrl),
    });
  } catch (erro) {
    console.error("Falha na classificação/extração via IA:", erro);
    return NextResponse.json(
      { error: "Não consegui classificar esse conteúdo. Tente incluir a legenda do post." },
      { status: 502 }
    );
  }

  const { data: categoria, error: erroCategoria } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", extraido.category)
    .single();

  if (erroCategoria || !categoria) {
    return NextResponse.json({ error: "Categoria não encontrada." }, { status: 500 });
  }

  const parceiro = await buscarParceiro(supabase, categoria.id, extraido.likely_store);
  const urlOriginalDoConteudo = extraido.product_url ?? sourceUrl;
  const affiliateUrl = parceiro ? gerarLinkAfiliado(parceiro, urlOriginalDoConteudo) : null;

  const { data: item, error: erroInsercao } = await supabase
    .from("saved_items")
    .insert({
      user_id: user.id,
      category_id: categoria.id,
      source_url: sourceUrl,
      source_platform: detectarPlataforma(sourceUrl),
      title: extraido.title,
      image_url: imagemInformada || null,
      subcategory: extraido.subcategory,
      details: extraido.details,
      original_url: extraido.product_url,
      affiliate_url: affiliateUrl,
      partner_id: parceiro?.id ?? null,
    })
    .select()
    .single();

  if (erroInsercao) {
    return NextResponse.json({ error: erroInsercao.message }, { status: 500 });
  }

  return NextResponse.json({ item, category: extraido.category });
}
