type LogoProps = {
  size?: number;
  inverted?: boolean;
  showWordmark?: boolean;
  tagline?: boolean;
  className?: string;
};

// Ícone oficial do Zintz: marcador de página ("salvar") com um "Z" estilizado.
// As duas variantes (normal/invertida) espelham exatamente o SVG da
// identidade Beta — mudar aqui atualiza o logo em todo o app de uma vez.
export default function Logo({
  size = 40,
  inverted = false,
  showWordmark = false,
  tagline = false,
  className,
}: LogoProps) {
  const fundo = inverted ? "#FFFFFF" : "#1D4ED8";
  const marcador = inverted ? "#1D4ED8" : "#FFFFFF";
  const traco = inverted ? "#FFFFFF" : "#1D4ED8";
  const corNome = inverted ? "#FFFFFF" : "#0B2A6F";
  const corTagline = inverted ? "#BFDBFE" : "#475569";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        role="img"
        aria-label="Zintz"
        className="shrink-0"
      >
        <rect width="96" height="96" rx="32" fill={fundo} />
        <path d="M30 20Q30 14 36 14H60Q66 14 66 20V80L48 66L30 80Z" fill={marcador} />
        <path
          d="M39 33H57L39 51H57"
          stroke={traco}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className="wordmark text-lg"
            style={{ color: corNome, fontSize: size * 0.45 }}
          >
            zintz
          </span>
          {tagline && (
            <span
              className="font-semibold mt-0.5"
              style={{ color: corTagline, fontSize: 15 }}
            >
              Salva no Zintz
            </span>
          )}
        </span>
      )}
    </span>
  );
}
