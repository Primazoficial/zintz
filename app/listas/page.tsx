import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import type { Pasta } from "@/app/lib/pastas";
import Cabecalho from "@/app/components/Cabecalho";
import NavInferior from "@/app/components/NavInferior";
import FormNovaLista from "@/app/components/FormNovaLista";

export default async function Listas() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar?next=/listas");

  const [{ data: listas }, { data: pastas }] = await Promise.all([
    supabase
      .from("lists")
      .select("id, name, is_public, folders(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("folders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col flex-1">
      <Cabecalho titulo="Minhas Listas" />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <FormNovaLista pastas={(pastas ?? []) as Pasta[]} />

        {!listas || listas.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-12">
            Você ainda não criou nenhuma lista.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {listas.map((lista) => {
              const nomeDaPasta = (lista.folders as unknown as { name: string } | null)?.name;
              return (
                <li key={lista.id}>
                  <Link
                    href={`/listas/${lista.id}`}
                    className="flex items-center justify-between bg-bg-surface border border-border rounded-xl px-4 py-3 hover:border-accent transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">{lista.name}</p>
                      <p className="text-xs text-text-muted">{nomeDaPasta ?? "—"}</p>
                    </div>
                    {lista.is_public && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent-bg text-accent-text">
                        Pública
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <NavInferior />
    </div>
  );
}
