import { ImageResponse } from "next/og";

export function generateImageMetadata() {
  return [
    { id: "16", size: { width: 16, height: 16 }, contentType: "image/png" },
    { id: "32", size: { width: 32, height: 32 }, contentType: "image/png" },
  ];
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const tamanho = Number(await id);
  return new ImageResponse(
    (
      <svg width={tamanho} height={tamanho} viewBox="0 0 96 96">
        <rect width="96" height="96" rx="32" fill="#1D4ED8" />
        <path d="M30 20Q30 14 36 14H60Q66 14 66 20V80L48 66L30 80Z" fill="#FFFFFF" />
        <path
          d="M39 33H57L39 51H57"
          stroke="#1D4ED8"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    { width: tamanho, height: tamanho }
  );
}
