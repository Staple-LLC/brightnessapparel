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
  { label: "Journal", to: "/journal" },
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
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
    <div className="relative min-h-screen w-full bg-background text-foreground">
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

          <div className="hidden items-center gap-8 md:flex">
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

          <Link
            to="/contact"
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-500",
              tone === "dark"
                ? "border-background/40 hover:bg-background hover:text-foreground"
                : "border-foreground/30 hover:bg-foreground hover:text-background"
            )}
          >
            Start Production
          </Link>
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
