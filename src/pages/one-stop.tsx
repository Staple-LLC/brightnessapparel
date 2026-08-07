import type { LucideIcon } from "lucide-react";
import { Layers, Scissors, Tag, Wind, ShieldCheck, Package } from "lucide-react";
import {
  Section,
  SectionHeading,
  SectionLede,
  Quiet,
  DIVIDED_GRID,
  dividedCell,
  CELL_TITLE,
} from "@/components/section";

/* Stage photography, folder-driven the same way the portfolio is. Drop a file
   named after the stage slug into src/assets/process and it appears:

       src/assets/process/fabric-selection.webp
       src/assets/process/sample-making.webp
       ...

   A stage with no photograph falls back to its icon on a plain panel rather
   than a broken frame, so the section reads as finished either way. */
const photos = import.meta.glob("../assets/process/*.{webp,jpg,jpeg,png,WEBP,JPG,JPEG,PNG}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function photoFor(slug: string) {
  const key = Object.keys(photos).find((path) =>
    path.split("/").pop()!.replace(/\.[^.]+$/, "") === slug
  );
  return key ? photos[key] : undefined;
}

type Stage = {
  number: string;
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const STAGES: Stage[] = [
  {
    number: "01",
    slug: "fabric-selection",
    title: "Fabric Selection",
    icon: Layers,
    description:
      "Choosing weight, stretch, and finish against how the garment will actually be worn and washed.",
  },
  {
    number: "02",
    slug: "sample-making",
    title: "Sample Making",
    icon: Scissors,
    description:
      "A physical sample to approve fit, colour, and construction before any bulk cutting begins.",
  },
  {
    number: "03",
    slug: "labelling-hangtag",
    title: "Labelling & Hangtag",
    icon: Tag,
    description:
      "Woven labels, care labels, size tabs, and hangtags applied to your brand's specification.",
  },
  {
    number: "04",
    slug: "ironing",
    title: "Ironing",
    icon: Wind,
    description:
      "Pressing and steaming so every piece arrives shaped and presentable, not creased from the box.",
  },
  {
    number: "05",
    slug: "quality-check",
    title: "Quality Check",
    icon: ShieldCheck,
    description:
      "Measurements, stitching, and decoration inspected piece by piece against the approved sample.",
  },
  {
    number: "06",
    slug: "packaging-shipping",
    title: "Packaging & Shipping",
    icon: Package,
    description:
      "Folded, bagged, and packed for dispatch, with coordination through to your delivery date.",
  },
];

export default function OneStopPage() {
  return (
    <Section id="one-stop" label="One stop solution" tone="dark">
      <SectionHeading>
        Everything under <Quiet>one roof.</Quiet>
      </SectionHeading>

      <SectionLede>
        From raw fabric to packed cartons, every stage runs in-house — so there
        is one team accountable for the finished garment.
      </SectionLede>

      <ol className={`${DIVIDED_GRID} mt-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3`}>
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const photo = photoFor(stage.slug);

          return (
            <li key={stage.number} className={dividedCell(3)}>
              <div className="flex items-start gap-4">
                <span className="rule flex h-11 w-11 shrink-0 items-center justify-center rounded-full border">
                  <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <span className="dim block text-xs tracking-[0.2em]">
                    {stage.number}
                  </span>
                  <h3
                    className={`${CELL_TITLE} mt-1 text-xl uppercase leading-[0.95]`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stage.title}
                  </h3>
                </div>
              </div>

              {/* 128px is chosen against the photographs, which run 2.37–3.00
                  wide (median 2.70). At the ~330px column that lands the panel
                  near 2.58 and crops very little; the 240px it used to be gave
                  1.38 and would have thrown most of each frame away.

                  A height rather than an aspect ratio because row-end cells
                  drop their right padding so the rule does not hang at the
                  container edge, leaving that column 32px wider — under a
                  fixed aspect its panel came out 272px against 247px and
                  pushed the description below its neighbours'. */}
              <div className="mt-5 h-32 overflow-hidden rounded-lg bg-background/[0.06]">
                {photo ? (
                  <img
                    src={photo}
                    alt={`${stage.title} — Brightness Apparel`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-3"
                    aria-hidden="true"
                  >
                    <Icon className="size-8 opacity-25" strokeWidth={1.25} />
                    <span className="dim-sm text-[10px] uppercase tracking-[0.2em]">
                      Photography to come
                    </span>
                  </div>
                )}
              </div>

              <p className="dim mt-4 text-sm leading-relaxed">
                {stage.description}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
