import Link from "next/link";
import Logo from "./Logo";
import BotaoSair from "./BotaoSair";

export default function Cabecalho({
  titulo,
  acao,
}: {
  titulo?: React.ReactNode;
  acao?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 py-4 bg-bg-surface border-b border-border">
      <div className="flex items-center gap-2 min-w-0">
        <Link href="/" className="shrink-0 flex items-center" aria-label="Ir para a página inicial">
          <Logo size={30} />
        </Link>
        {titulo && (
          <>
            <span className="text-text-muted shrink-0">›</span>
            <span className="text-sm font-medium text-text-secondary truncate min-w-0">{titulo}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {acao}
        <BotaoSair className="h-11 px-1 text-sm text-text-muted hover:text-text-secondary transition-colors" />
      </div>
    </header>
  );
}
