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

const CAPABILITIES = [
  {
    number: "01",
    title: "Event Apparel",
    description:
      "Sublimation jerseys, marathon jerseys, and corporate uniforms produced for teams, races, events, and organizations.",
  },
  {
    number: "02",
    title: "Brand Manufacturing",
    description:
      "A dependable OEM production partner for established apparel brands that need consistent quality, timelines, and scale.",
  },
  {
    number: "03",
    title: "Clothing Brand Development",
    description:
      "Support for new labels moving from concept to finished garments, including product planning and manufacturing guidance.",
  },
  {
    number: "04",
    title: "Production Coordination",
    description:
      "Clear communication from sampling to delivery, with practical support across fabrics, sizing, finishing, and order flow.",
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
        {CAPABILITIES.map((item) => (
          <div
            key={item.title}
            className={dividedCell(4)}
          >
            <span className="text-xs tracking-[0.2em] dim-sm">
              {item.number}
            </span>
            <h3
              className={`${CELL_TITLE} mt-4 text-2xl uppercase leading-[0.95]`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed dim">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate("/contact")}
        className="group mt-14 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
      >
        Start an Order
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </Section>
  );
}
