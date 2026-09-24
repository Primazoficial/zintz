import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width={180} height={180} viewBox="0 0 96 96">
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
    { ...size }
  );
}
