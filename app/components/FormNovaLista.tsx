"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Pasta } from "@/app/lib/pastas";

export default function FormNovaLista({ pastas }: { pastas: Pasta[] }) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [folderId, setFolderId] = useState(pastas[0]?.id ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [mensagemErro, setMensagemErro] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMensagemErro("");

    const resposta = await fetch("/api/listas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome, folder_id: folderId }),
    });

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setStatus("error");
      setMensagemErro(dados.error ?? "Não foi possível criar a lista.");
      return;
    }

    setNome("");
    setStatus("idle");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-bg-surface border border-border rounded-xl p-4">
      <div className="flex gap-2">
        <input
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da lista (ex: Presentes de Natal)"
          className="flex-1 h-10 rounded-lg bg-bg-page border border-border px-3 text-sm text-text-primary outline-none focus:border-accent"
        />
        <select
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="h-10 rounded-lg bg-bg-page border border-border px-2 text-sm text-text-secondary outline-none"
        >
          {pastas.map((pasta) => (
            <option key={pasta.id} value={pasta.id}>
              {pasta.name}
            </option>
          ))}
        </select>
      </div>
      {status === "error" && <p className="text-sm text-danger">{mensagemErro}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-10 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "loading" ? "Criando..." : "Criar lista"}
      </button>
    </form>
  );
}
