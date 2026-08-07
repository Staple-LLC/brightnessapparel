/* Instagram posts and reels.

   Folder-driven. This is a static site with no server, and Instagram's API
   needs an app registration plus a token that expires and must be refreshed —
   a token shipped to the browser would be public. So the media are files.

   That is also what the sites running reel walls are doing: the Instagram
   watermark burned into the corner of their tiles is the one the app adds when
   you download your own reel, which only happens if the file went through
   somebody's downloads folder on its way to the page.

   Filenames are read as:  [01-] shortcode [.reel]

     C8xKp2LtAbc.webp        -> photo, links to /p/C8xKp2LtAbc/
     C8xKp2LtAbc.reel.mp4    -> reel, plays inline, links to /reel/C8xKp2LtAbc/
     03-C8xKp2LtAbc.reel.mp4 -> same, sorted third
     anything-else.webp      -> links to the profile

   A video takes its poster from an image with the same stem, so
   C8xKp2LtAbc.reel.mp4 pairs with C8xKp2LtAbc.reel.webp and that image is not
   also shown as a tile of its own. */

/* The options have to be written out at each call site. Vite analyses
   import.meta.glob statically at build time, so a shared constant here — which
   reads better — leaves it unable to resolve the arguments and the module
   fails to load. tsc is happy with it either way, so this only shows up in the
   browser. */
const imageFiles = import.meta.glob(
  "../assets/instagram/*.{webp,jpg,jpeg,png,WEBP,JPG,JPEG,PNG}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const videoFiles = import.meta.glob(
  "../assets/instagram/*.{mp4,mov,MP4,MOV}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

/* Taken from the embed of the post supplied — confirm this is the account the
   site should point at before launch. */
export const INSTAGRAM_HANDLE = "oem_apparel";

export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

/* Reels get their own path rather than relying on /p/ redirecting: that
   redirect is Instagram's behaviour to change, and the correct URL costs
   nothing to write. Shortcodes are 11 characters of [A-Za-z0-9_-]; the
   optional number prefix exists so ordering and deep-linking are not mutually
   exclusive. */
const NAME = /^(?:\d+[-_])?([A-Za-z0-9_-]{11})(\.reel)?$/;

const stemOf = (path: string) =>
  path.split("/").pop()!.replace(/\.(webp|jpe?g|png|mp4|mov)$/i, "");

export type InstagramPost = {
  stem: string;
  /** Image URL, or the poster for a video. */
  src?: string;
  /** Present only for reels, which play in place. */
  video?: string;
  href: string;
  deepLinked: boolean;
  isReel: boolean;
};

function linkFor(stem: string) {
  const match = NAME.exec(stem);
  const shortcode = match?.[1];
  const isReel = Boolean(match?.[2]);
  return {
    href: shortcode
      ? `https://www.instagram.com/${isReel ? "reel" : "p"}/${shortcode}/`
      : INSTAGRAM_URL,
    deepLinked: Boolean(shortcode),
    isReel,
  };
}

/* Stems that belong to a video, so the paired poster is not also listed as its
   own tile. */
const videoStems = new Set(Object.keys(videoFiles).map(stemOf));

const posters = new Map(
  Object.entries(imageFiles).map(([path, url]) => [stemOf(path), url])
);

const videos: InstagramPost[] = Object.entries(videoFiles).map(([path, url]) => {
  const stem = stemOf(path);
  return {
    stem,
    src: posters.get(stem),
    video: url,
    ...linkFor(stem),
    /* A file named .mp4 is a reel whether or not the name says so. */
    isReel: true,
  };
});

const images: InstagramPost[] = Object.entries(imageFiles)
  .filter(([path]) => !videoStems.has(stemOf(path)))
  .map(([path, url]) => {
    const stem = stemOf(path);
    return { stem, src: url, ...linkFor(stem) };
  });

export const POSTS: InstagramPost[] = [...videos, ...images].sort((a, b) =>
  a.stem.localeCompare(b.stem)
);
