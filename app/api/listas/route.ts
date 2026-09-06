import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const categorySlug = typeof body?.category_slug === "string" ? body.category_slug : "";

  if (!name || !categorySlug) {
    return NextResponse.json({ error: "Informe o nome e a categoria da lista." }, { status: 400 });
  }

  const { data: categoria, error: erroCategoria } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (erroCategoria || !categoria) {
    return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
  }

  const { data: lista, error } = await supabase
    .from("lists")
    .insert({ user_id: user.id, category_id: categoria.id, name })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lista });
}
