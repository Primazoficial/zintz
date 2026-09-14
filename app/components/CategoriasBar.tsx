import type { FolderCategoria } from "@/app/lib/pastas";

export default function CategoriasBar({
  categorias,
  categoriaAtivaId,
  onSelecionar,
}: {
  categorias: FolderCategoria[];
  categoriaAtivaId: string | null;
  onSelecionar: (id: string | null) => void;
}) {
  if (categorias.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 px-4 pt-3">
      <span className="text-xs font-medium text-text-muted">Categorias</span>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => onSelecionar(null)}
          className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
            categoriaAtivaId === null
              ? "bg-accent-bg border-accent text-accent-text"
              : "bg-bg-surface-alt border-border text-text-secondary"
          }`}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => onSelecionar(categoria.id)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              categoriaAtivaId === categoria.id
                ? "bg-accent-bg border-accent text-accent-text"
                : "bg-bg-surface-alt border-border text-text-secondary"
            }`}
          >
            {categoria.name}
          </button>
        ))}
      </div>
    </div>
  );
}
