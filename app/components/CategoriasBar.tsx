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
      <span className="text-xs font-semibold text-text-muted">Categorias</span>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => onSelecionar(null)}
          className={`shrink-0 flex items-center h-10 px-4 rounded-full text-sm font-semibold transition-colors ${
            categoriaAtivaId === null ? "bg-navy text-white" : "bg-bg-surface-alt text-navy"
          }`}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => onSelecionar(categoria.id)}
            className={`shrink-0 flex items-center h-10 px-4 rounded-full text-sm font-semibold transition-colors ${
              categoriaAtivaId === categoria.id ? "bg-navy text-white" : "bg-bg-surface-alt text-navy"
            }`}
          >
            {categoria.name}
          </button>
        ))}
      </div>
    </div>
  );
}
