export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 bg-bg-page text-center gap-3">
      <h1 className="text-4xl font-bold text-text-primary">
        Zint<span style={{ color: "var(--accent)" }}>z</span>
      </h1>
      <p className="text-text-secondary text-sm">Carregando suas pastas...</p>
    </main>
  );
}
