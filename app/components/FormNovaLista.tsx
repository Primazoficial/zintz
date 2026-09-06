"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDEM_CATEGORIAS, CATEGORIAS, type CategoriaSlug } from "@/app/lib/categorias";

export default function FormNovaLista() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaSlug>("compras");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [mensagemErro, setMensagemErro] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMensagemErro("");

    const resposta = await fetch("/api/listas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome, category_slug: categoria }),
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
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as CategoriaSlug)}
          className="h-10 rounded-lg bg-bg-page border border-border px-2 text-sm text-text-secondary outline-none"
        >
          {ORDEM_CATEGORIAS.map((slug) => (
            <option key={slug} value={slug}>
              {CATEGORIAS[slug].nome}
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
