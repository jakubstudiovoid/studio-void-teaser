import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/data/site";

export const Route = createFileRoute("/soukromi")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: `Soukromí — ${site.brand}` },
      {
        name: "description",
        content: "Zásady ochrany soukromí. STUDIO VOID nenasazuje cookies ani analytiku.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function PrivacyPage() {
  return (
    <main className="page-shell mx-auto flex min-h-svh max-w-xl flex-col px-6 py-16 md:py-24">
      <p className="text-2xs tracking-[0.22em] text-muted uppercase">{site.brand}</p>
      <h1 className="mt-6 text-4xl">Soukromí</h1>
      <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted">
        <p>
          Tento teaser je statická stránka. Nenasazujeme cookies, analytiku, reklamní
          pixely ani měřicí skripty třetích stran.
        </p>
        <p>
          Odkazy na Instagram a Facebook vedou na služby, které mají vlastní zásady
          ochrany osobních údajů.
        </p>
        <p>
          Kontakt:{" "}
          <a className="text-fg underline-offset-4 hover:underline" href={site.emailHref}>
            {site.email}
          </a>
        </p>
      </div>
      <Link
        to="/"
        className="mt-14 text-2xs tracking-[0.22em] text-fg uppercase underline-offset-8 hover:underline"
      >
        Zpět
      </Link>
    </main>
  );
}
