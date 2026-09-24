import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import RegistrarServiceWorker from "@/app/components/RegistrarServiceWorker";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zintz.com.br"),
  title: "zintz",
  description:
    "Organize o que você salva do TikTok, Instagram e Pinterest — compras, receitas, lugares para visitar e beleza — num só lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-bg-page text-text-primary">
        <RegistrarServiceWorker />
        {children}
      </body>
    </html>
  );
}
