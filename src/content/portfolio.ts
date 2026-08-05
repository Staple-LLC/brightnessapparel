/* Portfolio — the client's real product photography.

   Everything here derives from the filenames in src/assets/portfolio, so
   adding a garment is a matter of dropping a photo in and re-running the
   converter. Nothing in this file needs editing for a new product.

   The originals live at   src/assets/portfolio/*.png        (40 MB, not shipped)
   and are converted into  src/assets/portfolio/cards/*.webp (520px, the deck)
                           src/assets/portfolio/full/*.webp  (1200px, the page)

   To re-run after adding photos, see scripts/convert-portfolio.py. */

const cardImages = import.meta.glob("../assets/portfolio/cards/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const fullImages = import.meta.glob("../assets/portfolio/full/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/* Words that must not be title-cased into "Fc" / "Dtf". */
const ACRONYMS = new Set(["fc", "tc", "cvc", "dtf", "dtg"]);

/* Only the names the humaniser cannot get right on its own. EDIT HERE to
   correct any product name — the key is the filename, slugified.

   "Den" is the client's own abbreviation and is left as written rather than
   expanded to a guess. */
const TITLE_OVERRIDES: Record<string, string> = {
  "airism-dtf-print-oversized-outer-cotton-inner-poly-spandex":
    "“Airism” DTF Print Oversized Tee",
};

/* A second line for the few products whose name carries more than fits a
   title. Same rule: edit freely, absence is fine. */
const DETAIL_OVERRIDES: Record<string, string> = {
  "airism-dtf-print-oversized-outer-cotton-inner-poly-spandex":
    "Outer cotton, inner poly spandex",
};

/* Decoration methods, matched against words that are already in the filename —
   this reads the client's own naming, it does not infer anything. The first
   five mirror the Printing & decoration section so the vocabulary agrees. */
const METHODS: [RegExp, string][] = [
  [/\bsublimation\b/, "Sublimation"],
  [/\bdtf\b/, "DTF printing"],
  [/\bdtg\b/, "DTG printing"],
  [/\bembroidered|embroidery\b/, "Embroidery"],
  [/\bsilk-screen\b/, "Silk screen"],
  [/\bgold-foil\b/, "Gold foil print"],
  [/\bneon-printing\b/, "Neon print"],
  [/\bphoto-print\b/, "Photo print"],
  [/\bfull-print\b/, "Full print"],
  [/\bhigh-den\b/, "High-density print"],
  [/\bjacquard\b/, "Jacquard"],
];

/* Connectives stay lower case, or a long product name reads as a shout:
   "Jogger Pants With Zipper Pocket And Drawstring". */
const SMALL_WORDS = new Set(["with", "and", "for", "of", "in", "on", "to"]);

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word, i) => {
      if (ACRONYMS.has(word)) return word.toUpperCase();
      /* t-shirt arrives as two words; capitalise the bare "t". */
      if (word === "t") return "T";
      if (i > 0 && SMALL_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/\bT Shirt\b/, "T-Shirt");
}

export type Product = {
  slug: string;
  title: string;
  /** Decoration method read out of the filename, when there is one. */
  method?: string;
  detail?: string;
  card: string;
  full: string;
};

export const PRODUCTS: Product[] = Object.entries(cardImages)
  .map(([path, card]) => {
    const slug = path.split("/").pop()!.replace(".webp", "");
    const fullKey = Object.keys(fullImages).find((k) => k.endsWith(`/${slug}.webp`));
    const method = METHODS.find(([re]) => re.test(slug))?.[1];

    return {
      slug,
      title: TITLE_OVERRIDES[slug] ?? titleFromSlug(slug),
      method,
      detail: DETAIL_OVERRIDES[slug],
      card,
      /* Falls back to the card image so a missing full-size render degrades to
         a soft picture rather than a broken one. */
      full: fullKey ? fullImages[fullKey] : card,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export function getProduct(slug: string | undefined) {
  return PRODUCTS.find((p) => p.slug === slug);
}
