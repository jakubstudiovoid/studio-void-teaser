import { Link } from "@tanstack/react-router";
import { site } from "@/data/site";

export function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center bg-bg px-6 text-center text-fg">
      <p className="text-2xs tracking-[0.28em] text-muted uppercase">404</p>
      <h1 className="mt-5 font-display text-4xl font-medium tracking-tight md:text-6xl">
        Mimo void
      </h1>
      <p className="mt-5 max-w-sm text-sm text-muted">Tahle stránka tady není.</p>
      <Link
        to="/"
        className="mt-10 text-2xs tracking-[0.22em] text-fg uppercase underline-offset-8 hover:underline"
      >
        Zpět na {site.brand}
      </Link>
    </main>
  );
}
