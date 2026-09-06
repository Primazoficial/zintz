"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { senhaValida, traduzirErroAuth } from "@/app/lib/auth-validacao";

function EntrarConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const proximo = searchParams.get("next") ?? "/compras";
  const [modo, setModo] = useState<"login" | "cadastro" | "recuperar">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "aguardando-confirmacao" | "recuperacao-enviada"
  >("idle");
  const [mensagemErro, setMensagemErro] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMensagemErro("");

    if (modo === "recuperar") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/entrar`,
      });
      if (error && error.code !== "over_email_send_rate_limit") {
        setStatus("recuperacao-enviada");
        return;
      }
      if (error) {
        setStatus("error");
        setMensagemErro(traduzirErroAuth(error));
        return;
      }
      setStatus("recuperacao-enviada");
      return;
    }

    if (modo === "cadastro" && !senhaValida(senha)) {
      setStatus("error");
      setMensagemErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (modo === "cadastro") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(proximo)}`,
        },
      });
      if (error) {
        setStatus("error");
        setMensagemErro(traduzirErroAuth(error));
        return;
      }
      if (!data.session) {
        setStatus("aguardando-confirmacao");
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) {
        setStatus("error");
        setMensagemErro(traduzirErroAuth(error));
        return;
      }
    }

    router.push(proximo);
    router.refresh();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-bg-page">
      <h1 className="text-3xl font-bold text-text-primary">
        Zint<span style={{ color: "var(--accent)" }}>z</span>
      </h1>

      <p className="text-text-secondary text-sm mt-3 mb-8">
        {modo === "cadastro"
          ? "Crie sua conta para começar"
          : modo === "recuperar"
          ? "Digite seu e-mail para redefinir a senha"
          : "Entre na sua conta"}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
          className="w-full h-12 rounded-lg bg-bg-surface border border-border px-4 text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
        />

        {modo !== "recuperar" && (
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
            className="w-full h-12 rounded-lg bg-bg-surface border border-border px-4 text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
          />
        )}

        {modo === "login" && (
          <button
            type="button"
            onClick={() => {
              setModo("recuperar");
              setStatus("idle");
              setMensagemErro("");
            }}
            className="text-text-muted text-xs -mt-2 self-end hover:text-text-secondary transition-colors"
          >
            Esqueci minha senha
          </button>
        )}

        {status === "aguardando-confirmacao" && (
          <p className="text-sm" style={{ color: "var(--accent-text)" }}>
            Cadastro quase pronto! Enviamos um link de confirmação para {email} — clique nele para
            ativar sua conta.
          </p>
        )}

        {status === "recuperacao-enviada" && (
          <p className="text-sm" style={{ color: "var(--accent-text)" }}>
            Se {email} estiver cadastrado, enviamos um link de redefinição de senha.
          </p>
        )}

        {status === "error" && <p className="text-sm text-danger">{mensagemErro}</p>}

        <button
          type="submit"
          disabled={status === "loading" || status === "recuperacao-enviada"}
          className="w-full h-12 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading"
            ? "Aguarde..."
            : modo === "cadastro"
            ? "Criar conta"
            : modo === "recuperar"
            ? "Enviar link de redefinição"
            : "Entrar"}
        </button>
      </form>

      <button
        onClick={() => {
          setModo(modo === "login" ? "cadastro" : "login");
          setSenha("");
          setStatus("idle");
          setMensagemErro("");
        }}
        className="text-text-secondary text-sm mt-6 hover:text-text-primary transition-colors"
      >
        {modo === "cadastro" ? "Já tem conta? Entrar" : modo === "recuperar" ? "Lembrou a senha? Entrar" : "Não tem conta? Criar agora"}
      </button>
    </main>
  );
}

export default function Entrar() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-bg-page">
          <p className="text-text-muted text-sm">Carregando...</p>
        </main>
      }
    >
      <EntrarConteudo />
    </Suspense>
  );
}
