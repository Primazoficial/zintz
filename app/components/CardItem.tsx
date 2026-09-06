import type {
  CategoriaSlug,
  DetalhesCompras,
  DetalhesBeleza,
  DetalhesLugares,
  SavedItem,
} from "@/app/lib/categorias";

function linkDoItem(item: SavedItem): string {
  return item.affiliate_url ?? item.original_url ?? item.source_url;
}

function LinhaSecundaria({ categoria, item }: { categoria: CategoriaSlug; item: SavedItem }) {
  if (categoria === "compras" || categoria === "beleza") {
    const detalhes = item.details as DetalhesCompras | DetalhesBeleza | null;
    return (
      <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-accent-bg text-accent-text truncate max-w-full">
        {detalhes?.likely_store ?? "Loja não identificada"}
      </span>
    );
  }

  if (categoria === "receitas") {
    const detalhes = item.details as { prep_time?: string } | null;
    return <p className="text-xs text-text-muted mt-1">{detalhes?.prep_time ?? "Tempo não informado"}</p>;
  }

  const detalhes = item.details as DetalhesLugares | null;
  return <p className="text-xs text-text-muted mt-1">{detalhes?.location ?? "Local não informado"}</p>;
}

export default function CardItem({ categoria, item }: { categoria: CategoriaSlug; item: SavedItem }) {
  return (
    <a
      href={linkDoItem(item)}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="block bg-bg-surface border border-border rounded-xl overflow-hidden hover:border-accent transition-colors"
    >
      <div className="aspect-square bg-bg-surface-alt flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.title ?? ""} className="w-full h-full object-cover" />
        ) : (
          <span className="text-text-muted text-xs">Sem imagem</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-text-primary line-clamp-2">
          {item.title ?? "Sem título"}
        </p>
        <LinhaSecundaria categoria={categoria} item={item} />
      </div>
    </a>
  );
}
