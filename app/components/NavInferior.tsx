"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ORDEM_CATEGORIAS, CATEGORIAS } from "@/app/lib/categorias";

export default function NavInferior() {
  const pathname = usePathname();

  const abas = [
    ...ORDEM_CATEGORIAS.map((slug) => ({ href: `/${slug}`, label: CATEGORIAS[slug].nome })),
    { href: "/listas", label: "Listas" },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-bg-surface border-t border-border flex justify-around py-2 z-10">
      {abas.map((aba) => {
        const ativo = pathname === aba.href || pathname.startsWith(`${aba.href}/`);
        return (
          <Link
            key={aba.href}
            href={aba.href}
            className={`flex-1 text-center text-xs py-1.5 rounded-md mx-1 transition-colors ${
              ativo ? "bg-accent-bg font-semibold" : "text-text-secondary"
            }`}
            style={ativo ? { color: "var(--accent-text)" } : undefined}
          >
            {aba.label}
          </Link>
        );
      })}
    </nav>
  );
}
