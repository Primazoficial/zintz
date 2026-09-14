"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormNovaCategoria({
  pastaId,
  aberto,
  onFechar,
}: {
  pastaId: string;
  aberto: boolean;
  onFechar: () => void;
}) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [mensagemErro, setMensagemErro] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMensagemErro("");

    const resposta = await fetch(`/api/pastas/${pastaId}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome }),
    });

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setStatus("error");
      setMensagemErro(dados.error ?? "Não foi possível criar a categoria.");
      return;
    }

    setNome("");
    setStatus("idle");
    onFechar();
    router.refresh();
  }

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
      onClick={onFechar}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm flex flex-col gap-4 bg-bg-surface border border-border rounded-xl p-5"
      >
        <h2 className="text-sm font-semibold text-text-primary">Nova categoria</h2>

        <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
          Nome
          <input
            autoFocus
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da categoria"
            className="h-10 rounded-lg bg-bg-page border border-border px-3 text-text-primary outline-none focus:border-accent"
          />
        </label>

        {status === "error" && <p className="text-sm text-danger">{mensagemErro}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex-1 h-10 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === "loading" ? "Criando..." : "Criar categoria"}
          </button>
          <button
            type="button"
            onClick={onFechar}
            className="h-10 px-4 rounded-lg text-sm text-text-muted"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
