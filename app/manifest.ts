import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "zintz",
    short_name: "zintz",
    description:
      "Organize o que você salva do TikTok, Instagram e Pinterest — compras, receitas, lugares para visitar e beleza — num só lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F8FF",
    theme_color: "#1D4ED8",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
    share_target: {
      action: "/novo",
      method: "GET",
      params: {
        title: "title",
        text: "text",
        url: "url",
      },
    },
  };
}
