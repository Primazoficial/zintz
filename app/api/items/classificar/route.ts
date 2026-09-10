import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { classificarEExtrair } from "@/app/lib/extracao";
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

  const { data: pastas, error: erroPastas } = await supabase
    .from("folders")
    .select("*, saved_items(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (erroPastas) {
    return NextResponse.json({ error: erroPastas.message }, { status: 500 });
  }

  const comContagem = (pastas ?? []).map((pasta) => {
    const { saved_items, ...resto } = pasta as typeof pasta & {
      saved_items: { count: number }[];
    };
    return { ...resto, itens: saved_items?.[0]?.count ?? 0 };
  });

  const pastaSugerida =
    comContagem.find((pasta) => pasta.slug === extraido.arquetipo) ?? comContagem[0] ?? null;

  return NextResponse.json({ extraido, pastaSugerida, pastas: comContagem });
}
