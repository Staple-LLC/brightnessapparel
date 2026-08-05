import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/* Two versions of the same lockup. The gold mark measures 8.65:1 on the dark
   bands but only 2.21:1 on white and 1.34:1 on the orange band, where it all
   but disappears — so light-toned bands get the mono variant instead. Same
   artwork and alpha, recoloured to the foreground. */
const brandLogo = new URL("../assets/balogo.webp", import.meta.url).href;
const brandLogoMono = new URL("../assets/balogo-mono.webp", import.meta.url)
  .href;

/* Nav entries are either a section on the home page (`id`) or a route (`to`). */
type NavLink = { label: string; id?: string; to?: string };

const NAV_LINKS: NavLink[] = [
  { label: "About", to: "/about" },
  { label: "Services", id: "studio" },
  { label: "Solutions", id: "one-stop" },
  { label: "Methods", id: "printing" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Blog", to: "/journal" },
  { label: "Contact", to: "/contact" },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const [active, setActive] = useState("home");
  /* Read off the rendered section's own data-tone rather than a second list
     here, so the nav can never drift out of sync with the band it sits on. */
  const [tone, setTone] = useState("light");
  /* The nav only paints a background once the page has moved. At rest it is
     fully transparent so the hero plate runs unbroken to the top of the
     viewport; the tint exists solely to stop band headings scrolling through
     it, which is not a problem until something is actually scrolling. */
  const [scrolled, setScrolled] = useState(false);
  /* Which cross-route scroll request has already been acted on. */
  const handledScroll = useRef<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* The menu stagger is an inline transition-delay, and an inline style beats
     any motion-reduce: class, so the preference has to be read in JS rather
     than left to the media query. Tracked as state so toggling it in the OS
     takes effect without a reload. */
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* Rows fan in one after another on open. On close they all leave together —
     a staggered exit reads as lag. */
  const stagger = (i: number) => ({
    transitionDelay: menuOpen && !reduceMotion ? `${i * 45}ms` : "0ms",
  });

  /* Mobile browsers tint their own chrome with theme-color, so a single static
     value left a black bar sitting above the white bands. Resolve the band
     token through a throwaway probe rather than reading the painted element:
     everything that carries a band colour also carries transition-colors, and
     sampling one of those returns whatever mid-fade grey the animation is on.
     The probe still reads the same CSS variables, so there is no second
     definition of the palette to keep in step. */
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    const token =
      tone === "dark"
        ? "hsl(var(--foreground))"
        : tone === "brand"
          ? "hsl(var(--brand))"
          : "hsl(var(--background))";
    const probe = document.createElement("div");
    probe.style.cssText = `position:fixed;left:-9999px;top:0;width:1px;height:1px;background:${token}`;
    document.body.appendChild(probe);
    meta.content = getComputedStyle(probe).backgroundColor;
    probe.remove();
  }, [tone]);

  /* Close the menu on navigation, or the panel stays over the new page. */
  useEffect(() => setMenuOpen(false), [pathname]);

  /* While open: Escape closes it, and the page behind must not scroll. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    /* The panel is lg:hidden, so growing past that breakpoint — rotating a
       tablet, dragging a desktop window wider — would hide it via CSS while
       menuOpen stayed true, leaving the page scroll-locked with nothing on
       screen to close. Matching the query in JS keeps state and CSS agreed. */
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setMenuOpen(false);
    onWide();
    wide.addEventListener("change", onWide);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  /* Publishes the nav's measured height as --nav-h. The hero slides up behind
     the nav by exactly this much, and section anchors offset by it. Both used
     to hardcode 88px, which silently broke the moment the logo changed the
     nav's height — deriving it means that cannot happen again. */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const apply = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${el.getBoundingClientRect().height}px`
      );
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Resolved from scroll position rather than IntersectionObserver: the active
     section is whichever one's top has most recently passed the viewport
     midpoint. Being steady-state, it is correct at any scroll offset — an
     observer with a narrow rootMargin band silently keeps a stale value when a
     fast flick or a programmatic jump crosses the band between sampled frames. */
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const midpoint = window.innerHeight / 2;
      /* Read the sections out of the DOM rather than from a fixed list, so this
         works unchanged on any route — the gallery route renders one section,
         the home route eleven. */
      const sections = [...document.querySelectorAll<HTMLElement>("section[id]")];
      let current = sections[0];
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= midpoint) current = el;
      }
      const currentId = current?.id ?? "";
      setActive((prev) => (prev === currentId ? prev : currentId));

      /* The hero is not a <Section> and carries no data-tone, so it correctly
         falls through to the light treatment. */
      const next = current?.dataset.tone ?? "light";
      setTone((prev) => (prev === next ? prev : next));

      const isScrolled = window.scrollY > 24;
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    /* Routes are lazy, so this effect runs before the route's sections exist —
       the first measurement finds nothing and falls back to the light tone,
       leaving a white nav strip over a dark band until something scrolls.
       Re-measuring on DOM change covers the mount. setState is change-guarded
       above, so this settles rather than looping. */
    const observer = new MutationObserver(onScroll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* Section links have to work from any route. Off the home page there is
     nothing to scroll to, so navigate there first and hand the target along in
     router state for the effect below to act on once it has rendered. */
  const scrollTo = useCallback(
    (id: string) => {
      if (pathname !== "/") {
        /* `at` makes each request unique, so asking for the same section twice
           from another route still fires — the target alone would look like a
           repeat and be skipped by the guard below. */
        navigate("/", { state: { scrollTo: id, at: Date.now() } });
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    },
    [navigate, pathname]
  );

  useEffect(() => {
    const request = state as { scrollTo?: string; at?: number } | null;

    if (!request?.scrollTo) {
      /* The router does not reset scroll between routes on its own. */
      window.scrollTo(0, 0);
      return;
    }
    if (handledScroll.current === request.at) return;
    handledScroll.current = request.at ?? null;

    /* Deferred rather than run inline: the route has only just mounted, and a
       scroll issued in the same tick gets undone as the browser settles its own
       position for the new history entry. */
    const timer = window.setTimeout(() => {
      document
        .getElementById(request.scrollTo!)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [pathname, state]);

  return (
    /* The page ground tracks the active band. The nav is transparent at rest,
       so on a route whose first section is dark this would otherwise show a
       white strip behind it — and the same colour covers overscroll. */
    <div
      className={cn(
        "relative min-h-screen w-full text-foreground transition-colors duration-500 motion-reduce:transition-none",
        tone === "dark" && "bg-foreground",
        tone === "brand" && "bg-[hsl(var(--brand))]",
        tone === "light" && "bg-background"
      )}
    >
      {/* The nav is transparent by default, which let band headings scroll
          straight through it. It now carries a frosted backdrop tinted to match
          whichever band it currently sits on, so it stays legible everywhere
          without reading as a separate bar. */}
      <nav
        ref={navRef}
        className={cn(
          "sticky top-0 z-20 transition-colors duration-500 motion-reduce:transition-none",
          tone === "dark" ? "text-background" : "text-foreground",
          scrolled && "backdrop-blur-md",
          scrolled && tone === "dark" && "bg-foreground/80",
          scrolled && tone === "brand" && "bg-[hsl(var(--brand)/0.8)]",
          scrolled && tone === "light" && "bg-background/80"
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-4 px-6 py-5 sm:px-10 sm:py-6 lg:px-16">
          {/* The lockup already contains the wordmark, so the accessible name
              lives on the link and the image itself is decorative. */}
          <Link to="/" aria-label="Brightness Apparel — home" className="shrink-0">
            <img
              src={tone === "dark" ? brandLogo : brandLogoMono}
              alt=""
              width={153}
              height={136}
              className="h-11 w-auto sm:h-12"
            />
          </Link>

          {/* lg, not md: the seven links measure 673px and the CTA another
              185px, so the full row needs ~984px including the gutters. Handing
              over at md (768px) pushed the CTA past the right edge and gave the
              whole document a horizontal scroll on tablets. */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              /* Route links are highlighted by the URL; section links by the
                 scroll spy, and only while the home page is the one showing. */
              /* Prefix match so a nested route (/journal/a-post) still marks
                 its parent link, rather than leaving nothing highlighted. */
              const isActive = link.to
                ? pathname === link.to || pathname.startsWith(`${link.to}/`)
                : pathname === "/" && active === link.id;
              const style = cn(
                "cursor-pointer text-[11px] uppercase tracking-[0.18em] transition-opacity",
                isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
              );

              return link.to ? (
                <Link key={link.label} to={link.to} className={style}>
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollTo(link.id!)}
                  className={style}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/contact"
              className={cn(
                "hidden whitespace-nowrap rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-500 sm:inline-block",
                tone === "dark"
                  ? "border-background/40 hover:bg-background hover:text-foreground"
                  : "border-foreground/30 hover:bg-foreground hover:text-background"
              )}
            >
              Start Production
            </Link>

            {/* Below lg the link row is hidden, which previously left the site
                with no navigation at all on a phone. */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border transition-colors duration-500 lg:hidden",
                tone === "dark" ? "border-background/40" : "border-foreground/30"
              )}
            >
              <span
                className={cn(
                  "block h-px w-4 bg-current transition-transform duration-300",
                  menuOpen && "translate-y-[3px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-px w-4 bg-current transition-transform duration-300",
                  menuOpen && "-translate-y-[3px] -rotate-45"
                )}
              />
            </button>
          </div>
        </div>

        {/* Mobile panel. Sits inside the sticky nav so it inherits the tone
            colours, and covers the viewport below the bar. */}
        <div
          id="mobile-menu"
          className={cn(
            "fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-20 overflow-y-auto lg:hidden",
            /* visibility is in the transition list deliberately. CSS holds a
               transitioning visibility at `visible` for the whole duration,
               so the panel stays painted while it fades out — and once it
               lands on hidden the links leave the tab order and the a11y tree
               on their own. The previous `hidden` attribute is display:none,
               which cannot animate in either direction. */
            "transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none",
            menuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-3 opacity-0",
            tone === "dark" && "bg-foreground text-background",
            tone === "brand" && "bg-[hsl(var(--brand))] text-foreground",
            tone === "light" && "bg-background text-foreground"
          )}
        >
          <ul className="flex flex-col px-6 pb-10 pt-2 sm:px-10">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.label}
                style={stagger(i)}
                className={cn(
                  "rule border-b",
                  "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                )}
              >
                {link.to ? (
                  <Link
                    to={link.to}
                    className="block py-5 text-2xl uppercase leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      scrollTo(link.id!);
                    }}
                    className="block w-full py-5 text-left text-2xl uppercase leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {link.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Continues the same stagger, one step past the last link. */}
          <div
            style={stagger(NAV_LINKS.length)}
            className={cn(
              "px-6 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none sm:px-10",
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
          >
            <Link
              to="/contact"
              className={cn(
                "inline-block rounded-full border px-6 py-3 text-[11px] uppercase tracking-[0.18em]",
                tone === "dark" ? "border-background/40" : "border-foreground/30"
              )}
            >
              Start Production
            </Link>
          </div>
        </div>
      </nav>

      {children}

      <footer className="relative z-10 bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-10 text-[11px] uppercase tracking-[0.18em] sm:flex-row sm:items-center sm:px-10 lg:px-16">
          <span className="text-base normal-case tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Brightness Apparel
          </span>
          <span className="opacity-55">
            © 2026 Brightness Apparel. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
