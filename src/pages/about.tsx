import { useEffect, useRef, useState } from "react";
import {
  Section,
  SectionHeading,
  SectionLede,
  Quiet,
  DIVIDED_GRID,
  dividedCell,
} from "@/components/section";
import { FactoryVideo } from "@/components/factory-video";
import { FOUNDED, ADDRESS, COUNTRY, yearsInOperation } from "@/content/company";

const mkmaLogo = new URL("../assets/mkma.jpeg", import.meta.url).href;

/* Client logos, counted rather than stated, so the figure cannot drift away
   from the marquee sitting further down the page. */
const logoCount = Object.keys(
  import.meta.glob("../assets/logos/*.webp", { eager: true })
).length;

/* Every figure is derived from something real in the repository — the founding
   year, the logo folder, the decoration methods, the production stages. None
   is a number somebody typed and will forget to update. */
const STATS: { value: number; suffix?: string; label: string }[] = [
  { value: yearsInOperation(), suffix: "+", label: "Years in operation" },
  { value: logoCount, suffix: "+", label: "Brands produced for" },
  { value: 6, label: "Decoration methods in-house" },
  { value: 6, label: "Production stages under one roof" },
];

const DETAILS: [string, string][] = [
  ["Founded", String(FOUNDED)],
  ["Based in", `${ADDRESS}, ${COUNTRY}`],
  ["Specialism", "OEM apparel manufacturing"],
  ["Serving", "Events, corporates, retail labels"],
];

const PRINCIPLES = [
  {
    number: "01",
    title: "Built for production",
    description:
      "Every project is planned around practical manufacturing needs: material choice, fit, finishing, quantity, and delivery timing.",
  },
  {
    number: "02",
    title: "Reliable brand support",
    description:
      "We work as an extension of your team, helping brands maintain consistency across repeat orders and seasonal releases.",
  },
  {
    number: "03",
    title: "Made in Malaysia",
    description:
      "Our Malaysia-based operation gives clients a focused regional partner for responsive apparel sourcing and OEM production.",
  },
];

/** Counts from zero to `value` the first time it scrolls into view. */
function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Someone who has asked for less motion gets the number, not the count. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }

    let raf = 0;
    let frame = 0;
    let start = 0;
    let started = false;
    const DURATION = 1100;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / DURATION, 1);
      /* ease-out cubic: quick off the mark, settles onto the figure. */
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(step);
    };

    /* Measured against the viewport on scroll rather than handed to an
       IntersectionObserver — the same choice the nav spy makes, and for the
       same reason: when the observer does not report, that silently leaves the
       figure reading 0, which is worse than showing no animation at all. */
    const check = () => {
      frame = 0;
      if (started) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        /* Runs once. A counter that replays on every pass reads as a glitch. */
        started = true;
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        raf = requestAnimationFrame(step);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
      {suffix}
    </span>
  );
}

export default function AboutPage() {
  return (
    <Section id="about" label="About" tone="brand">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeading>
            Your <Quiet>manufacturing partner.</Quiet>
          </SectionHeading>

          <SectionLede>
            Brightness Apparel is a modern OEM apparel manufacturing partner
            based in Malaysia, supporting event apparel, established brand
            production, and clothing brand development.
          </SectionLede>

          <dl className="rule mt-10 grid gap-x-8 gap-y-5 border-t pt-6 sm:grid-cols-2">
            {DETAILS.map(([term, value]) => (
              <div key={term}>
                <dt className="dim-sm text-[11px] uppercase tracking-[0.2em]">
                  {term}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed">{value}</dd>
              </div>
            ))}
          </dl>

          {/* MKMA's mark is their trademark, so it keeps its own colours on a
              white chip rather than being recoloured or knocked out to suit
              the band. That also solves the practical problem: the artwork has
              a white background, and dropped straight onto the orange it would
              read as a white rectangle. */}
          <div className="rule mt-10 flex items-center gap-5 border-t pt-6">
            <span className="shrink-0 rounded-lg bg-white p-3">
              <img
                src={mkmaLogo}
                alt="Malaysian Knitting Manufacturers Association"
                width={250}
                height={91}
                loading="lazy"
                decoding="async"
                className="h-8 w-auto"
              />
            </span>
            <p className="text-sm leading-relaxed">
              <span className="dim-sm block text-[11px] uppercase tracking-[0.2em]">
                Proud member
              </span>
              Malaysian Knitting Manufacturers Association (MKMA)
            </p>
          </div>
        </div>

        {/* The drone loop rather than a photograph: "we have a factory" is the
            claim this section makes, and footage of the building is the most
            direct evidence for it.

            aspect-[900/1418] is the file's real shape. It was delivered as
            900x1600 with 91px of white padding top and bottom — exported from
            a 9:16 timeline — so a 9:16 frame here reproduced those bars
            exactly. The padding is cropped out of the source now and this
            matches what is left, so nothing is letterboxed or cut. */}
        <div className="lg:col-span-5">
          <FactoryVideo className="aspect-[900/1418] max-h-[42rem] w-full bg-foreground/5 object-cover" />
        </div>
      </div>

      <dl className={`${DIVIDED_GRID} mt-16 sm:grid-cols-2 lg:grid-cols-4`}>
        {STATS.map((stat) => (
          <div key={stat.label} className={dividedCell(4)}>
            <dd
              className="text-5xl leading-none sm:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Counter value={stat.value} suffix={stat.suffix} />
            </dd>
            <dt className="dim mt-3 text-sm leading-snug">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <dl className="rule mt-16 border-t">
        {PRINCIPLES.map((principle) => (
          <div
            key={principle.number}
            className="rule grid gap-2 border-b py-6 sm:grid-cols-12 sm:gap-6"
          >
            <span className="dim-sm text-xs tracking-[0.2em] sm:col-span-1">
              {principle.number}
            </span>
            <dt
              className="text-xl uppercase leading-[0.95] sm:col-span-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {principle.title}
            </dt>
            <dd className="dim text-sm leading-relaxed sm:col-span-7">
              {principle.description}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
