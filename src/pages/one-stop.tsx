import {
  Section,
  SectionHeading,
  SectionLede,
  Quiet,
  DIVIDED_GRID,
  dividedCell,
  CELL_TITLE,
} from "@/components/section";

const STAGES = [
  {
    number: "01",
    title: "Fabric Selection",
    description:
      "Choosing weight, stretch, and finish against how the garment will actually be worn and washed.",
  },
  {
    number: "02",
    title: "Sample Making",
    description:
      "A physical sample to approve fit, colour, and construction before any bulk cutting begins.",
  },
  {
    number: "03",
    title: "Labelling & Hangtag",
    description:
      "Woven labels, care labels, size tabs, and hangtags applied to your brand's specification.",
  },
  {
    number: "04",
    title: "Ironing",
    description:
      "Pressing and steaming so every piece arrives shaped and presentable, not creased from the box.",
  },
  {
    number: "05",
    title: "Quality Check",
    description:
      "Measurements, stitching, and decoration inspected piece by piece against the approved sample.",
  },
  {
    number: "06",
    title: "Delivery",
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
        {STAGES.map((stage) => (
          <li
            key={stage.number}
            className={dividedCell(3)}
          >
            <span className="text-xs tracking-[0.2em] dim">
              {stage.number}
            </span>
            <h3
              className={`${CELL_TITLE} mt-4 text-xl uppercase leading-[0.95]`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {stage.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed dim">
              {stage.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
