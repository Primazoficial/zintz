"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Pencil, Plus } from "lucide-react";
import { aparenciaDaPasta, type PastaComContagem } from "@/app/lib/pastas";
import EditarPastaModal from "./EditarPastaModal";

export default function PastasGrid({
  pastas,
  onNovaPasta,
}: {
  pastas: PastaComContagem[];
  onNovaPasta: () => void;
}) {
  const [pastaEditando, setPastaEditando] = useState<PastaComContagem | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {pastas.map((pasta) => {
        const aparencia = aparenciaDaPasta(pasta);
        return (
          <div
            key={pasta.id}
            className="relative flex items-center bg-bg-surface p-3 pr-4"
            style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}
          >
            <Link href={`/pastas/${pasta.id}`} className="flex items-center gap-3 flex-1 min-w-0 py-1">
              <span
                className="w-11 h-11 rounded-[15px] flex items-center justify-center text-xl overflow-hidden shrink-0"
                style={{ background: aparencia.corAcentoBg }}
              >
                {aparencia.tipo === "imagem" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={aparencia.imagemUrl!} alt="" className="w-full h-full object-cover" />
                ) : (
                  aparencia.emoji
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-text-primary truncate">{pasta.name}</p>
                <p className="text-sm text-text-secondary">
                  {pasta.itens === 0 ? "Vazia" : `${pasta.itens} ${pasta.itens === 1 ? "item" : "itens"}`}
                </p>
              </div>
            </Link>

            <button
              onClick={() => setPastaEditando(pasta)}
              aria-label={`Editar pasta ${pasta.name}`}
              className="w-11 h-11 rounded-full flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent-bg transition-colors shrink-0"
            >
              <Pencil size={16} strokeWidth={2} />
            </button>
            <ChevronRight size={18} className="text-text-muted shrink-0" />
          </div>
        );
      })}

      <button
        onClick={onNovaPasta}
        className="flex items-center gap-3 border border-dashed border-border text-text-secondary p-3 hover:border-accent hover:text-accent transition-colors"
        style={{ borderRadius: "var(--radius-card)" }}
      >
        <span className="w-11 h-11 rounded-[15px] bg-bg-surface-alt flex items-center justify-center shrink-0">
          <Plus size={20} strokeWidth={2} />
        </span>
        <span className="font-semibold">Nova pasta</span>
      </button>

      {pastaEditando && (
        <EditarPastaModal pasta={pastaEditando} onFechar={() => setPastaEditando(null)} />
      )}
    </div>
  );
}
