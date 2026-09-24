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
    <nav className="flex gap-2 overflow-x-auto px-4 py-3 bg-bg-surface border-b border-border">
      {pastas.map((pasta) => {
        const ativa = pasta.id === pastaAtualId;
        return (
          <Link
            key={pasta.id}
            href={`/pastas/${pasta.id}`}
            className={`shrink-0 flex items-center h-10 px-4 rounded-full text-sm font-semibold transition-colors ${
              ativa ? "bg-navy text-white" : "bg-bg-surface-alt text-navy"
            }`}
          >
            {pasta.name}
          </Link>
        );
      })}
    </nav>
  );
}
