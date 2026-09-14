"use client";

import { useMemo, useState } from "react";
import Cabecalho from "./Cabecalho";
import AbasPastas from "./AbasPastas";
import CategoriasBar from "./CategoriasBar";
import VitrinePasta from "./VitrinePasta";
import FormNovaCategoria from "./FormNovaCategoria";
import type { FolderCategoria, PastaComContagem, SavedItem } from "@/app/lib/pastas";

export default function PastaDetalheClient({
  pasta,
  pastas,
  categorias,
  itens,
}: {
  pasta: PastaComContagem;
  pastas: PastaComContagem[];
  categorias: FolderCategoria[];
  itens: SavedItem[];
}) {
  const [criandoCategoria, setCriandoCategoria] = useState(false);
  const [categoriaAtivaId, setCategoriaAtivaId] = useState<string | null>(null);

  const itensFiltrados = useMemo(
    () => (categoriaAtivaId ? itens.filter((item) => item.categoria_id === categoriaAtivaId) : itens),
    [itens, categoriaAtivaId]
  );

  return (
    <div className="flex flex-col flex-1">
      <Cabecalho
        titulo={pasta.name}
        acao={
          <button
            onClick={() => setCriandoCategoria(true)}
            className="text-sm font-medium"
            style={{ color: "var(--accent-text)" }}
          >
            + Nova
          </button>
        }
      />
      <AbasPastas pastas={pastas} pastaAtualId={pasta.id} />
      <CategoriasBar
        categorias={categorias}
        categoriaAtivaId={categoriaAtivaId}
        onSelecionar={setCategoriaAtivaId}
      />
      <div className="flex-1 overflow-y-auto">
        <VitrinePasta itens={itensFiltrados} categorias={categorias} />
      </div>
      <FormNovaCategoria
        pastaId={pasta.id}
        aberto={criandoCategoria}
        onFechar={() => setCriandoCategoria(false)}
      />
    </div>
  );
}
