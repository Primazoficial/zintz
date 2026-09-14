"use client";

import { useState } from "react";
import Link from "next/link";
import { aparenciaDaPasta, type PastaComContagem } from "@/app/lib/pastas";
import EditarPastaModal from "./EditarPastaModal";

export default function PastasGrid({ pastas }: { pastas: PastaComContagem[] }) {
  const [pastaEditando, setPastaEditando] = useState<PastaComContagem | null>(null);

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {pastas.map((pasta) => {
        const aparencia = aparenciaDaPasta(pasta);
        return (
          <div
            key={pasta.id}
            className="relative flex flex-col gap-2 bg-bg-surface border border-border rounded-xl p-4 hover:border-accent transition-colors"
          >
            <button
              onClick={() => setPastaEditando(pasta)}
              aria-label="Editar pasta"
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-surface-alt transition-colors"
            >
              ✏️
            </button>

            <Link href={`/pastas/${pasta.id}`} className="flex flex-col gap-2">
              <span
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl overflow-hidden"
                style={{ background: aparencia.corAcentoBg }}
              >
                {aparencia.tipo === "imagem" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={aparencia.imagemUrl!} alt="" className="w-full h-full object-cover" />
                ) : (
                  aparencia.emoji
                )}
              </span>
              <span className="text-sm font-medium text-text-primary line-clamp-2 pr-5">
                {pasta.name}
              </span>
              <span className="text-xs text-text-muted">
                {pasta.itens === 0 ? "Vazia" : `${pasta.itens} ${pasta.itens === 1 ? "item" : "itens"}`}
              </span>
            </Link>
          </div>
        );
      })}

      {pastaEditando && (
        <EditarPastaModal pasta={pastaEditando} onFechar={() => setPastaEditando(null)} />
      )}
    </div>
  );
}
