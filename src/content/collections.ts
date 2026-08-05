/* Portfolio collections.

   PLACEHOLDER — the collection names and covers below are stand-ins. The covers
   are the unbranded product mockups, not photographs of real production.

   To fill a collection, drop photographs into a folder named after its slug:

       src/assets/samples/marathon-kits/01.jpg
       src/assets/samples/marathon-kits/02.jpg

   They are picked up automatically: the first image becomes the cover, and the
   count comes from however many are in the folder. Nothing here needs editing
   except the titles. Until a folder has images, the card says so rather than
   showing an invented number. */

const images = import.meta.glob(
  "../assets/samples/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

/* Fallback covers so the strip reads as designed before any real photography
   exists. Remove these once every collection has its own folder. */
const placeholderCovers = import.meta.glob(
  "../assets/samples/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const coverPool = Object.entries(placeholderCovers)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

/* Group everything under src/assets/samples/<slug>/ by its folder. */
const byFolder: Record<string, string[]> = {};
for (const [path, url] of Object.entries(images)) {
  const match = path.match(/samples\/([^/]+)\/[^/]+$/);
  if (!match) continue;
  (byFolder[match[1]] ||= []).push(url);
}
for (const key of Object.keys(byFolder)) byFolder[key].sort();

type Defined = { slug: string; title: string; blurb: string };

const DEFINED: Defined[] = [
  {
    slug: "marathon-kits",
    title: "Marathon & race kits",
    blurb: "Sublimated microfiber jerseys for races and running clubs.",
  },
  {
    slug: "corporate-uniforms",
    title: "Corporate uniforms",
    blurb: "Embroidered pique polos and staff apparel programs.",
  },
  {
    slug: "team-apparel",
    title: "Team apparel",
    blurb: "Eyelet mesh training kit with names and numbers.",
  },
  {
    slug: "streetwear-runs",
    title: "Streetwear runs",
    blurb: "Heavyweight fleece with custom labelling and hangtags.",
  },
  {
    slug: "workwear",
    title: "Workwear",
    blurb: "Hard-wearing garments built for daily use on site.",
  },
  {
    slug: "event-merchandise",
    title: "Event merchandise",
    blurb: "Short-run apparel for activations and launches.",
  },
];

export type Collection = Defined & {
  images: string[];
  cover?: string;
  count: number;
};

export const COLLECTIONS: Collection[] = DEFINED.map((entry, i) => {
  const found = byFolder[entry.slug] ?? [];
  return {
    ...entry,
    images: found,
    cover: found[0] ?? coverPool[i % Math.max(1, coverPool.length)],
    count: found.length,
  };
});

export function getCollection(slug: string | undefined) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
