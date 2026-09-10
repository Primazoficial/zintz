import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import type { SavedItem } from "@/app/lib/pastas";
import CardItem from "@/app/components/CardItem";

export default async function ListaCompartilhada({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: lista } = await supabase
    .from("lists")
    .select("id, name, is_public")
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (!lista) notFound();

  const { data: linhas } = await supabase
    .from("list_items")
    .select("saved_items(*)")
    .eq("list_id", id);

  const itens = (linhas ?? [])
    .map((linha) => linha.saved_items as unknown as SavedItem)
    .filter(Boolean);

  return (
    <div className="flex flex-col flex-1 bg-bg-page">
      <header className="flex items-center justify-between px-5 py-4 bg-bg-surface border-b border-border">
        <div>
          <p className="text-xs text-text-muted">
            Zint<span style={{ color: "var(--accent)" }}>z</span>
          </p>
          <h1 className="text-lg font-semibold text-text-primary">{lista.name}</h1>
        </div>
        <Link href="/" className="text-sm" style={{ color: "var(--accent-text)" }}>
          Conhecer o Zintz
        </Link>
      </header>

      <div className="flex-1 p-4">
        {itens.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-16">Essa lista ainda está vazia.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {itens.map((item) => (
              <CardItem key={item.id} item={item} editavel={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
