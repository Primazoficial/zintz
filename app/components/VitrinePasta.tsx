"use client";

import { useMemo, useState } from "react";
import type { FolderCategoria, SavedItem } from "@/app/lib/pastas";
import CardItem from "./CardItem";

type Ordenacao = "recentes" | "subcategoria";

export default function VitrinePasta({
  itens,
  categorias = [],
}: {
  itens: SavedItem[];
  categorias?: FolderCategoria[];
}) {
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
        className="w-full h-[50px] rounded-2xl bg-field-bg px-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent transition-shadow"
      />

      {subcategorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            onClick={() => setSubcategoriaAtiva(null)}
            className={`shrink-0 flex items-center h-10 px-4 rounded-full text-sm font-semibold capitalize transition-colors ${
              subcategoriaAtiva === null ? "bg-navy text-white" : "bg-bg-surface-alt text-navy"
            }`}
          >
            Todas
          </button>
          {subcategorias.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubcategoriaAtiva(sub)}
              className={`shrink-0 flex items-center h-10 px-4 rounded-full text-sm font-semibold capitalize transition-colors ${
                subcategoriaAtiva === sub ? "bg-navy text-white" : "bg-bg-surface-alt text-navy"
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
          className="text-xs bg-bg-surface border border-border rounded-full px-3 py-1.5 text-text-secondary outline-none"
        >
          <option value="recentes">Mais recentes</option>
          <option value="subcategoria">Por subcategoria</option>
        </select>
      </div>

      {itensFiltrados.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-16">
          {itens.length === 0
            ? "Nada por aqui ainda — compartilhe um link do TikTok, Instagram ou Pinterest para o Zintz para salvar seu primeiro item."
            : "Nenhum item encontrado com esse filtro."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {itensFiltrados.map((item) => (
            <CardItem key={item.id} item={item} categorias={categorias} />
          ))}
        </div>
      )}
    </div>
  );
}
