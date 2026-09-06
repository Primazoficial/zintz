import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  // Só aceita um path relativo — nunca uma URL absoluta, para não virar um
  // redirecionamento aberto caso o parâmetro seja adulterado.
  const proximo = nextParam && nextParam.startsWith("/") ? nextParam : "/compras";

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${proximo}`);
}
