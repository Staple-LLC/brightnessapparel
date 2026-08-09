import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, Play } from "lucide-react";
import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";
import { REELS, type Reel } from "@/content/reels";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/content/instagram";

/* One tile. The file stays off the wire until the tile is on screen
   (preload="none"), and playback stops when it leaves — six reels all
   buffering at once is what makes a section like this crawl on a phone. */
function ReelTile({ reel }: { reel: Reel }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const sync = () => {
      frame = 0;
      const rect = video.getBoundingClientRect();
      /* Vertically against the viewport, horizontally against the rail. The
         rail is narrower than the screen, so measuring both axes against the
         viewport counts a tile that has been scrolled past the rail's edge —
         and clipped out of sight — as visible, and keeps it downloading. */
      const rail = video.closest("ul");
      const bounds = rail ? rail.getBoundingClientRect() : null;
      const onScreen =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        (!bounds || (rect.left < bounds.right && rect.right > bounds.left));

      if (still.matches || !onScreen) {
        if (!video.paused) video.pause();
        return;
      }
      if (video.paused) {
        void video.play().catch(() => {
          /* Autoplay refused — the poster stays, which is a fine fallback. */
        });
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    still.addEventListener("change", sync);
    /* The rail scrolls sideways without moving the window, so it needs its own
       listener — a window scroll handler alone never fires for it. */
    const rail = video.closest("ul");
    rail?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      still.removeEventListener("change", sync);
      rail?.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <video
      ref={ref}
      poster={reel.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={reel.caption ?? "Brightness Apparel reel"}
      className="h-full w-full object-cover"
    >
      <source src={reel.video} type="video/mp4" />
    </video>
  );
}

export default function ReelsPage() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflowing(max > 1);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const tile = el.querySelector("li");
    const step = tile ? tile.getBoundingClientRect().width + 16 : el.clientWidth;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * step, behavior: still ? "auto" : "smooth" });
  };

  if (REELS.length === 0) return null;

  return (
    <Section id="reels" label="Reels" tone="dark">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHeading>
            Off the floor, <Quiet>as it happens.</Quiet>
          </SectionHeading>

          <SectionLede>
            Production runs, samples, and finished garments as they leave the
            factory.
          </SectionLede>
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rule inline-flex min-h-[44px] shrink-0 items-center gap-3 self-start rounded-full border px-6 py-3 text-sm transition-opacity hover:opacity-60 sm:self-auto"
        >
          <Instagram className="size-4" strokeWidth={1.5} aria-hidden="true" />
          @{INSTAGRAM_HANDLE}
        </a>
      </div>

      <div className="relative mt-14 sm:mt-20">
        <ul
          ref={trackRef}
          /* A real scroll container rather than a transform: touch momentum,
             trackpad gestures, keyboard scrolling and snap all come free. */
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth motion-reduce:scroll-auto"
        >
          {REELS.map((reel) => (
            <li
              key={reel.stem}
              /* last:snap-end is not decoration. Snap points sit at each tile's
                 offset — 0, 192, 384 … 960 — but the rail only scrolls to 809,
                 so the final tile's start-aligned snap point is past the end
                 and mandatory snap can never rest on it. Aligning the last one
                 to the end puts a snap point exactly at max scroll. */
              className="relative w-44 shrink-0 snap-start overflow-hidden rounded-xl bg-background/[0.06] last:snap-end sm:w-52 lg:w-56"
            >
              <div className="aspect-[9/16]">
                <ReelTile reel={reel} />
              </div>

              {/* Scrim so a caption over bright footage stays readable. */}
              {reel.caption && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent"
                />
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-white">
                <Play className="size-3 shrink-0 fill-current" strokeWidth={0} />
                {reel.caption && (
                  <p className="text-[13px] font-medium leading-snug">
                    {reel.caption}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {overflowing && (
          <>
            <button
              type="button"
              aria-label="Previous reels"
              onClick={() => nudge(-1)}
              disabled={atStart}
              className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 text-black shadow-lg transition hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:block"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next reels"
              onClick={() => nudge(1)}
              disabled={atEnd}
              className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 text-black shadow-lg transition hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:block"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
    </Section>
  );
}
