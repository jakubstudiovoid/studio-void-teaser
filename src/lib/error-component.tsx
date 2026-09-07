import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "Něco se pokazilo. Zkuste stránku načíst znovu.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-fg">
      <p className="text-2xs tracking-[0.28em] text-muted uppercase">chyba</p>
      <h1 className="font-display text-xl font-medium tracking-tight">Něco se pokazilo</h1>
      <p className="max-w-md text-sm break-words text-muted">{errorMessage(error)}</p>
    </main>
  );
}
