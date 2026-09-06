import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zitz",
  description:
    "Organize o que você salva do TikTok, Instagram e Pinterest — compras, receitas, lugares para visitar e beleza — num só lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-bg-page text-text-primary">
        {children}
      </body>
    </html>
  );
}
