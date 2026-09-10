"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SavedItem } from "@/app/lib/pastas";
import CardItem from "./CardItem";

type Props = {
  listaId: string;
  isPublic: boolean;
  souDono: boolean;
  itensNaLista: SavedItem[];
  itensDisponiveis: SavedItem[];
};

export default function ListaDetalheClient({
  listaId,
  isPublic,
  souDono,
  itensNaLista,
  itensDisponiveis,
}: Props) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);

  async function alternarPublica() {
    setCarregando(true);
    await fetch(`/api/listas/${listaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_public: !isPublic }),
    });
    setCarregando(false);
    router.refresh();
  }

  async function excluirLista() {
    setCarregando(true);
    await fetch(`/api/listas/${listaId}`, { method: "DELETE" });
    router.push("/listas");
    router.refresh();
  }

  async function adicionarItem(itemId: string) {
    setCarregando(true);
    await fetch(`/api/listas/${listaId}/itens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: itemId }),
    });
    setCarregando(false);
    router.refresh();
  }

  async function removerItem(itemId: string) {
    setCarregando(true);
    await fetch(`/api/listas/${listaId}/itens?item_id=${itemId}`, { method: "DELETE" });
    setCarregando(false);
    router.refresh();
  }

  async function compartilhar() {
    const url = `${window.location.origin}/listas/${listaId}/compartilhada`;
    await navigator.clipboard.writeText(url);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      {souDono && (
        <div className="flex flex-col gap-3 bg-bg-surface border border-border rounded-xl p-4">
          <label className="flex items-center justify-between text-sm text-text-secondary">
            Lista pública (qualquer pessoa com o link pode ver)
            <input
              type="checkbox"
              checked={isPublic}
              disabled={carregando}
              onChange={alternarPublica}
              className="h-4 w-4 accent-accent"
            />
          </label>

          {isPublic && (
            <button
              onClick={compartilhar}
              className="h-9 rounded-lg bg-accent-bg text-sm font-medium"
              style={{ color: "var(--accent-text)" }}
            >
              {linkCopiado ? "Link copiado!" : "Copiar link para compartilhar"}
            </button>
          )}

          <button
            onClick={excluirLista}
            disabled={carregando}
            className="h-9 rounded-lg text-sm text-danger border border-danger/30 hover:bg-danger/5 transition-colors"
          >
            Excluir lista
          </button>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-2">Itens na lista</h2>
        {itensNaLista.length === 0 ? (
          <p className="text-sm text-text-muted">Nenhum item nessa lista ainda.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {itensNaLista.map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                <CardItem item={item} />
                {souDono && (
                  <button
                    onClick={() => removerItem(item.id)}
                    disabled={carregando}
                    className="text-xs text-danger self-start"
                  >
                    Remover da lista
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {souDono && itensDisponiveis.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-secondary mb-2">
            Adicionar itens salvos nessa pasta
          </h2>
          <ul className="flex flex-col gap-2">
            {itensDisponiveis.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-bg-surface border border-border rounded-lg px-3 py-2"
              >
                <span className="text-sm text-text-primary truncate">{item.title ?? "Sem título"}</span>
                <button
                  onClick={() => adicionarItem(item.id)}
                  disabled={carregando}
                  className="text-xs font-medium shrink-0 ml-2"
                  style={{ color: "var(--accent-text)" }}
                >
                  Adicionar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
