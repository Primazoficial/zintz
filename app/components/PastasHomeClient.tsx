"use client";

import { useState } from "react";
import Link from "next/link";
import { Link2, ChevronRight } from "lucide-react";
import Logo from "./Logo";
import BotaoSair from "./BotaoSair";
import PastasGrid from "./PastasGrid";
import FormNovaPasta from "./FormNovaPasta";
import type { PastaComContagem } from "@/app/lib/pastas";

export default function PastasHomeClient({ pastas }: { pastas: PastaComContagem[] }) {
  const [criando, setCriando] = useState(false);

  return (
    <div className="flex flex-col flex-1 bg-bg-page">
      <header
        className="flex flex-col gap-6 px-5 pt-6 pb-10 text-white bg-navy"
        style={{ borderBottomLeftRadius: "var(--radius-header)", borderBottomRightRadius: "var(--radius-header)" }}
      >
        <div className="flex items-center justify-between">
          <Logo inverted showWordmark size={28} />
          <BotaoSair className="h-11 px-1 text-sm text-navy-text hover:text-white transition-colors" />
        </div>
        <div>
          <h1 className="text-[29px] font-extrabold leading-[1.15]">
            Tudo que você salva, num só lugar.
          </h1>
          <p className="text-navy-text text-sm mt-1.5">
            Salve posts do TikTok, Instagram e Pinterest e organize por pastas.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 -mt-[50px] pb-8 flex flex-col gap-6">
        <Link
          href="/novo"
          className="flex items-center gap-4 bg-bg-surface p-5 transition-transform hover:-translate-y-0.5"
          style={{ borderRadius: "var(--radius-card-hero)", boxShadow: "var(--shadow-hero)" }}
        >
          <span className="w-12 h-12 rounded-2xl bg-accent-bg text-accent flex items-center justify-center shrink-0">
            <Link2 size={22} strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-text-primary">Salvar um novo link</p>
            <p className="text-sm text-text-secondary truncate">
              Cole o link de um post e a gente organiza pra você
            </p>
          </div>
          <ChevronRight size={20} className="text-text-muted shrink-0" />
        </Link>

        <div className="flex flex-col gap-3">
          <h2 className="text-[20px] font-extrabold text-text-primary px-1">Suas pastas</h2>
          <PastasGrid pastas={pastas} onNovaPasta={() => setCriando(true)} />
        </div>
      </div>

      <FormNovaPasta totalAtual={pastas.length} aberto={criando} onFechar={() => setCriando(false)} />
    </div>
  );
}
