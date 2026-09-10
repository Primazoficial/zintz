import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Login automático só em dev/LAN — nunca roda em produção nem sem as
// credenciais de dev configuradas, então a tela de /entrar continua valendo
// normalmente para usuários reais.
const emailDev = process.env.DEV_AUTO_LOGIN_EMAIL;
const senhaDev = process.env.DEV_AUTO_LOGIN_SENHA;
const autoLoginAtivo = process.env.NODE_ENV !== "production" && !!emailDev && !!senhaDev;

export async function proxy(request: NextRequest) {
  if (!autoLoginAtivo) return NextResponse.next();

  let response = NextResponse.next({ request });

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
  } = await supabase.auth.getUser();

  if (!user) {
    await supabase.auth.signInWithPassword({ email: emailDev!, password: senhaDev! });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|svg|ico|js|webmanifest)$).*)"],
};
