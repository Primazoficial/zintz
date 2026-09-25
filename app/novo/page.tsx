"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import FluxoSalvarLink from "@/app/components/FluxoSalvarLink";

// Quando o link chega pelo compartilhamento nativo do Android (Web Share Target),
// alguns apps (ex: TikTok) colocam a URL dentro de "text" em vez do campo "url".
function extrairUrlDoTexto(texto: string): string | null {
  const match = texto.match(/https?:\/\/\S+/);
  return match ? match[0] : null;
}

function NovoItemComShareTarget() {
  const searchParams = useSearchParams();
  const [sourceUrlInicial] = useState(() => {
    const texto = searchParams.get("text") ?? "";
    return searchParams.get("url") || extrairUrlDoTexto(texto) || "";
  });
  const [captionInicial] = useState(() => {
    const titulo = searchParams.get("title") ?? "";
    const texto = searchParams.get("text") ?? "";
    const urlRecebida = searchParams.get("url") ?? "";
    const urlDetectada = urlRecebida || extrairUrlDoTexto(texto) || "";
    const restoDoTexto = urlDetectada ? texto.replace(urlDetectada, "").trim() : texto;
    return [titulo, restoDoTexto].filter(Boolean).join("\n").trim();
  });

  return (
    <FluxoSalvarLink
      sourceUrlInicial={sourceUrlInicial}
      captionInicial={captionInicial}
      variante="pagina"
    />
  );
}

export default function NovoItem() {
  return (
    <Suspense fallback={<div className="flex flex-col flex-1" />}>
      <NovoItemComShareTarget />
    </Suspense>
  );
}
