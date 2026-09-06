// Service worker mínimo — não faz cache nem funciona offline, existe só para
// satisfazer o critério de instalabilidade do Chrome/Android (exigido para o
// Web Share Target funcionar, ver app/manifest.ts).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // deixa passar direto pra rede
});
