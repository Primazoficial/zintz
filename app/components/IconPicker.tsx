"use client";

import { useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { EMOJIS_PADRAO } from "@/app/lib/pastas";

export type ValorIcone = { icon_emoji: string | null; icon_image_url: string | null };

export default function IconPicker({
  valor,
  onChange,
}: {
  valor: ValorIcone;
  onChange: (valor: ValorIcone) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function enviarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;

    setErro("");
    setEnviando(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Sessão expirada, entre novamente.");
      setEnviando(false);
      return;
    }

    const extensao = arquivo.name.split(".").pop() || "jpg";
    const caminho = `${user.id}/${crypto.randomUUID()}.${extensao}`;

    const { error } = await supabase.storage.from("pasta-icones").upload(caminho, arquivo);

    setEnviando(false);

    if (error) {
      setErro("Não foi possível enviar a foto.");
      return;
    }

    const { data } = supabase.storage.from("pasta-icones").getPublicUrl(caminho);
    onChange({ icon_emoji: null, icon_image_url: data.publicUrl });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-lg bg-bg-surface-alt flex items-center justify-center text-2xl overflow-hidden shrink-0">
          {valor.icon_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={valor.icon_image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            valor.icon_emoji ?? "📁"
          )}
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={enviando}
          className="text-xs font-medium disabled:opacity-50"
          style={{ color: "var(--accent-text)" }}
        >
          {enviando ? "Enviando..." : "Enviar foto"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={enviarFoto}
          className="hidden"
        />
      </div>

      {erro && <p className="text-xs text-danger">{erro}</p>}

      <div className="grid grid-cols-8 gap-1">
        {EMOJIS_PADRAO.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange({ icon_emoji: emoji, icon_image_url: null })}
            className={`h-8 w-8 rounded-md flex items-center justify-center text-lg transition-colors ${
              !valor.icon_image_url && valor.icon_emoji === emoji
                ? "bg-accent-bg border border-accent"
                : "hover:bg-bg-surface-alt"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
