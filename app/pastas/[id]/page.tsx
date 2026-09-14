import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import type { FolderCategoria, PastaComContagem, SavedItem } from "@/app/lib/pastas";
import PastaDetalheClient from "@/app/components/PastaDetalheClient";

export default async function PastaDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/entrar?next=/pastas/${id}`);

  const [{ data: todasAsPastas }, { data: itens }, { data: categorias }] = await Promise.all([
    supabase
      .from("folders")
      .select("*, saved_items(count)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("saved_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("folder_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("folder_categories")
      .select("*")
      .eq("user_id", user.id)
      .eq("folder_id", id)
      .order("created_at", { ascending: true }),
  ]);

  const pastas: PastaComContagem[] = (todasAsPastas ?? []).map((pasta) => {
    const { saved_items, ...resto } = pasta as typeof pasta & {
      saved_items: { count: number }[];
    };
    return { ...resto, itens: saved_items?.[0]?.count ?? 0 };
  });

  const pastaAtual = pastas.find((pasta) => pasta.id === id);
  if (!pastaAtual) notFound();

  return (
    <PastaDetalheClient
      pasta={pastaAtual}
      pastas={pastas}
      categorias={(categorias ?? []) as FolderCategoria[]}
      itens={(itens ?? []) as SavedItem[]}
    />
  );
}
