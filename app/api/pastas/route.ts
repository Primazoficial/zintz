import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { LIMITE_PASTAS } from "@/app/lib/pastas";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: pastas, error } = await supabase
    .from("folders")
    .select("*, saved_items(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const comContagem = (pastas ?? []).map((pasta) => {
    const { saved_items, ...resto } = pasta as typeof pasta & {
      saved_items: { count: number }[];
    };
    return { ...resto, itens: saved_items?.[0]?.count ?? 0 };
  });

  return NextResponse.json({ pastas: comContagem });
}

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

  if (!name) {
    return NextResponse.json({ error: "Informe o nome da pasta." }, { status: 400 });
  }

  const { count, error: erroContagem } = await supabase
    .from("folders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (erroContagem) {
    return NextResponse.json({ error: erroContagem.message }, { status: 500 });
  }

  if ((count ?? 0) >= LIMITE_PASTAS) {
    return NextResponse.json(
      { error: `Você já tem o limite de ${LIMITE_PASTAS} pastas.` },
      { status: 400 }
    );
  }

  const { data: pasta, error } = await supabase
    .from("folders")
    .insert({ user_id: user.id, name, is_default: false })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ pasta: { ...pasta, itens: 0 } });
}
