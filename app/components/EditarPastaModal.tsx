"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import IconPicker, { type ValorIcone } from "./IconPicker";
import { aparenciaDaPasta, type Pasta } from "@/app/lib/pastas";

export default function EditarPastaModal({
  pasta,
  onFechar,
}: {
  pasta: Pasta;
  onFechar: () => void;
}) {
  const router = useRouter();
  const [nome, setNome] = useState(pasta.name);
  const [icone, setIcone] = useState<ValorIcone>(() => {
    const aparencia = aparenciaDaPasta(pasta);
    return {
      icon_emoji: aparencia.tipo === "emoji" ? aparencia.emoji : pasta.icon_emoji,
      icon_image_url: pasta.icon_image_url,
    };
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return;

    setSalvando(true);
    setErro("");

    const resposta = await fetch(`/api/pastas/${pasta.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nomeLimpo, ...icone }),
    });

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(dados.error ?? "Não foi possível salvar a pasta.");
      setSalvando(false);
      return;
    }

    setSalvando(false);
    router.refresh();
    onFechar();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
      onClick={onFechar}
    >
      <form
        onSubmit={salvar}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm flex flex-col gap-4 bg-bg-surface border border-border rounded-xl p-5"
      >
        <h2 className="text-sm font-semibold text-text-primary">Editar pasta</h2>

        <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
          Nome
          <input
            autoFocus
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="h-10 rounded-lg bg-bg-page border border-border px-3 text-text-primary outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
          Ícone
          <IconPicker valor={icone} onChange={setIcone} />
        </label>

        {erro && <p className="text-sm text-danger">{erro}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={salvando}
            className="flex-1 h-10 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar"}
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
