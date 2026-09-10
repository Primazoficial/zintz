"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TituloPasta({ pastaId, nome }: { pastaId: string; nome: string }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(nome);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    const novoNome = valor.trim();
    if (!novoNome || novoNome === nome) {
      setValor(nome);
      setEditando(false);
      return;
    }
    setSalvando(true);
    await fetch(`/api/pastas/${pastaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: novoNome }),
    });
    setSalvando(false);
    setEditando(false);
    router.refresh();
  }

  if (editando) {
    return (
      <input
        autoFocus
        value={valor}
        disabled={salvando}
        onChange={(e) => setValor(e.target.value)}
        onBlur={salvar}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setValor(nome);
            setEditando(false);
          }
        }}
        className="text-lg font-semibold text-text-primary bg-transparent border-b border-accent outline-none min-w-0"
      />
    );
  }

  return (
    <button
      onClick={() => setEditando(true)}
      className="text-lg font-semibold text-text-primary truncate text-left"
      title="Toque para renomear"
    >
      {nome}
    </button>
  );
}
