import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";

const METHODS = [
  {
    number: "01",
    title: "Sublimation Printing",
    best: "Full-coverage polyester",
    description:
      "Dye bonds into the fibre, so the print does not crack or peel. Ideal for all-over jersey graphics and panel designs.",
  },
  {
    number: "02",
    title: "Silk Screen Printing",
    best: "High volume, solid colour",
    description:
      "Durable, cost-effective ink coverage for bold designs with a limited colour count. Best value at larger quantities.",
  },
  {
    number: "03",
    title: "Embroidery",
    best: "Logos and uniforms",
    description:
      "Stitched thread for a premium, hard-wearing finish on polos, caps, jackets, and corporate wear.",
  },
  {
    number: "04",
    title: "DTF Printing",
    best: "Mixed fabrics, small runs",
    description:
      "Direct-to-film transfers that hold fine detail and full colour on both cotton and synthetic blends.",
  },
  {
    number: "05",
    title: "DTG Printing",
    best: "Cotton, photographic detail",
    description:
      "Ink printed straight into cotton fibres for soft-handed, high-detail artwork without a minimum colour count.",
  },
  {
    number: "06",
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

      <ul className="mt-14 border-t rule sm:mt-20">
        {METHODS.map((method) => (
          <li
            key={method.number}
            className="grid gap-2 border-b rule py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
          >
            <span className="text-xs tracking-[0.2em] dim-sm sm:col-span-1">
              {method.number}
            </span>
            <h3
              className="text-xl uppercase leading-[0.95] sm:col-span-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {method.title}
            </h3>
            <span className="text-[11px] uppercase tracking-[0.2em] dim-sm sm:col-span-3">
              {method.best}
            </span>
            <p className="text-sm leading-relaxed dim sm:col-span-4">
              {method.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
