import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import type { CategoriaSlug, SavedItem } from "@/app/lib/categorias";
import Cabecalho from "@/app/components/Cabecalho";
import NavInferior from "@/app/components/NavInferior";
import ListaDetalheClient from "@/app/components/ListaDetalheClient";

export default async function ListaDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/entrar?next=/listas/${id}`);

  const { data: lista } = await supabase
    .from("lists")
    .select("id, name, is_public, user_id, category_id, categories(slug)")
    .eq("id", id)
    .single();

  if (!lista) notFound();

  const categoriaSlug = (lista.categories as unknown as { slug: CategoriaSlug } | null)?.slug;
  if (!categoriaSlug) notFound();

  const souDono = lista.user_id === user.id;

  const { data: linhasNaLista } = await supabase
    .from("list_items")
    .select("saved_items(*)")
    .eq("list_id", id);

  const itensNaLista = (linhasNaLista ?? [])
    .map((linha) => linha.saved_items as unknown as SavedItem)
    .filter(Boolean);

  let itensDisponiveis: SavedItem[] = [];
  if (souDono) {
    const idsNaLista = new Set(itensNaLista.map((item) => item.id));
    const { data: todosOsItens } = await supabase
      .from("saved_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("category_id", lista.category_id)
      .order("created_at", { ascending: false });

    itensDisponiveis = ((todosOsItens ?? []) as SavedItem[]).filter(
      (item) => !idsNaLista.has(item.id)
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Cabecalho titulo={lista.name} />
      <div className="flex-1 overflow-y-auto">
        <ListaDetalheClient
          listaId={lista.id}
          categoria={categoriaSlug}
          isPublic={lista.is_public}
          souDono={souDono}
          itensNaLista={itensNaLista}
          itensDisponiveis={itensDisponiveis}
        />
      </div>
      <NavInferior />
    </div>
  );
}
