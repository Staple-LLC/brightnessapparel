import {
  Section,
  SectionHeading,
  SectionLede,
  Quiet,
  DIVIDED_GRID,
  dividedCell,
  CELL_TITLE,
} from "@/components/section";

const REASONS = [
  {
    number: "01",
    title: "One factory, one point of contact",
    description:
      "Fabric, sampling, decoration, finishing, and delivery run under a single team, so nothing gets lost between vendors.",
  },
  {
    number: "02",
    title: "Low minimums for new labels",
    description:
      "Order quantities that let emerging brands test a product properly before committing to full production runs.",
  },
  {
    number: "03",
    title: "Consistency across repeat orders",
    description:
      "Approved samples, recorded specs, and retained patterns keep your second run matching your first.",
  },
  {
    number: "04",
    title: "In-house decoration",
    description:
      "Sublimation, silk screen, embroidery, DTF, and DTG are handled on site rather than sub-contracted out.",
  },
  {
    number: "05",
    title: "Responsive regional base",
    description:
      "A Malaysia-based operation with practical lead times and direct communication across South East Asia.",
  },
  {
    number: "06",
    title: "Checked before it ships",
    description:
      "Measurement, stitching, and print quality are inspected against the approved sample before dispatch.",
  },
];

export default function WhyUsPage() {
  return (
    <Section id="why-us" label="Why choose us" tone="brand">
      <SectionHeading>
        Built to be <Quiet>easy to work with.</Quiet>
      </SectionHeading>

      <SectionLede>
        Manufacturing goes wrong in the handoffs. We keep the whole process
        under one roof so quality, timing, and communication stay predictable.
      </SectionLede>

      <div className={`${DIVIDED_GRID} mt-14 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3`}>
        {REASONS.map((reason) => (
          <div
            key={reason.number}
            className={dividedCell(3)}
          >
            <span className="text-xs tracking-[0.2em] dim-sm">
              {reason.number}
            </span>
            <h3
              className={`${CELL_TITLE} mt-4 text-xl uppercase leading-[0.95]`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {reason.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed dim">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
