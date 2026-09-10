import Link from "next/link";
import { aparenciaDaPasta, type PastaComContagem } from "@/app/lib/pastas";

export default function PastasGrid({ pastas }: { pastas: PastaComContagem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {pastas.map((pasta) => {
        const aparencia = aparenciaDaPasta(pasta);
        return (
          <Link
            key={pasta.id}
            href={`/pastas/${pasta.id}`}
            className="flex flex-col gap-2 bg-bg-surface border border-border rounded-xl p-4 hover:border-accent transition-colors"
          >
            <span
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ background: aparencia.corAcentoBg }}
            >
              {aparencia.icone}
            </span>
            <span className="text-sm font-medium text-text-primary line-clamp-2">{pasta.name}</span>
            <span className="text-xs text-text-muted">
              {pasta.itens === 0 ? "Vazia" : `${pasta.itens} ${pasta.itens === 1 ? "item" : "itens"}`}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
