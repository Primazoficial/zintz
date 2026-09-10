"use client";

import { useMemo, useState } from "react";
import type { SavedItem } from "@/app/lib/pastas";
import CardItem from "./CardItem";

type Ordenacao = "recentes" | "subcategoria";

export default function VitrinePasta({ itens }: { itens: SavedItem[] }) {
  const [busca, setBusca] = useState("");
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("recentes");

  const subcategorias = useMemo(() => {
    const vistas = new Set<string>();
    for (const item of itens) {
      if (item.subcategory) vistas.add(item.subcategory);
    }
    return Array.from(vistas).sort();
  }, [itens]);

  const itensFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    let resultado = itens.filter((item) => {
      const bateTermo =
        termo.length === 0 ||
        item.title?.toLowerCase().includes(termo) ||
        item.description?.toLowerCase().includes(termo) ||
        item.subcategory?.toLowerCase().includes(termo);
      const bateSubcategoria = !subcategoriaAtiva || item.subcategory === subcategoriaAtiva;
      return bateTermo && bateSubcategoria;
    });

    if (ordenacao === "subcategoria") {
      resultado = [...resultado].sort((a, b) =>
        (a.subcategory ?? "").localeCompare(b.subcategory ?? "")
      );
    }

    return resultado;
  }, [itens, busca, subcategoriaAtiva, ordenacao]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar nos itens salvos..."
        className="w-full h-11 rounded-lg bg-bg-surface border border-border px-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
      />

      {subcategorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            onClick={() => setSubcategoriaAtiva(null)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              subcategoriaAtiva === null
                ? "bg-accent-bg border-accent text-accent-text"
                : "bg-bg-surface-alt border-border text-text-secondary"
            }`}
          >
            Todas
          </button>
          {subcategorias.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubcategoriaAtiva(sub)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${
                subcategoriaAtiva === sub
                  ? "bg-accent-bg border-accent text-accent-text"
                  : "bg-bg-surface-alt border-border text-text-secondary"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
          className="text-xs bg-bg-surface border border-border rounded-md px-2 py-1 text-text-secondary outline-none"
        >
          <option value="recentes">Mais recentes</option>
          <option value="subcategoria">Por subcategoria</option>
        </select>
      </div>

      {itensFiltrados.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-16">
          {itens.length === 0
            ? "Nada por aqui ainda — toque em \"+ Novo\" para salvar seu primeiro link."
            : "Nenhum item encontrado com esse filtro."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {itensFiltrados.map((item) => (
            <CardItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
