"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function Cabecalho({
  titulo,
  acao,
}: {
  titulo?: React.ReactNode;
  acao?: React.ReactNode;
}) {
  const router = useRouter();

  async function sair() {
    await supabase.auth.signOut();
    router.push("/entrar");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between gap-3 px-5 py-4 bg-bg-surface border-b border-border">
      <div className="flex items-center gap-2 min-w-0">
        <Link href="/" className="text-lg font-bold text-text-primary shrink-0">
          Zint<span style={{ color: "var(--accent)" }}>z</span>
        </Link>
        {titulo && (
          <>
            <span className="text-text-muted shrink-0">›</span>
            <span className="text-sm font-medium text-text-secondary truncate min-w-0">{titulo}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {acao}
        <button onClick={sair} className="text-sm text-text-muted hover:text-text-secondary transition-colors">
          Sair
        </button>
      </div>
    </header>
  );
}
