import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zintz",
    short_name: "Zintz",
    description:
      "Organize o que você salva do TikTok, Instagram e Pinterest — compras, receitas, lugares para visitar e beleza — num só lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF9",
    theme_color: "#2F6FED",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
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
