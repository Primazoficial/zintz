"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavInferior() {
  const pathname = usePathname();

  const abas = [
    { href: "/", label: "Início" },
    { href: "/listas", label: "Listas" },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-bg-surface border-t border-border flex justify-around py-2 z-10">
      {abas.map((aba) => {
        const ativo =
          aba.href === "/" ? pathname === "/" || pathname.startsWith("/pastas") : pathname.startsWith(aba.href);
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
