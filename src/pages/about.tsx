import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";
import { FactoryVideo } from "@/components/factory-video";
import { FOUNDED, ADDRESS, COUNTRY } from "@/content/company";

const mkmaLogo = new URL("../assets/mkma.jpeg", import.meta.url).href;

const DETAILS: [string, string][] = [
  ["Founded", String(FOUNDED)],
  ["Based in", `${ADDRESS}, ${COUNTRY}`],
  ["Specialism", "OEM apparel manufacturing"],
  ["Serving", "Events, corporates, retail labels"],
  ["Production capacity", "700,000+ units per year"],
];

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

    </Section>
  );
}
