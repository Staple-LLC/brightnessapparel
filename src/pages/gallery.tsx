import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";

/* Everything in src/assets/samples, picked up automatically — adding a photo
   to that folder is the only step needed to put it in the gallery. Filenames
   become the caption and the alt text, so `pique-polo-navy.jpg` reads better
   than `IMG_4821.jpg`. Currently seeded with the unbranded product mockups;
   replace them with photographs of real production. */
const files = import.meta.glob("../assets/samples/*.{webp,jpg,jpeg,png,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const SAMPLES = Object.entries(files)
  .map(([path, src]) => {
    const slug = path.split("/").pop()!.replace(/\.[^.]+$/, "");
    return {
      slug,
      src,
      name: slug
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export default function GalleryPage() {
  return (
    <Section id="portfolio" label="Product portfolio" tone="light">
      <SectionHeading>
        Samples we have <Quiet>put into production.</Quiet>
      </SectionHeading>

      <SectionLede>
        Garments produced across event apparel, uniforms, and brand
        manufacturing programs.
      </SectionLede>

      {SAMPLES.length === 0 ? (
        <p className="dim mt-14 text-sm">
          No samples yet — add images to <code>src/assets/samples</code> and
          they will appear here automatically.
        </p>
      ) : (
        <ul className="mt-14 grid grid-cols-2 gap-4 sm:mt-20 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {SAMPLES.map((sample) => (
            <li key={sample.slug}>
              <figure className="group">
                <div className="overflow-hidden bg-foreground/5">
                  <img
                    src={sample.src}
                    alt={sample.name}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="dim-sm mt-3 text-[11px] uppercase tracking-[0.2em]">
                  {sample.name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
