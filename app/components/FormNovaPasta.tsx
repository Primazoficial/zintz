"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LIMITE_PASTAS } from "@/app/lib/pastas";

export default function FormNovaPasta({ totalAtual }: { totalAtual: number }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [mensagemErro, setMensagemErro] = useState("");

  const limiteAtingido = totalAtual >= LIMITE_PASTAS;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMensagemErro("");

    const resposta = await fetch("/api/pastas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome }),
    });

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setStatus("error");
      setMensagemErro(dados.error ?? "Não foi possível criar a pasta.");
      return;
    }

    setNome("");
    setStatus("idle");
    setAberto(false);
    router.refresh();
  }

  if (limiteAtingido) {
    return (
      <p className="text-xs text-text-muted px-4">
        Você atingiu o limite de {LIMITE_PASTAS} pastas.
      </p>
    );
  }

  if (!aberto) {
    return (
      <div className="px-4">
        <button
          onClick={() => setAberto(true)}
          className="w-full h-11 rounded-lg border border-dashed border-border text-sm text-text-secondary hover:border-accent hover:text-accent-text transition-colors"
        >
          + Nova pasta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-4 bg-bg-surface border border-border rounded-xl p-3">
      <input
        autoFocus
        type="text"
        required
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da nova pasta"
        className="h-10 rounded-lg bg-bg-page border border-border px-3 text-sm text-text-primary outline-none focus:border-accent"
      />
      {status === "error" && <p className="text-xs text-danger">{mensagemErro}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-1 h-9 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "Criando..." : "Criar pasta"}
        </button>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="h-9 px-3 rounded-lg text-sm text-text-muted"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
