"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function BotaoSair({ className }: { className?: string }) {
  const router = useRouter();

  async function sair() {
    await supabase.auth.signOut();
    router.push("/entrar");
    router.refresh();
  }

  return (
    <button onClick={sair} className={className}>
      Sair
    </button>
  );
}
