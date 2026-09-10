"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function Cabecalho({ titulo }: { titulo: React.ReactNode }) {
  const router = useRouter();

  async function sair() {
    await supabase.auth.signOut();
    router.push("/entrar");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between px-5 py-4 bg-bg-surface border-b border-border">
      <h1 className="text-lg font-semibold text-text-primary">{titulo}</h1>
      <div className="flex items-center gap-3">
        <Link href="/novo" className="text-sm font-medium" style={{ color: "var(--accent-text)" }}>
          + Novo
        </Link>
        <button onClick={sair} className="text-sm text-text-muted hover:text-text-secondary transition-colors">
          Sair
        </button>
      </div>
    </header>
  );
}
