import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/compras");

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
