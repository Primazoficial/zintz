"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ehItemDeCompra,
  linkDoItem,
  nomeDaPlataforma,
  type DetalhesCompras,
  type DetalhesBeleza,
  type FolderCategoria,
  type SavedItem,
} from "@/app/lib/pastas";

function nomeDaLoja(item: SavedItem): string {
  const detalhes = item.details as DetalhesCompras | DetalhesBeleza | null;
  return detalhes?.likely_store ?? "Loja não identificada";
}

export default function CardItem({
  item,
  categorias = [],
  editavel = true,
}: {
  item: SavedItem;
  categorias?: FolderCategoria[];
  editavel?: boolean;
}) {
  const router = useRouter();
  const compra = ehItemDeCompra(item);
  const [editando, setEditando] = useState(false);
  const [descricao, setDescricao] = useState(item.description ?? "");
  const [salvando, setSalvando] = useState(false);
  const [movendo, setMovendo] = useState(false);

  async function salvarDescricao() {
    setSalvando(true);
    await fetch(`/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: descricao }),
    });
    setSalvando(false);
    setEditando(false);
    router.refresh();
  }

  async function mudarCategoria(categoriaId: string) {
    setMovendo(true);
    await fetch(`/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoria_id: categoriaId || null }),
    });
    setMovendo(false);
    router.refresh();
  }

  return (
    <div
      className="bg-bg-surface overflow-hidden"
      style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}
    >
      <a href={linkDoItem(item)} target="_blank" rel="noopener noreferrer nofollow" className="block">
        <div className="aspect-square bg-bg-surface-alt flex items-center justify-center overflow-hidden">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image_url} alt={item.title ?? ""} className="w-full h-full object-cover" />
          ) : (
            <span className="text-text-muted text-xs">Sem imagem</span>
          )}
        </div>
      </a>
      <div className="p-3">
        <p className="text-sm font-bold text-text-primary line-clamp-2">
          {item.title ?? "Sem título"}
        </p>

        {compra ? (
          <span className="inline-block mt-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent-bg text-accent-text truncate max-w-full">
            {nomeDaLoja(item)}
          </span>
        ) : editando ? (
          <div className="flex flex-col gap-1.5 mt-1.5">
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              autoFocus
              className="text-xs rounded-xl bg-field-bg px-2.5 py-2 text-text-primary outline-none focus:ring-2 focus:ring-accent transition-shadow resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={salvarDescricao}
                disabled={salvando}
                className="text-[11px] font-bold text-accent-text"
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={() => {
                  setDescricao(item.description ?? "");
                  setEditando(false);
                }}
                className="text-[11px] text-text-muted"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => editavel && setEditando(true)}
            className="block w-full text-left mt-1"
            disabled={!editavel}
          >
            <p className="text-xs text-text-muted line-clamp-2">
              {item.description || (editavel ? "Toque para adicionar uma descrição" : "Sem descrição")}
            </p>
          </button>
        )}

        {!compra && (
          <span className="inline-block mt-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-bg-surface-alt text-navy">
            {nomeDaPlataforma(item.source_platform)}
          </span>
        )}

        {editavel && categorias.length > 0 && (
          <select
            value={item.categoria_id ?? ""}
            disabled={movendo}
            onChange={(e) => mudarCategoria(e.target.value)}
            className="mt-2 w-full text-[11px] bg-field-bg rounded-xl px-2.5 py-2 text-text-secondary outline-none"
          >
            <option value="">Sem categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
