export function detectarPlataforma(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("tiktok.com")) return "tiktok";
    if (host.includes("instagram.com")) return "instagram";
    if (host.includes("pinterest.")) return "pinterest";
    return null;
  } catch {
    return null;
  }
}
