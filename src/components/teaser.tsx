import { useCallback, useEffect, useRef, useState } from "react";
import { LiquidGlassLogo } from "@/components/liquid-glass-logo";
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
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest("a")) return;
        finish();
      }}
    >
      <div className="lockup">
        <h1 className="sr-only">STUDIO VOID</h1>
        <LiquidGlassLogo
          logo="/studio-void-mark.png"
          ending="logo"
          logoSize={216}
          logoScale={0.92}
          finalLogoScale={1}
          logoColor="#f3eee6"
          logoRelief={0.22}
          tileColor="#090908"
          background="#000000"
          depth={1.35}
          dispersion={0.62}
          relief={0.48}
          caustics={0.9}
          highlights={0.78}
          bloom={0.38}
          echoTint={0.22}
          dropSize={0.28}
          dropStrength={0.94}
          innerWallFocus={0.62}
          decay={2.1}
          speed={0.55}
          loop={false}
          aria-label="STUDIO VOID"
          style={{ height: 480 }}
        />
        <p className="kicker">{site.tagline}</p>
      </div>
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
    </main>
  );
}
