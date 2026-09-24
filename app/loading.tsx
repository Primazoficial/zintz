import Logo from "@/app/components/Logo";

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 bg-bg-page text-center gap-3">
      <Logo size={56} showWordmark />
      <p className="text-text-secondary text-sm">Carregando suas pastas...</p>
    </main>
  );
}
