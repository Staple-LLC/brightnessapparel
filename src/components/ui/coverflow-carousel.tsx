import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/* Adapted from the reference implementation in five ways, all forced by this
   codebase rather than by taste:

     1. No "use client" and no @next/next/no-img-element pragma — this is a Vite
        SPA on react-router, so both were inert Next.js artifacts.
     2. Slides take an optional `href` and render as <Link>. The original wraps
        bare <div>s, which would have left the six /portfolio/:slug routes with
        nothing linking to them. A drag is discriminated from a click so
        throwing the deck never navigates by accident.
     3. Colours inherit from the band. The original hardcodes text-foreground
        and text-muted-foreground; the portfolio sits on tone="dark", where
        those are near-black on near-black.
     4. Reduced motion skips the settle animation — the deck still moves, it
        just arrives rather than gliding.
     5. An `aspect` prop. Coverflow is square because album art is square;
        garments are shot portrait, and cropping them to a square cuts the hem. */

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
  /** Renders the card as a router link. */
  href?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Card width divided by height. 1 is the classic square coverflow. */
  aspect?: number;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
}

/** Pointer travel past which a gesture is a drag, not a click. */
const DRAG_SLOP = 6;

/** Above this many slides, pagination becomes a counter rather than dots. */
const DOT_LIMIT = 12;

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(148px, 22vw, 260px)",
  aspect = 1,
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  /** Furthest the pointer has travelled this gesture, to tell a drag from a
      click. Read by the card's onClick, which fires after the pointer is up. */
  const movedRef = React.useRef(0);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count]
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      // A receded card must not swallow taps meant for the one in front: the
      // boxes overlap heavily once they are raked back.
      card.style.pointerEvents = distance < 0.5 ? "auto" : "none";
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      /* Checked per settle rather than cached: the OS setting can change while
         the page is open, and this is not a hot path. */
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (still) {
        posRef.current = target;
        paint();
        rafRef.current = null;
        return;
      }

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // ponytail: exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint]
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop]
  );

  const goTo = React.useCallback(
    (index: number) => {
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle]
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle]
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    movedRef.current = 0;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    movedRef.current = Math.max(
      movedRef.current,
      Math.abs(event.clientX - drag.x)
    );

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const active = slides[selected];
  /* Whether the subtitle line is reserved at all — see the caption below. */
  const anySubtitle = React.useMemo(
    () => slides.some((slide) => slide.subtitle),
    [slides]
  );

  return (
    <div
      className={cn("w-full", className)}
      style={{
        ["--cf-card" as string]: cardWidth,
        ["--cf-aspect" as string]: String(aspect),
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          // Vertical padding keeps the drop shadows clear of the overflow clip.
          className="cursor-grab overflow-hidden py-10 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "calc(var(--cf-card) / var(--cf-aspect))",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isActive = index === selected;

              const art = (
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full select-none object-cover"
                />
              );

              /* Only the centred card is tabbable. The rest are stacked behind
                 it at partial opacity, so putting them in the tab order sends
                 focus to something the eye cannot follow. Arrow keys on the
                 frame are how a keyboard moves the deck. */
              const cardProps = {
                ref: (node: HTMLDivElement | null) => {
                  cardRefs.current[index] = node;
                },
                role: "group",
                "aria-roledescription": "slide",
                "aria-label": `${index + 1} of ${count}`,
                className: cn(
                  /* bg-foreground/10, not bg-muted: muted resolves to a
                     near-white regardless of band, so an unloaded card flashed
                     a bright rectangle against the dark portfolio ground. */
                  "absolute left-1/2 top-0 overflow-hidden rounded-2xl bg-foreground/10 shadow-xl will-change-transform",
                  cardClassName
                ),
                style: {
                  width: "var(--cf-card)",
                  height: "calc(var(--cf-card) / var(--cf-aspect))",
                },
              };

              return slide.href ? (
                <div key={index} {...cardProps}>
                  <Link
                    to={slide.href}
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                    // A throw of the deck ends in a click on whichever card is
                    // under the finger. Without this every flick navigates.
                    onClick={(event) => {
                      if (movedRef.current > DRAG_SLOP) event.preventDefault();
                    }}
                    className="block h-full w-full ring-ring focus-visible:outline-none focus-visible:ring-2"
                  >
                    {art}
                  </Link>
                </div>
              ) : (
                <div key={index} {...cardProps}>
                  {art}
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-3 top-1/2 z-[200] -translate-y-1/2 rounded-full border rule p-3 backdrop-blur transition hover:opacity-60"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-3 top-1/2 z-[200] -translate-y-1/2 rounded-full border rule p-3 backdrop-blur transition hover:opacity-60"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {/* Colours inherit rather than resolving to --foreground, so the same
          markup reads on the white, black and orange bands.

          Both lines reserve their space instead of collapsing, or everything
          below the caption jumps as the deck moves — measured at three
          distinct heights over one set of slides, a 46px swing. Two separate
          causes: a slide with no subtitle drops a line, and a long title wraps
          to two. Reserving in em rather than px keeps the box in step if the
          type sizes change. leading-normal is explicit for the same reason —
          the reservation is a multiple of the line height, so it cannot be
          left to whatever the cascade supplies. */}
      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-2 flex flex-col items-center px-6 text-center duration-300 animate-in fade-in"
        >
          <p className="min-h-[3em] text-[15px] font-semibold leading-normal tracking-tight sm:min-h-[1.5em]">
            {active.title}
          </p>
          {/* Rendered whenever any slide has a subtitle, so the deck reserves
              one line throughout rather than only on the slides that fill it.
              A deck where none do reserves nothing. */}
          {anySubtitle && (
            <p className="dim mt-1 min-h-[1.5em] text-[13px] leading-normal">
              {active.subtitle}
            </p>
          )}
          {active.meta && active.meta.length > 0 && (
            <dl className="mt-10 w-full max-w-[230px] text-[12px]">
              {active.meta.map((row) => (
                <div key={row.label} className="flex justify-between py-[5px]">
                  <dt className="dim">{row.label}</dt>
                  <dd className="font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {/* Dots only while they still mean something. Past a dozen they stop
          being a map and start being noise, and — because flex children shrink
          — the row silently squeezes each target below the 24px floor rather
          than overflowing, which is the failure you do not see. A long deck
          gets a counter instead. */}
      {showPagination && count > DOT_LIMIT && (
        <p
          className="mt-4 text-center text-[11px] uppercase tracking-[0.24em]"
          aria-live="polite"
        >
          <span className="tabular-nums">
            {String(selected + 1).padStart(2, "0")}
          </span>
          <span className="dim"> / {String(count).padStart(2, "0")}</span>
        </p>
      )}

      {/* The dot stays 8px, but its button is 24x44 — a bare size-2 control is
          an 8px tap target, which no thumb can hit. The hit area is
          transparent, so the row still reads as a row of dots. */}
      {showPagination && count <= DOT_LIMIT && (
        <div className="mt-4 flex items-center justify-center">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className="grid h-11 w-6 shrink-0 place-items-center ring-ring focus-visible:outline-none focus-visible:ring-2"
            >
              <span
                className={cn(
                  "size-2 rounded-full bg-current transition-opacity",
                  index === selected ? "opacity-100" : "opacity-30"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
