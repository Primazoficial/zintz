import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(
    (
      <svg width={512} height={512} viewBox="0 0 96 96">
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
    { width: 512, height: 512 }
  );
}
