/* Reels — short vertical video, self-hosted.

   Folder-driven like everything else: drop an .mp4 into src/assets/reels, run
   scripts/optimize-reels.py, and it appears. The poster is the image with the
   same stem, which the script writes for you.

   The filename becomes the caption, so name them for a reader:

       01-marathon-kit-run.mp4   ->  "Marathon Kit Run"
       03-embroidery-close.mp4   ->  "Embroidery Close"

   A file named only with digits (1.mp4) gets no caption rather than a tile
   labelled "1". */

const videoFiles = import.meta.glob("../assets/reels/*.{mp4,mov,MP4,MOV}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const posterFiles = import.meta.glob(
  "../assets/reels/*.{webp,jpg,jpeg,png,WEBP,JPG,JPEG,PNG}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const stemOf = (path: string) =>
  path.split("/").pop()!.replace(/\.[^.]+$/, "");

const posters = new Map(
  Object.entries(posterFiles).map(([path, url]) => [stemOf(path), url])
);

/* Words that stay lower case inside a caption. */
const SMALL = new Set(["and", "with", "for", "of", "in", "on", "to", "the"]);

function captionFrom(stem: string) {
  const words = stem.replace(/^\d+[-_]?/, "").split(/[-_]+/).filter(Boolean);
  if (words.length === 0) return undefined; // a bare number is not a caption
  return words
    .map((word, i) =>
      i > 0 && SMALL.has(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export type Reel = {
  stem: string;
  video: string;
  poster?: string;
  caption?: string;
};

export const REELS: Reel[] = Object.entries(videoFiles)
  .map(([path, video]) => {
    const stem = stemOf(path);
    return {
      stem,
      video,
      poster: posters.get(stem),
      caption: captionFrom(stem),
    };
  })
  /* Numeric-aware, so 10.mp4 sorts after 9.mp4 rather than after 1.mp4. */
  .sort((a, b) => a.stem.localeCompare(b.stem, undefined, { numeric: true }));
