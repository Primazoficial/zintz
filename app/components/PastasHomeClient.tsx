"use client";

import { useState } from "react";
import Cabecalho from "./Cabecalho";
import PastasGrid from "./PastasGrid";
import FormNovaPasta from "./FormNovaPasta";
import type { PastaComContagem } from "@/app/lib/pastas";

export default function PastasHomeClient({ pastas }: { pastas: PastaComContagem[] }) {
  const [criando, setCriando] = useState(false);

  return (
    <div className="flex flex-col flex-1">
      <Cabecalho
        acao={
          <button
            onClick={() => setCriando(true)}
            className="text-sm font-medium"
            style={{ color: "var(--accent-text)" }}
          >
            + Nova
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <PastasGrid pastas={pastas} />
      </div>
      <FormNovaPasta totalAtual={pastas.length} aberto={criando} onFechar={() => setCriando(false)} />
    </div>
  );
}
