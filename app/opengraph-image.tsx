import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "zintz — tudo que você salva, num só lugar.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const [outfit800, outfit600] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Outfit-800.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Outfit-600.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#1D4ED8",
        }}
      >
        <svg width={140} height={140} viewBox="0 0 96 96">
          <rect width="96" height="96" rx="32" fill="#FFFFFF" />
          <path d="M30 20Q30 14 36 14H60Q66 14 66 20V80L48 66L30 80Z" fill="#1D4ED8" />
          <path
            d="M39 33H57L39 51H57"
            stroke="#FFFFFF"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
            color: "#FFFFFF",
            display: "flex",
          }}
        >
          zintz
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, color: "#BFDBFE", display: "flex" }}>
          Tudo que você salva, num só lugar.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: outfit800, weight: 800, style: "normal" },
        { name: "Outfit", data: outfit600, weight: 600, style: "normal" },
      ],
    }
  );
}
