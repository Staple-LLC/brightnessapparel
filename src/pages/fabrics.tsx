import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";
import { ACTIVE_CATEGORIES, fabricsIn, FABRICS } from "@/content/fabrics";

export default function FabricsPage() {
  return (
    <Section id="fabrics" label="Material library" tone="dark">
      <SectionHeading>
        Material first, <Quiet>then everything else.</Quiet>
      </SectionHeading>

      <SectionLede>
        Fabric decides how a garment fits, breathes, prints, and lasts. We help
        match the material to how the piece will actually be used.
      </SectionLede>

      {FABRICS.length === 0 ? null : (
        <div className="mt-14 sm:mt-20">
          {ACTIVE_CATEGORIES.map((category) => {
            const swatches = fabricsIn(category.id);

            return (
              /* Each family is a band: name on the left, its swatches filling
                 the rest. The rule sits on the row rather than between rows so
                 the first family gets one too, which closes the gap under the
                 lede. */
              <div
                key={category.id}
                className="rule grid gap-6 border-t py-10 lg:grid-cols-12 lg:gap-8"
              >
                <div className="lg:col-span-2">
                  <h3
                    className="text-2xl uppercase leading-none sm:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {category.label}
                  </h3>
                  {/* Comma-separated in the data, one use per line here — it
                      reads as a label rather than a sentence, which is what
                      the reference does. */}
                  <p className="dim-sm mt-3 text-[11px] uppercase leading-relaxed tracking-[0.2em]">
                    {category.blurb.split(", ").map((use) => (
                      <span key={use} className="block">
                        {use}
                      </span>
                    ))}
                  </p>
                </div>

                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:col-span-10 lg:grid-cols-5">
                  {swatches.map((fabric) => (
                    <li
                      key={fabric.file}
                      className="overflow-hidden rounded-lg bg-background/[0.06]"
                    >
                      <img
                        src={fabric.src}
                        alt={`${fabric.name} fabric swatch`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-square w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="text-[11px] uppercase leading-tight tracking-[0.06em]">
                          {fabric.name}
                        </p>
                        {fabric.gsm.length > 0 && (
                          <p className="dim-sm mt-1 text-[11px] italic tabular-nums">
                            {fabric.gsm.map((g) => `${g}GSM`).join(", ")}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
