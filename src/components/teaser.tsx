import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Stage = "load" | "reveal" | "idle";

const LOAD_MS = 4200;
const HOLD_MS = 700;
const IDLE_AFTER_MS = 3400;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutQuad(t: number) {
  return t * (2 - t);
}

function padCount(value: number) {
  return String(Math.round(value * 100)).padStart(3, "0");
}

function Word({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <span className="word">
      {Array.from(text).map((ch, i) => (
        <span
          key={`${text}-${i}`}
          className="letter-clip"
          style={{ ["--i" as string]: offset + i } as CSSProperties}
        >
          <span className="letter-inner">{ch}</span>
        </span>
      ))}
    </span>
  );
}

export function Teaser() {
  const rootRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
  const skippedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const ptr = useRef({
    x: 0.5,
    y: 0.5,
    nx: 0,
    ny: 0,
    cx: 0,
    cy: 0,
    tx: 0.5,
    ty: 0.5,
    tnx: 0,
    tny: 0,
  });

  const [stage, setStage] = useState<Stage>("load");
  const [didSkip, setDidSkip] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [onLink, setOnLink] = useState(false);
  const [cursorReady, setCursorReady] = useState(false);

  const finish = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    const root = rootRef.current;
    if (root) root.style.setProperty("--load", "1");
    if (countRef.current) countRef.current.textContent = "100";
    setDidSkip(true);
    setStage("idle");
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const sync = () => setFinePointer(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      skippedRef.current = true;
      const root = rootRef.current;
      if (root) root.style.setProperty("--load", "1");
      if (countRef.current) countRef.current.textContent = "100";
      setDidSkip(true);
      setStage("idle");
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (skippedRef.current) return;
      const t = Math.min(1, (now - start) / LOAD_MS);
      const eased = easeOutQuad(t);
      const root = rootRef.current;
      if (root) root.style.setProperty("--load", String(eased));
      if (countRef.current) countRef.current.textContent = padCount(eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const revealId = window.setTimeout(() => {
        if (!skippedRef.current) setStage("reveal");
      }, HOLD_MS);
      const idleId = window.setTimeout(() => {
        if (!skippedRef.current) setStage("idle");
      }, HOLD_MS + IDLE_AFTER_MS);
      timersRef.current.push(revealId, idleId);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
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
    const root = rootRef.current;
    if (!root) return;

    const onMove = (event: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      ptr.current.tx = event.clientX / w;
      ptr.current.ty = event.clientY / h;
      ptr.current.tnx = (event.clientX / w - 0.5) * 2;
      ptr.current.tny = (event.clientY / h - 0.5) * 2;
      const target = event.target;
      if (target instanceof Element) {
        setOnLink(Boolean(target.closest("a, button")));
      }
      setCursorReady(true);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      const p = ptr.current;
      p.x += (p.tx - p.x) * 0.12;
      p.y += (p.ty - p.y) * 0.12;
      p.nx += (p.tnx - p.nx) * 0.1;
      p.ny += (p.tny - p.ny) * 0.1;
      p.cx += (p.tx * window.innerWidth - p.cx) * 0.22;
      p.cy += (p.ty * window.innerHeight - p.cy) * 0.22;
      root.style.setProperty("--nx", p.nx.toFixed(4));
      root.style.setProperty("--ny", p.ny.toFixed(4));
      root.style.setProperty("--split", Math.min(1, Math.hypot(p.nx, p.ny)).toFixed(4));
      root.style.setProperty("--pointer-x", p.x.toFixed(4));
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.transform = `translate3d(${p.cx}px, ${p.cy}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const interactive = stage !== "idle";

  return (
    <main
      ref={rootRef}
      className={cn("teaser", didSkip && "is-instant", finePointer && cursorReady && "has-cursor")}
      data-stage={stage}
      onContextMenu={(event) => event.preventDefault()}
      onClick={(event) => {
        if (!interactive) return;
        if (event.target instanceof Element && event.target.closest("a, button")) return;
        finish();
      }}
    >
      <div className="grain" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="rainbow-bar" aria-hidden>
        <span className="rainbow-fill" />
        <span className="rainbow-sheen" />
      </div>

      {finePointer && cursorReady ? (
        <div
          ref={cursorRef}
          className={cn("void-cursor", onLink && "is-link")}
          aria-hidden
        />
      ) : null}

      {interactive ? (
        <button type="button" className="skip" onClick={finish}>
          Přeskočit
        </button>
      ) : null}

      <header className="chrome chrome-top">
        <p>{site.brand}</p>
        <p>2026</p>
      </header>

      <section className="stage" aria-live="polite">
        <p ref={countRef} className="counter" aria-hidden={stage !== "load"}>
          000
        </p>

        <div className="lockup">
          <h1 className="wordmark">
            <Word text="STUDIO" />
            <Word text="VOID" offset={6} />
          </h1>
          <div className="rule" aria-hidden />
          <p className="kicker">{site.tagline}</p>
        </div>
      </section>

      <footer className="chrome chrome-bottom">
        <p>{site.address.city}</p>
        <nav className="social" aria-label="Sociální sítě">
          <a
            href={site.social.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.social.instagram.label}
          </a>
          <span aria-hidden className="dot" />
          <a
            href={site.social.facebook.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.social.facebook.label}
          </a>
        </nav>
        <div className="chrome-end">
          <a href={site.emailHref}>{site.email}</a>
          <Link to="/soukromi">Soukromí</Link>
        </div>
      </footer>
    </main>
  );
}
