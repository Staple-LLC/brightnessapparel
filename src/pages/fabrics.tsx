import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";

/* Portrait source: this column renders at roughly 3:4, so a landscape image
   would lose most of its width to object-cover. */
const stitchImage = new URL("../assets/fabrics-stack.webp", import.meta.url).href;

const FABRICS = [
  {
    name: "Cotton",
    use: "Tees, hoodies, casualwear",
    description:
      "Breathable and soft against the skin. The default for everyday retail garments and comfortable branded wear.",
  },
  {
    name: "Spandex",
    use: "Activewear, compression",
    description:
      "Blended in for stretch and recovery, so garments move with the body and hold their shape after wear.",
  },
  {
    name: "Microfiber",
    use: "Performance jerseys",
    description:
      "Lightweight and quick-drying with excellent sublimation take-up. A staple for race and team apparel.",
  },
  {
    name: "Pique",
    use: "Polo shirts, uniforms",
    description:
      "Textured knit with a structured surface and good airflow. The standard choice for corporate polos.",
  },
  {
    name: "Fleece",
    use: "Hoodies, outerwear",
    description:
      "Brushed inner face for warmth and weight. Used for pullovers, zip-ups, and cooler-weather pieces.",
  },
  {
    name: "Eyelet",
    use: "Ventilated sportswear",
    description:
      "Open mesh structure that moves air and moisture away from the body during sustained activity.",
  },
];

export default function FabricsPage() {
  return (
    <Section id="fabrics" label="Our fabric materials" tone="dark">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeading>
            Material first, <Quiet>then everything else.</Quiet>
          </SectionHeading>

          <SectionLede>
            Fabric decides how a garment fits, breathes, prints, and lasts. We
            help match the material to how the piece will actually be used.
          </SectionLede>

          <dl className="mt-12 border-t rule">
            {FABRICS.map((fabric) => (
              <div
                key={fabric.name}
                className="grid gap-2 border-b rule py-6 sm:grid-cols-12 sm:gap-6"
              >
                <dt
                  className="text-xl uppercase leading-[0.95] sm:col-span-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {fabric.name}
                </dt>
                <span className="text-[11px] uppercase tracking-[0.2em] dim-sm sm:col-span-3">
                  {fabric.use}
                </span>
                <dd className="text-sm leading-relaxed dim sm:col-span-6">
                  {fabric.description}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm dim">
            Working with something not listed? We source to specification —
            send us the fabric reference and we will quote against it.
          </p>
        </div>

        <div className="lg:col-span-5">
          <img
            src={stitchImage}
            alt="Stacked folded fabrics showing knit, ribbed, mesh and jersey textures"
            className="h-full max-h-[40rem] w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </Section>
  );
}
