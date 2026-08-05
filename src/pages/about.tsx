import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";

import { FactoryVideo } from "@/components/factory-video";

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

export default function AboutPage() {
  return (
    <Section id="about" label="About" tone="light">
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

          {/* Company profile — confirm these details before launch */}
          <dl className="mt-10 grid gap-x-8 gap-y-5 border-t rule pt-6 sm:grid-cols-2">
            {[
              ["Founded", "2014"],
              ["Based in", "Malaysia"],
              ["Specialism", "OEM apparel manufacturing"],
              ["Serving", "Events, corporates, retail labels"],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-[11px] uppercase tracking-[0.2em] dim-sm">
                  {term}
                </dt>
                <dd className="mt-1 text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          <dl className="mt-12 border-t rule">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.number}
                className="grid gap-2 border-b rule py-6 sm:grid-cols-12 sm:gap-6"
              >
                <span className="text-xs tracking-[0.2em] dim-sm sm:col-span-1">
                  {principle.number}
                </span>
                <dt
                  className="text-xl uppercase leading-[0.95] sm:col-span-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {principle.title}
                </dt>
                <dd className="text-sm leading-relaxed dim sm:col-span-7">
                  {principle.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The drone loop rather than a photograph: "we have a factory" is the
            claim this section makes, and footage of the building is the most
            direct evidence for it. Native 9:16, so the column is given that
            aspect and the source is never cropped. */}
        <div className="lg:col-span-5">
          <FactoryVideo className="aspect-[9/16] max-h-[42rem] w-full bg-foreground/5 object-cover" />
        </div>
      </div>
    </Section>
  );
}
