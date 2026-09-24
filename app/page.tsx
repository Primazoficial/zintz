import Link from "next/link";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import type { PastaComContagem } from "@/app/lib/pastas";
import PastasHomeClient from "@/app/components/PastasHomeClient";
import Logo from "@/app/components/Logo";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 bg-bg-page text-center gap-6">
        <Logo size={64} showWordmark tagline />
        <p className="max-w-md text-text-secondary">
          Salvou um achadinho, uma receita, um lugar ou uma rotina de beleza no TikTok ou Instagram?
          Cole o link no Zintz e a gente organiza tudo pra você reencontrar depois.
        </p>
        <Link
          href="/entrar"
          className="h-[50px] px-8 rounded-2xl bg-accent text-white font-extrabold flex items-center hover:opacity-90 transition-opacity"
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

  return <PastasHomeClient pastas={pastas} />;
}
