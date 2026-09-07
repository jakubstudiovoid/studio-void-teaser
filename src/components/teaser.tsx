import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Teaser() {
  const canSkip = useRef(true);
  const [ready, setReady] = useState(false);
  const [instant, setInstant] = useState(false);

  const finish = useCallback(() => {
    if (!canSkip.current) return;
    canSkip.current = false;
    setInstant(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      canSkip.current = false;
      setInstant(true);
      setReady(true);
      return;
    }
    const start = window.setTimeout(() => setReady(true), 60);
    const lock = window.setTimeout(() => {
      canSkip.current = false;
    }, 4200);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(lock);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  return (
    <main
      className={cn("teaser", instant && "is-instant")}
      data-stage={ready ? "idle" : "boot"}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest("a")) return;
        finish();
      }}
    >
      <div className="lockup">
        <h1 className="wordmark">
          <span>STUDIO</span>
          <span>VOID</span>
        </h1>
        <p className="kicker">{site.tagline}</p>
        <nav className="social" aria-label="Sociální sítě">
          <a
            href={site.social.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.social.instagram.label}
          </a>
          <a
            href={site.social.facebook.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.social.facebook.label}
          </a>
        </nav>
      </div>
    </main>
  );
}
