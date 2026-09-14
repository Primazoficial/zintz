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
  const atualizacoes: Record<string, string | null> = {};

  if (typeof body?.description === "string") {
    atualizacoes.description = body.description.trim();
  }
  if ("categoria_id" in (body ?? {})) {
    atualizacoes.categoria_id = typeof body.categoria_id === "string" ? body.categoria_id : null;
  }

  if (Object.keys(atualizacoes).length === 0) {
    return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });
  }

  const { data: item, error } = await supabase
    .from("saved_items")
    .update(atualizacoes)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item });
}
