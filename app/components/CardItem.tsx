"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ehItemDeCompra,
  linkDoItem,
  nomeDaPlataforma,
  type DetalhesCompras,
  type DetalhesBeleza,
  type SavedItem,
} from "@/app/lib/pastas";

function nomeDaLoja(item: SavedItem): string {
  const detalhes = item.details as DetalhesCompras | DetalhesBeleza | null;
  return detalhes?.likely_store ?? "Loja não identificada";
}

export default function CardItem({ item, editavel = true }: { item: SavedItem; editavel?: boolean }) {
  const router = useRouter();
  const compra = ehItemDeCompra(item);
  const [editando, setEditando] = useState(false);
  const [descricao, setDescricao] = useState(item.description ?? "");
  const [salvando, setSalvando] = useState(false);

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

  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-colors">
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
        <p className="text-sm font-medium text-text-primary line-clamp-2">
          {item.title ?? "Sem título"}
        </p>

        {compra ? (
          <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-accent-bg text-accent-text truncate max-w-full">
            {nomeDaLoja(item)}
          </span>
        ) : editando ? (
          <div className="flex flex-col gap-1.5 mt-1.5">
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              autoFocus
              className="text-xs rounded-md bg-bg-page border border-border px-2 py-1.5 text-text-primary outline-none focus:border-accent resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={salvarDescricao}
                disabled={salvando}
                className="text-[11px] font-medium"
                style={{ color: "var(--accent-text)" }}
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
          <span className="inline-block mt-1.5 text-[11px] px-2 py-0.5 rounded-full bg-bg-surface-alt text-text-secondary">
            {nomeDaPlataforma(item.source_platform)}
          </span>
        )}
      </div>
    </div>
  );
}
