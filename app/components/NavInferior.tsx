"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle } from "lucide-react";

const ITENS = [
  { href: "/", label: "Início", Icone: Home },
  { href: "/novo", label: "Novo", Icone: PlusCircle },
] as const;

export default function NavInferior() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-10 flex bg-bg-surface shrink-0"
      style={{
        borderTopLeftRadius: "28px",
        borderTopRightRadius: "28px",
        boxShadow: "0 -4px 16px rgba(11, 42, 111, 0.08)",
      }}
    >
      {ITENS.map(({ href, label, Icone }) => {
        const ativo =
          href === "/" ? pathname === "/" || pathname.startsWith("/pastas") : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px]"
          >
            <Icone size={22} strokeWidth={2} className={ativo ? "text-accent" : "text-text-secondary"} />
            <span className={`text-[11px] font-semibold ${ativo ? "text-accent" : "text-text-secondary"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
