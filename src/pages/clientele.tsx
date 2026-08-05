import {
  Section,
  SectionHeading,
  SectionLede,
  Quiet,
  DIVIDED_GRID,
  dividedCell,
  CELL_TITLE,
} from "@/components/section";
import { LogoCarousel } from "@/components/logo-carousel";

const SEGMENTS = [
  { label: "Event organizers", detail: "Races, tournaments, activations" },
  { label: "Corporate teams", detail: "Uniform and staff apparel programs" },
  { label: "Apparel brands", detail: "Repeat OEM production runs" },
  { label: "New labels", detail: "First collections and sampling" },
];

export default function ClientelePage() {
  return (
    <Section id="clientele" label="Our clientele" tone="light">
      <SectionHeading>
        Trusted by teams <Quiet>that need it right.</Quiet>
      </SectionHeading>

      <SectionLede>
        We produce for organizers, corporate groups, and apparel labels across
        Malaysia and the wider region.
      </SectionLede>

      {/* border-t, not border-y: the grid below opens with its own rule, so a
          bottom border here just drew a second line 56px away with an empty
          band between the two. The grid's rule closes the carousel instead. */}
      <div className="mt-14 border-t rule py-10 sm:mt-20 sm:py-12">
        <LogoCarousel />
      </div>

      <dl className={`${DIVIDED_GRID} sm:grid-cols-2 lg:grid-cols-4`}>
        {SEGMENTS.map((segment) => (
          <div
            key={segment.label}
            className={dividedCell(4)}
          >
            <dt
              className={`${CELL_TITLE} text-lg uppercase leading-[0.95]`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {segment.label}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed dim">
              {segment.detail}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
