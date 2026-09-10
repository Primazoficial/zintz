import Link from "next/link";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import type { PastaComContagem } from "@/app/lib/pastas";
import Cabecalho from "@/app/components/Cabecalho";
import NavInferior from "@/app/components/NavInferior";
import PastasGrid from "@/app/components/PastasGrid";
import FormNovaPasta from "@/app/components/FormNovaPasta";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 bg-bg-page text-center gap-6">
        <h1 className="text-4xl font-bold text-text-primary">
          Zint<span style={{ color: "var(--accent)" }}>z</span>
        </h1>
        <p className="max-w-md text-text-secondary">
          Salvou um achadinho, uma receita, um lugar ou uma rotina de beleza no TikTok ou Instagram?
          Cole o link no Zintz e a gente organiza tudo pra você reencontrar depois.
        </p>
        <Link
          href="/entrar"
          className="h-12 px-8 rounded-lg bg-accent text-white font-semibold flex items-center hover:opacity-90 transition-opacity"
        >
          Começar
        </Link>
      </main>
    );
  }

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

  return (
    <div className="flex flex-col flex-1">
      <Cabecalho titulo="Zintz" />
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-4">
        <PastasGrid pastas={pastas} />
        <FormNovaPasta totalAtual={pastas.length} />
      </div>
      <NavInferior />
    </div>
  );
}
