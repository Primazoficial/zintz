import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Informe o nome da pasta." }, { status: 400 });
  }

  const atualizacoes: Record<string, string | null> = { name };

  // Ícone é opcional na edição — se veio no corpo, emoji e foto são
  // mutuamente exclusivos (mandar um limpa o outro).
  if ("icon_image_url" in (body ?? {}) && body.icon_image_url) {
    atualizacoes.icon_image_url = body.icon_image_url;
    atualizacoes.icon_emoji = null;
  } else if ("icon_emoji" in (body ?? {})) {
    atualizacoes.icon_emoji = body.icon_emoji || null;
    atualizacoes.icon_image_url = null;
  }

  const { data: pasta, error } = await supabase
    .from("folders")
    .update(atualizacoes)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ pasta });
}
