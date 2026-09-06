import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { CATEGORIAS, type CategoriaSlug, type SavedItem } from "@/app/lib/categorias";
import Cabecalho from "@/app/components/Cabecalho";
import NavInferior from "@/app/components/NavInferior";
import VitrineCategoria from "@/app/components/VitrineCategoria";

export async function PaginaCategoria({ slug }: { slug: CategoriaSlug }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/entrar?next=/${slug}`);

  const { data: categoria } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  const { data: itens } = categoria
    ? await supabase
        .from("saved_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("category_id", categoria.id)
        .order("created_at", { ascending: false })
    : { data: [] as SavedItem[] };

  return (
    <div className="flex flex-col flex-1">
      <Cabecalho titulo={CATEGORIAS[slug].nomePlural} />
      <div className="flex-1 overflow-y-auto">
        <VitrineCategoria categoria={slug} itens={(itens ?? []) as SavedItem[]} />
      </div>
      <NavInferior />
    </div>
  );
}
