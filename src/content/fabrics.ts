/* Fabric library — folder-driven from src/assets/fabric.

   Everything shown is read out of the filename, so adding a fabric is a matter
   of dropping a swatch in and naming it well:

       Diamond Mesh 135GSM Microfiber.jpeg
       └ name ──────┘ └GSM┘ └ category ┘

   Category comes from a keyword anywhere in the name, GSM from any run of
   numbers before "GSM", and the name is what is left. Weights may be listed
   with underscores — 155_190GSM reads as 155 and 190 — because a filename
   cannot contain a slash. */

const files = import.meta.glob(
  "../assets/fabric/*.{webp,avif,jpg,jpeg,png,WEBP,AVIF,JPG,JPEG,PNG}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

export type FabricCategory = {
  id: string;
  label: string;
  /** What the family is used for — shown under the tab, as in the reference. */
  blurb: string;
  /** Matched against the filename, case-insensitively. */
  match: RegExp;
  /** Classification order — lower wins. Independent of tab order. */
  priority: number;
};

/* Listed in the order the tabs appear — cotton first, as in the reference, and
   the largest families before the one-offs.

   `priority` is separate because it answers a different question. Several
   names carry two keywords: "Cotton Feel Mesh 150GSM Microfiber" is a
   microfiber, and "Polo Cotton Lacoste_Pique" is a pique. Classification runs
   most-specific-first so the broad cotton match only catches what nothing else
   claimed — which is the opposite of the order they should be shown in. */
export const CATEGORIES: FabricCategory[] = [
  {
    id: "cotton",
    label: "Cotton",
    blurb: "Tees, hoodies, casualwear",
    match: /cotton|cvc|french terry|fleece/i,
    priority: 4,
  },
  {
    id: "microfiber",
    label: "Microfiber",
    blurb: "Performance jerseys, sublimation",
    match: /microfiber/i,
    priority: 2,
  },
  {
    id: "pique",
    label: "Pique",
    blurb: "Polo shirts, uniforms",
    match: /pique/i,
    priority: 1,
  },
  {
    id: "spandex",
    label: "Spandex",
    blurb: "Activewear, compression",
    match: /spandex|lycra/i,
    priority: 3,
  },
  {
    id: "other",
    label: "Other",
    blurb: "Specialty and jacquard",
    match: /.^/, // matches nothing; this is the fallback bucket
    priority: 99,
  },
];

const BY_PRIORITY = [...CATEGORIES].sort((a, b) => a.priority - b.priority);

export type Fabric = {
  file: string;
  name: string;
  gsm: number[];
  category: string;
  src: string;
};

/* Any run of 2–3 digit numbers, separated by _ or /, immediately before GSM. */
const GSM = /(\d{2,4}(?:\s*[_/]\s*\d{2,4})*)\s*GSM/i;

function tidy(name: string) {
  return (
    name
      /* An underscore between two word characters stands in for a slash the
         filesystem will not accept; anywhere else it is decoration. */
      .replace(/(?<=\w)_(?=\w)/g, "/")
      .replace(/_/g, "")
      /* "60pct" reads back as "60%". A literal % cannot live in a filename:
         it opens a percent-escape, and "% C" is not two hex digits, so
         decodeURI throws and the page fails to load — not just the image.
         scripts/optimize-photos.py rewrites % to pct on the way in. */
      .replace(/(\d+)\s*pct\b/gi, "$1%")
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

export const FABRICS: Fabric[] = Object.entries(files)
  .map(([path, src]) => {
    const file = path.split("/").pop()!;
    const stem = file.replace(/\.[^.]+$/, "");

    const gsmMatch = GSM.exec(stem);
    const gsm = gsmMatch
      ? gsmMatch[1].split(/[_/]/).map((n) => Number(n.trim())).filter(Boolean)
      : [];

    const category =
      BY_PRIORITY.find((c) => c.id !== "other" && c.match.test(stem))?.id ??
      "other";

    return {
      file,
      name: tidy(gsmMatch ? stem.replace(gsmMatch[0], " ") : stem),
      gsm,
      category,
      src,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

export function fabricsIn(category: string) {
  return FABRICS.filter((f) => f.category === category);
}

/* Only categories that actually have swatches become tabs. */
export const ACTIVE_CATEGORIES = CATEGORIES.filter(
  (c) => fabricsIn(c.id).length > 0
);
