"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cabecalho from "@/app/components/Cabecalho";
import NavInferior from "@/app/components/NavInferior";

export default function NovoItem() {
  const router = useRouter();
  const [sourceUrl, setSourceUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [mensagemErro, setMensagemErro] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMensagemErro("");

    const resposta = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_url: sourceUrl, caption, image_url: imageUrl }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      setStatus("error");
      setMensagemErro(dados.error ?? "Não foi possível salvar esse link.");
      return;
    }

    router.push(`/${dados.category}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col flex-1">
      <Cabecalho titulo="Novo item" />

      <div className="flex-1 p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
          <p className="text-sm text-text-secondary">
            Cole o link do vídeo/post do TikTok, Instagram ou Pinterest. Colar também a legenda
            ajuda bastante a IA a identificar a categoria certa e extrair os dados.
          </p>

          <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
            Link
            <input
              type="url"
              required
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://www.tiktok.com/..."
              className="h-11 rounded-lg bg-bg-surface border border-border px-3 text-text-primary outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
            Legenda / transcrição (opcional, mas recomendado)
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Cole aqui a legenda do post..."
              className="rounded-lg bg-bg-surface border border-border px-3 py-2 text-text-primary outline-none focus:border-accent resize-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
            URL de uma imagem (opcional)
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="h-11 rounded-lg bg-bg-surface border border-border px-3 text-text-primary outline-none focus:border-accent"
            />
          </label>

          {status === "error" && <p className="text-sm text-danger">{mensagemErro}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="h-12 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === "loading" ? "Classificando com IA..." : "Salvar"}
          </button>
        </form>
      </div>

      <NavInferior />
    </div>
  );
}
