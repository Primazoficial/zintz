import Link from "next/link";
import type { PastaComContagem } from "@/app/lib/pastas";

export default function AbasPastas({
  pastas,
  pastaAtualId,
}: {
  pastas: PastaComContagem[];
  pastaAtualId: string;
}) {
  if (pastas.length <= 1) return null;

  return (
    <nav className="flex gap-2 overflow-x-auto px-4 py-3 bg-bg-surface border-b border-border -mx-0">
      {pastas.map((pasta) => {
        const ativa = pasta.id === pastaAtualId;
        return (
          <Link
            key={pasta.id}
            href={`/pastas/${pasta.id}`}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              ativa
                ? "bg-accent-bg border-accent text-accent-text font-medium"
                : "bg-bg-surface-alt border-border text-text-secondary"
            }`}
          >
            {pasta.name}
          </Link>
        );
      })}
    </nav>
  );
}
