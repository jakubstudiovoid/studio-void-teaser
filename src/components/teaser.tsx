import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function LockupCopy({ heading }: { heading?: boolean }) {
  return (
    <>
      {heading ? <h1 className="sr-only">STUDIO VOID</h1> : null}
      <div className="wordmark logo-slot" aria-hidden />
      <p className="kicker">{site.tagline}</p>
    </>
  );
}

export function Teaser() {
  const rootRef = useRef<HTMLElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const canSkip = useRef(true);
  const [ready, setReady] = useState(false);
  const [instant, setInstant] = useState(false);
  const [still, setStill] = useState(false);

  const finish = useCallback(() => {
    if (!canSkip.current) return;
    canSkip.current = false;
    setInstant(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      canSkip.current = false;
      setStill(true);
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

  useEffect(() => {
    if (still) return;
    const root = rootRef.current;
    const lockup = lockupRef.current;
    if (!root || !lockup) return;

    const ptr = { x: 0, y: 0, tx: 0, ty: 0, seeded: false };
    const seed = () => {
      const box = lockup.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      if (!ptr.seeded) {
        ptr.x = cx;
        ptr.y = cy;
        ptr.tx = cx;
        ptr.ty = cy;
        ptr.seeded = true;
      }
      return { cx, cy, box };
    };
    seed();

    const fine = window.matchMedia("(pointer: fine)");
    let follow = fine.matches;

    const onMove = (event: PointerEvent) => {
      ptr.tx = event.clientX;
      ptr.ty = event.clientY;
      follow = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const origin = performance.now();
    const tick = (now: number) => {
      if (!follow) {
        const { cx, cy, box } = seed();
        const t = (now - origin) / 1000;
        ptr.tx = cx + Math.sin(t * 0.32) * Math.min(90, box.width * 0.18);
        ptr.ty = cy + Math.cos(t * 0.24) * Math.min(50, box.height * 0.12);
      }
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;
      const box = lockup.getBoundingClientRect();
      root.style.setProperty("--mx", `${ptr.x.toFixed(1)}px`);
      root.style.setProperty("--my", `${ptr.y.toFixed(1)}px`);
      root.style.setProperty("--lx", `${(ptr.x - box.left).toFixed(1)}px`);
      root.style.setProperty("--ly", `${(ptr.y - box.top).toFixed(1)}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [still]);

  return (
    <main
      ref={rootRef}
      className={cn("teaser", instant && "is-instant", still && "is-still")}
      data-stage={ready ? "idle" : "boot"}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest("a")) return;
        finish();
      }}
    >
      <div className="lamp" aria-hidden />
      <div className="lockup" ref={lockupRef}>
        <div className="mark mark-ghost">
          <LockupCopy heading />
        </div>
        <div className="mark mark-lit" aria-hidden>
          <LockupCopy />
        </div>
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
