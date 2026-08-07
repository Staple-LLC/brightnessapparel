import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, Play } from "lucide-react";
import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";
import {
  POSTS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  type InstagramPost,
} from "@/content/instagram";

/* A reel tile. The file only downloads once the tile is on screen, and playback
   stops the moment it leaves — a wall of reels all buffering at once is the
   thing that makes these sections slow, and there is no point decoding video
   nobody is looking at. preload="none" is what keeps the bytes off the wire
   until then; the poster carries the tile in the meantime. */
function ReelTile({ post, alt }: { post: InstagramPost; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const sync = () => {
      frame = 0;
      const rect = video.getBoundingClientRect();
      /* Half the tile has to be in view before it earns the bandwidth. */
      const visible =
        rect.top < window.innerHeight - rect.height * 0.5 &&
        rect.bottom > rect.height * 0.5;

      if (still.matches || !visible) {
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
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      still.removeEventListener("change", sync);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <video
      ref={ref}
      poster={post.src}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
      className="h-full w-full object-cover"
    >
      <source src={post.video} type="video/mp4" />
    </video>
  );
}

export default function InstagramPage() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  /* The arrows are only meaningful when the row actually overflows, and only
     at the end it can still travel towards. Measured rather than assumed,
     because how many tiles fit depends on the viewport. */
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

  /* Scrolls by whatever a tile actually measures, rather than a hardcoded
     step that would drift as the tile size changes across breakpoints. */
  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const tile = el.querySelector("li");
    const step = tile ? tile.getBoundingClientRect().width + 16 : el.clientWidth;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * step, behavior: still ? "auto" : "smooth" });
  };

  return (
    <Section id="instagram" label="Instagram" tone="dark">
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
          className="rule group inline-flex min-h-[44px] shrink-0 items-center gap-3 self-start rounded-full border px-6 py-3 text-sm transition-opacity hover:opacity-60 sm:self-auto"
        >
          <Instagram className="size-4" strokeWidth={1.5} aria-hidden="true" />
          @{INSTAGRAM_HANDLE}
        </a>
      </div>

      {/* With no posts the band closes on the follow button rather than
          showing an empty rail. The instructions for filling it live in the
          folder's README — a visitor should never be shown a file path. */}
      {POSTS.length === 0 ? null : (
        <div className="relative mt-14 sm:mt-20">
          <ul
            ref={trackRef}
            /* A real scroll container rather than a transform: it gets touch
               momentum, trackpad gestures, keyboard scrolling and scroll-snap
               for free, all of which a custom drag has to reimplement badly. */
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth motion-reduce:scroll-auto"
          >
            {POSTS.map((post, i) => {
              const alt = `${post.isReel ? "Reel" : "Post"} ${i + 1} from @${INSTAGRAM_HANDLE} on Instagram`;

              return (
                <li
                  key={post.stem}
                  className="w-44 shrink-0 snap-start sm:w-52 lg:w-56"
                >
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    /* 9:16 — the shape reels are shot in, so a reel fills the
                       tile and a square photo is centre-cropped rather than the
                       other way round. */
                    className="ring-ring group relative block aspect-[9/16] overflow-hidden rounded-lg bg-background/[0.06] focus-visible:outline-none focus-visible:ring-2"
                  >
                    {post.video ? (
                      <ReelTile post={post} alt={alt} />
                    ) : (
                      <img
                        src={post.src}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    )}

                    {/* Marks the tile as video, and stands in while the reel is
                        still paused off-screen. */}
                    {post.isReel && (
                      <span
                        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
                        aria-hidden="true"
                      >
                        <Play className="size-3.5 fill-current" strokeWidth={0} />
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {overflowing && (
            <>
              <button
                type="button"
                aria-label="Previous posts"
                onClick={() => nudge(-1)}
                disabled={atStart}
                className="rule absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-foreground/80 p-3 backdrop-blur transition hover:opacity-60 disabled:pointer-events-none disabled:opacity-0 sm:block"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next posts"
                onClick={() => nudge(1)}
                disabled={atEnd}
                className="rule absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-foreground/80 p-3 backdrop-blur transition hover:opacity-60 disabled:pointer-events-none disabled:opacity-0 sm:block"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>
      )}
    </Section>
  );
}
