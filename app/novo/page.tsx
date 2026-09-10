"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cabecalho from "@/app/components/Cabecalho";
import NavInferior from "@/app/components/NavInferior";
import { LIMITE_PASTAS, type PastaComContagem } from "@/app/lib/pastas";
import type { ResultadoExtracao } from "@/app/lib/extracao";

// Quando o link chega pelo compartilhamento nativo do Android (Web Share Target),
// alguns apps (ex: TikTok) colocam a URL dentro de "text" em vez do campo "url".
function extrairUrlDoTexto(texto: string): string | null {
  const match = texto.match(/https?:\/\/\S+/);
  return match ? match[0] : null;
}

type Etapa =
  | { nome: "formulario" }
  | { nome: "classificando" }
  | {
      nome: "confirmando";
      extraido: ResultadoExtracao;
      pastaSugerida: PastaComContagem | null;
      pastas: PastaComContagem[];
    }
  | {
      nome: "escolhendo";
      extraido: ResultadoExtracao;
      pastas: PastaComContagem[];
    }
  | { nome: "salvando" }
  | { nome: "erro"; mensagem: string };

function FormularioNovoItem() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sourceUrl, setSourceUrl] = useState(() => {
    const texto = searchParams.get("text") ?? "";
    return searchParams.get("url") || extrairUrlDoTexto(texto) || "";
  });
  const [caption, setCaption] = useState(() => {
    const titulo = searchParams.get("title") ?? "";
    const texto = searchParams.get("text") ?? "";
    const urlRecebida = searchParams.get("url") ?? "";
    const urlDetectada = urlRecebida || extrairUrlDoTexto(texto) || "";
    const restoDoTexto = urlDetectada ? texto.replace(urlDetectada, "").trim() : texto;
    return [titulo, restoDoTexto].filter(Boolean).join("\n").trim();
  });
  const [imageUrl, setImageUrl] = useState("");
  const [etapa, setEtapa] = useState<Etapa>({ nome: "formulario" });
  const [novaPastaNome, setNovaPastaNome] = useState("");

  async function classificar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEtapa({ nome: "classificando" });

    const resposta = await fetch("/api/items/classificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_url: sourceUrl, caption }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      setEtapa({ nome: "erro", mensagem: dados.error ?? "Não foi possível classificar esse link." });
      return;
    }

    setEtapa({
      nome: "confirmando",
      extraido: dados.extraido,
      pastaSugerida: dados.pastaSugerida,
      pastas: dados.pastas,
    });
  }

  async function salvarEm(folderId: string, extraido: ResultadoExtracao) {
    setEtapa({ nome: "salvando" });

    const resposta = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_url: sourceUrl,
        image_url: imageUrl,
        folder_id: folderId,
        extraido,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      setEtapa({ nome: "erro", mensagem: dados.error ?? "Não foi possível salvar esse link." });
      return;
    }

    router.push(`/pastas/${folderId}`);
    router.refresh();
  }

  async function criarPastaESalvar(extraido: ResultadoExtracao) {
    const nome = novaPastaNome.trim();
    if (!nome) return;

    setEtapa({ nome: "salvando" });

    const resposta = await fetch("/api/pastas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      setEtapa({ nome: "erro", mensagem: dados.error ?? "Não foi possível criar a pasta." });
      return;
    }

    await salvarEm(dados.pasta.id, extraido);
  }

  if (etapa.nome === "confirmando") {
    const { extraido, pastaSugerida, pastas } = etapa;
    return (
      <div className="flex flex-col flex-1">
        <Cabecalho titulo="Novo item" />
        <div className="flex-1 p-5 flex flex-col items-center justify-center gap-5 text-center">
          {pastaSugerida ? (
            <>
              <p className="text-lg text-text-primary">
                Salvar em <strong>{pastaSugerida.name}</strong>?
              </p>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={() => salvarEm(pastaSugerida.id, extraido)}
                  className="h-12 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Salvar em {pastaSugerida.name}
                </button>
                <button
                  onClick={() => setEtapa({ nome: "escolhendo", extraido, pastas })}
                  className="h-11 rounded-lg text-sm text-text-secondary border border-border hover:border-accent transition-colors"
                >
                  Outra pasta
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setEtapa({ nome: "escolhendo", extraido, pastas })}
              className="h-12 px-6 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Escolher pasta
            </button>
          )}
        </div>
        <NavInferior />
      </div>
    );
  }

  if (etapa.nome === "escolhendo") {
    const { extraido, pastas } = etapa;
    return (
      <div className="flex flex-col flex-1">
        <Cabecalho titulo="Escolher pasta" />
        <div className="flex-1 p-5 flex flex-col gap-4 max-w-md mx-auto w-full">
          <ul className="flex flex-col gap-2">
            {pastas.map((pasta) => (
              <li key={pasta.id}>
                <button
                  onClick={() => salvarEm(pasta.id, extraido)}
                  className="w-full flex items-center justify-between bg-bg-surface border border-border rounded-lg px-4 py-3 text-left hover:border-accent transition-colors"
                >
                  <span className="text-sm text-text-primary">{pasta.name}</span>
                  <span className="text-xs text-text-muted">
                    {pasta.itens === 0 ? "Vazia" : `${pasta.itens} ${pasta.itens === 1 ? "item" : "itens"}`}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {pastas.length < LIMITE_PASTAS && (
            <div className="flex flex-col gap-2 bg-bg-surface border border-dashed border-border rounded-lg p-3">
              <input
                type="text"
                value={novaPastaNome}
                onChange={(e) => setNovaPastaNome(e.target.value)}
                placeholder="Nome da nova pasta"
                className="h-10 rounded-lg bg-bg-page border border-border px-3 text-sm text-text-primary outline-none focus:border-accent"
              />
              <button
                onClick={() => criarPastaESalvar(extraido)}
                disabled={!novaPastaNome.trim()}
                className="h-10 rounded-lg bg-accent-bg text-sm font-medium disabled:opacity-50"
                style={{ color: "var(--accent-text)" }}
              >
                Criar pasta e salvar aqui
              </button>
            </div>
          )}
        </div>
        <NavInferior />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Cabecalho titulo="Novo item" />

      <div className="flex-1 p-5">
        <form onSubmit={classificar} className="flex flex-col gap-4 max-w-md mx-auto">
          <p className="text-sm text-text-secondary">
            Cole o link do vídeo/post do TikTok, Instagram ou Pinterest. Colar também a legenda
            ajuda bastante a IA a identificar a pasta certa e extrair os dados.
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

          {etapa.nome === "erro" && <p className="text-sm text-danger">{etapa.mensagem}</p>}

          <button
            type="submit"
            disabled={etapa.nome === "classificando" || etapa.nome === "salvando"}
            className="h-12 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {etapa.nome === "classificando"
              ? "Classificando com IA..."
              : etapa.nome === "salvando"
              ? "Salvando..."
              : "Salvar"}
          </button>
        </form>
      </div>

      <NavInferior />
    </div>
  );
}

export default function NovoItem() {
  return (
    <Suspense fallback={<div className="flex flex-col flex-1" />}>
      <FormularioNovoItem />
    </Suspense>
  );
}
