import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import type { PastaComContagem, SavedItem } from "@/app/lib/pastas";
import Cabecalho from "@/app/components/Cabecalho";
import TituloPasta from "@/app/components/TituloPasta";
import AbasPastas from "@/app/components/AbasPastas";
import NavInferior from "@/app/components/NavInferior";
import VitrinePasta from "@/app/components/VitrinePasta";

export default async function PastaDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/entrar?next=/pastas/${id}`);

  const { data: todasAsPastas } = await supabase
    .from("folders")
    .select("*, saved_items(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const pastas: PastaComContagem[] = (todasAsPastas ?? []).map((pasta) => {
    const { saved_items, ...resto } = pasta as typeof pasta & {
      saved_items: { count: number }[];
    };
    return { ...resto, itens: saved_items?.[0]?.count ?? 0 };
  });

  const pastaAtual = pastas.find((pasta) => pasta.id === id);
  if (!pastaAtual) notFound();

  const { data: itens } = await supabase
    .from("saved_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("folder_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col flex-1">
      <Cabecalho titulo={<TituloPasta pastaId={pastaAtual.id} nome={pastaAtual.name} />} />
      <AbasPastas pastas={pastas} pastaAtualId={pastaAtual.id} />
      <div className="flex-1 overflow-y-auto">
        <VitrinePasta itens={(itens ?? []) as SavedItem[]} />
      </div>
      <NavInferior />
    </div>
  );
}
