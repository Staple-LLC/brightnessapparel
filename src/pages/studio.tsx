import { useNavigate } from "react-router-dom";
import {
  Section,
  SectionHeading,
  SectionLede,
  Quiet,
  DIVIDED_GRID,
  dividedCell,
  CELL_TITLE,
} from "@/components/section";

/* Service photography, folder-driven like the process section. Drop a file
   named after the service slug into src/assets/services and it appears —
   see the README in that folder. */
const photos = import.meta.glob("../assets/services/*.{webp,jpg,jpeg,png,WEBP,JPG,JPEG,PNG}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function photoFor(slug: string) {
  const key = Object.keys(photos).find(
    (path) => path.split("/").pop()!.replace(/\.[^.]+$/, "") === slug
  );
  return key ? photos[key] : undefined;
}

const CAPABILITIES = [
  {
    number: "01",
    slug: "event-apparel",
    title: "Event Apparel",
    accent: "#a855f7",
    description:
      "Sublimation jerseys, marathon jerseys, and corporate uniforms produced for teams, races, events, and organizations.",
  },
  {
    number: "02",
    slug: "custom-uniform-solution",
    title: "Custom Uniform Solution",
    accent: "#3b82f6",
    description:
      "A dependable OEM production partner for established apparel brands that need consistent quality, timelines, and scale.",
  },
  {
    number: "03",
    slug: "premium-streetwear",
    title: "Premium Streetwear",
    accent: "#2dd4bf",
    description:
      "High-quality streetwear essentials manufactured with attention to fabric, fit, and finishing.",
  },
  {
    number: "04",
    slug: "clothing-brand-development",
    title: "Clothing Brand Development",
    accent: "hsl(var(--brand))",
    description:
      "Support for new labels moving from concept to finished garments, including product planning and manufacturing guidance.",
  },
];

export default function StudioPage() {
  const navigate = useNavigate();

  return (
    <Section id="studio" label="Services" tone="dark">
      <SectionHeading>
        Made for <Quiet>movement and scale.</Quiet>
      </SectionHeading>

      <SectionLede>
        From event-ready jerseys to brand manufacturing programs, we turn
        apparel requirements into clean samples, dependable production, and
        finished pieces that are ready to wear.
      </SectionLede>

      <div className={`${DIVIDED_GRID} mt-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4`}>
        {CAPABILITIES.map((item) => {
          const photo = photoFor(item.slug);

          return (
            <div key={item.title} className={dividedCell(4)}>
              <span className="dim-sm text-xs tracking-[0.2em]">
                {item.number}
              </span>

              {/* Taller on a phone than in the grid: at one column the panel is
                  327px wide, and the 208px used at sm+ would crop these
                  near-square photographs to a letterbox. */}
              <div className="mt-4 h-72 overflow-hidden rounded-lg bg-background/[0.06] sm:h-52">
                {photo ? (
                  <img
                    src={photo}
                    alt={`${item.title} — Brightness Apparel`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="dim-sm text-[10px] uppercase tracking-[0.2em]">
                      Photography to come
                    </span>
                  </div>
                )}
              </div>

              <h3
                className={`${CELL_TITLE} mt-5 text-2xl uppercase leading-[0.95]`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>

              {/* The accent rule from the reference. Inline because the four
                  colours are per-item data, not a palette the theme owns. */}
              <span
                aria-hidden="true"
                className="mt-3 block h-[3px] w-10 rounded-full"
                style={{ backgroundColor: item.accent }}
              />

              <p className="dim mt-4 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate("/contact")}
        className="group mt-14 inline-flex min-h-[44px] items-center gap-3 text-sm uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
      >
        Start an Order
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </Section>
  );
}
