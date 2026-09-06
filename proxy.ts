import { createServerClient } from "@supabase/ssr";
import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const ROTAS_PROTEGIDAS = ["/compras", "/receitas", "/lugares", "/beleza", "/novo", "/listas"];

// /listas/:id/compartilhada é a visão pública somente-leitura de uma lista
// marcada como pública — precisa ficar acessível sem login.
function ehRotaPublicaDeListaCompartilhada(pathname: string): boolean {
  return /^\/listas\/[^/]+\/compartilhada\/?$/.test(pathname);
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const rotaAtual = request.nextUrl.pathname;
  if (ehRotaPublicaDeListaCompartilhada(rotaAtual)) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Erro de infraestrutura (5xx/rede) do serviço de Auth do Supabase — não
  // significa que a sessão é inválida, só que a checagem falhou. Deixa a
  // navegação seguir; o acesso a dados continua protegido pelas policies de RLS.
  if (error && isAuthRetryableFetchError(error)) {
    return response;
  }

  const precisaAuth = ROTAS_PROTEGIDAS.some((rota) => rotaAtual.startsWith(rota));

  if (precisaAuth && !user) {
    const destinoComQuery = rotaAtual + request.nextUrl.search;
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.search = "";
    url.searchParams.set("next", destinoComQuery);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/compras/:path*",
    "/receitas/:path*",
    "/lugares/:path*",
    "/beleza/:path*",
    "/novo/:path*",
    "/listas/:path*",
  ],
};
