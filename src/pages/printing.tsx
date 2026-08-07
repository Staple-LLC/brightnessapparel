import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";

/* Method photography, folder-driven like the process and services sections.
   Drop a file named after the method slug into src/assets/printing — see the
   README there. */
const photos = import.meta.glob("../assets/printing/*.{webp,jpg,jpeg,png,WEBP,JPG,JPEG,PNG}", {
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

const METHODS = [
  {
    number: "01",
    slug: "sublimation",
    title: "Sublimation Printing",
    best: "Full-coverage polyester",
    description:
      "Dye bonds into the fibre, so the print does not crack or peel. Ideal for all-over jersey graphics and panel designs.",
  },
  {
    number: "02",
    slug: "silk-screen",
    title: "Silk Screen Printing",
    best: "High volume, solid colour",
    description:
      "Durable, cost-effective ink coverage for bold designs with a limited colour count. Best value at larger quantities.",
  },
  {
    number: "03",
    slug: "embroidery",
    title: "Embroidery",
    best: "Logos and uniforms",
    description:
      "Stitched thread for a premium, hard-wearing finish on polos, caps, jackets, and corporate wear.",
  },
  {
    number: "04",
    slug: "dtf",
    title: "DTF Printing",
    best: "Mixed fabrics, small runs",
    description:
      "Direct-to-film transfers that hold fine detail and full colour on both cotton and synthetic blends.",
  },
  {
    number: "05",
    slug: "dtg",
    title: "DTG Printing",
    best: "Cotton, photographic detail",
    description:
      "Ink printed straight into cotton fibres for soft-handed, high-detail artwork without a minimum colour count.",
  },
  {
    number: "06",
    slug: "heat-transfer-vinyl",
    title: "Heat Transfer Vinyl",
    best: "Names and numbers",
    description:
      "Cut vinyl applied under heat for team names, squad numbers, and short-notice personalisation.",
  },
];

export default function PrintingPage() {
  return (
    <Section id="printing" label="Printing & decoration" tone="light">
      <SectionHeading>
        Decoration methods, <Quiet>matched to the garment.</Quiet>
      </SectionHeading>

      <SectionLede>
        The right method depends on fabric, artwork, and quantity. We will
        recommend the one that holds up best for what you are producing.
      </SectionLede>

      <ul className="rule mt-14 border-t sm:mt-20">
        {METHODS.map((method) => {
          const photo = photoFor(method.slug);

          return (
            <li
              key={method.number}
              /* items-center rather than the items-baseline this used before
                 the photograph existed: a baseline shared with a 180px image
                 drops the text to the foot of the row. */
              className="rule grid gap-3 border-b py-6 sm:grid-cols-12 sm:items-center sm:gap-6"
            >
              {/* aspect-[3/2] matches the source files exactly — all six are
                  1536x1024 — so nothing is cropped at any column width. */}
              <div className="aspect-[3/2] overflow-hidden rounded-lg bg-foreground/[0.06] sm:col-span-3">
                {photo ? (
                  <img
                    src={photo}
                    alt={`${method.title} — Brightness Apparel`}
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

              <span className="dim-sm text-xs tracking-[0.2em] sm:col-span-1">
                {method.number}
              </span>

              <h3
                className="text-xl uppercase leading-[0.95] sm:col-span-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {method.title}
              </h3>

              <span className="dim-sm text-[11px] uppercase tracking-[0.2em] sm:col-span-2">
                {method.best}
              </span>

              <p className="dim text-sm leading-relaxed sm:col-span-3">
                {method.description}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
