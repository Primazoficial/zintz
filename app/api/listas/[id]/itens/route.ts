import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const itemId = typeof body?.item_id === "string" ? body.item_id : "";
  if (!itemId) {
    return NextResponse.json({ error: "Informe item_id." }, { status: 400 });
  }

  // A policy de RLS de list_items exige que a lista pertença ao usuário
  // autenticado — não é preciso checar o dono aqui de novo.
  const { error } = await supabase.from("list_items").insert({ list_id: id, item_id: itemId });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const itemId = new URL(request.url).searchParams.get("item_id");
  if (!itemId) {
    return NextResponse.json({ error: "Informe item_id." }, { status: 400 });
  }

  const { error } = await supabase
    .from("list_items")
    .delete()
    .eq("list_id", id)
    .eq("item_id", itemId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
