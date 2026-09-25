"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, ChevronRight } from "lucide-react";
import Cabecalho from "./Cabecalho";
import NavInferior from "./NavInferior";
import { LIMITE_PASTAS, type PastaComContagem } from "@/app/lib/pastas";
import type { ResultadoExtracao } from "@/app/lib/extracao";

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

// "pagina" é o fluxo completo de /novo (cabeçalho próprio, legenda e URL de
// imagem opcionais); "embutido" é a versão compacta usada no cartão de
// destaque da Home — só o campo de link, sem cabeçalho próprio. A lógica de
// classificar/salvar é a mesma nos dois casos.
export default function FluxoSalvarLink({
  sourceUrlInicial = "",
  captionInicial = "",
  variante = "pagina",
}: {
  sourceUrlInicial?: string;
  captionInicial?: string;
  variante?: "pagina" | "embutido";
}) {
  const router = useRouter();
  const paginaCompleta = variante === "pagina";
  const [sourceUrl, setSourceUrl] = useState(sourceUrlInicial);
  const [caption, setCaption] = useState(captionInicial);
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
    const conteudo = (
      <div
        className={`${
          paginaCompleta ? "flex-1" : ""
        } p-5 flex flex-col items-center justify-center gap-5 text-center`}
      >
        {pastaSugerida ? (
          <>
            <p className="text-lg text-text-primary">
              Salvar em <strong>{pastaSugerida.name}</strong>?
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => salvarEm(pastaSugerida.id, extraido)}
                className="h-[50px] rounded-2xl bg-accent text-white font-extrabold hover:opacity-90 transition-opacity"
              >
                Salvar em {pastaSugerida.name}
              </button>
              <button
                onClick={() => setEtapa({ nome: "escolhendo", extraido, pastas })}
                className="h-11 rounded-2xl text-sm text-text-secondary border border-border hover:border-accent transition-colors"
              >
                Outra pasta
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setEtapa({ nome: "escolhendo", extraido, pastas })}
            className="h-[50px] px-6 rounded-2xl bg-accent text-white font-extrabold hover:opacity-90 transition-opacity"
          >
            Escolher pasta
          </button>
        )}
      </div>
    );

    if (!paginaCompleta) return conteudo;
    return (
      <div className="flex flex-col flex-1">
        <Cabecalho titulo="Novo item" />
        {conteudo}
        <NavInferior />
      </div>
    );
  }

  if (etapa.nome === "escolhendo") {
    const { extraido, pastas } = etapa;
    const conteudo = (
      <div className={`${paginaCompleta ? "flex-1" : ""} p-5 flex flex-col gap-4 max-w-md mx-auto w-full`}>
        <ul className="flex flex-col gap-2">
          {pastas.map((pasta) => (
            <li key={pasta.id}>
              <button
                onClick={() => salvarEm(pasta.id, extraido)}
                className="w-full flex items-center justify-between gap-3 bg-bg-surface p-4 text-left hover:-translate-y-0.5 transition-transform"
                style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}
              >
                <span className="font-semibold text-text-primary">{pasta.name}</span>
                <span className="flex items-center gap-1.5 text-xs text-text-secondary shrink-0">
                  {pasta.itens === 0 ? "Vazia" : `${pasta.itens} ${pasta.itens === 1 ? "item" : "itens"}`}
                  <ChevronRight size={16} className="text-text-muted" />
                </span>
              </button>
            </li>
          ))}
        </ul>

        {pastas.length < LIMITE_PASTAS && (
          <div
            className="flex flex-col gap-2 bg-bg-surface border border-dashed border-border p-3"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <input
              type="text"
              value={novaPastaNome}
              onChange={(e) => setNovaPastaNome(e.target.value)}
              placeholder="Nome da nova pasta"
              className="h-11 rounded-2xl bg-field-bg px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent transition-shadow"
            />
            <button
              onClick={() => criarPastaESalvar(extraido)}
              disabled={!novaPastaNome.trim()}
              className="h-11 rounded-2xl bg-accent-bg text-accent-text text-sm font-semibold disabled:opacity-50"
            >
              Criar pasta e salvar aqui
            </button>
          </div>
        )}
      </div>
    );

    if (!paginaCompleta) return conteudo;
    return (
      <div className="flex flex-col flex-1">
        <Cabecalho titulo="Escolher pasta" />
        {conteudo}
        <NavInferior />
      </div>
    );
  }

  const formulario = (
    <form
      onSubmit={classificar}
      className={`flex flex-col gap-4 bg-bg-surface p-5 ${paginaCompleta ? "max-w-md mx-auto" : ""}`}
      style={{ borderRadius: "var(--radius-card-hero)", boxShadow: "var(--shadow-hero)" }}
    >
      {paginaCompleta && (
        <p className="text-sm text-text-secondary">
          Cole o link do vídeo/post do TikTok, Instagram ou Pinterest. Colar também a legenda
          ajuda bastante a IA a identificar a pasta certa e extrair os dados.
        </p>
      )}

      <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
        {paginaCompleta && "Link"}
        <span className="relative flex items-center">
          <Link2 size={18} className="absolute left-4 text-accent pointer-events-none" />
          <input
            type="url"
            required
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="Cole o link do post aqui"
            className="h-[50px] w-full rounded-2xl bg-field-bg pl-11 pr-4 text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent transition-shadow"
          />
        </span>
      </label>

      {paginaCompleta && (
        <>
          <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
            Legenda / transcrição (opcional, mas recomendado)
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Cole aqui a legenda do post..."
              className="rounded-2xl bg-field-bg px-4 py-3 text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent transition-shadow resize-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
            URL de uma imagem (opcional)
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="h-[50px] rounded-2xl bg-field-bg px-4 text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent transition-shadow"
            />
          </label>
        </>
      )}

      {etapa.nome === "erro" && <p className="text-sm text-danger">{etapa.mensagem}</p>}

      <button
        type="submit"
        disabled={etapa.nome === "classificando" || etapa.nome === "salvando"}
        className="h-[50px] rounded-2xl bg-accent text-white font-extrabold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {etapa.nome === "classificando"
          ? "Classificando com IA..."
          : etapa.nome === "salvando"
          ? "Salvando..."
          : "Salvar link"}
      </button>
    </form>
  );

  if (!paginaCompleta) return formulario;
  return (
    <div className="flex flex-col flex-1">
      <Cabecalho titulo="Novo item" />
      <div className="flex-1 p-5">{formulario}</div>
      <NavInferior />
    </div>
  );
}
