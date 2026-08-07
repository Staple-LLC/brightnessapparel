/* Client logo carousel.

   The source logos vary wildly — aspect ratios from 0.57 to 4.75, and most
   carrying 58-84% transparent padding — so sizing them by height alone would
   let the wide marks dominate. They are pre-processed into src/assets/logos:
   trimmed, scaled to a common optical AREA rather than a common height, then
   centred on a shared 400x200 canvas. That lets this component use one box
   size for all of them and still have them read as evenly weighted. */
const files = import.meta.glob("../assets/logos/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/* Display names are derived from filenames — replace with the exact registered
   company names, since these become the accessible labels. */
const LOGOS = Object.entries(files)
  .map(([path, src]) => {
    const slug = path.split("/").pop()!.replace(".webp", "");
    return { slug, src, name: slug.charAt(0).toUpperCase() + slug.slice(1) };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export function LogoCarousel() {
  /* Rendered twice so translating the track -50% lands on an identical frame
     and the loop is seamless. The clones are hidden from assistive tech. */
  const track = [...LOGOS, ...LOGOS];

  return (
    <div className="marquee-mask group relative overflow-hidden motion-reduce:overflow-x-auto">
      <ul className="animate-marquee flex w-max items-center group-hover:[animation-play-state:paused]">
        {track.map((logo, i) => {
          const isClone = i >= LOGOS.length;
          return (
            <li key={`${logo.slug}-${i}`} className="shrink-0 px-5 sm:px-7 lg:px-9">
              <img
                src={logo.src}
                alt={isClone ? "" : logo.name}
                aria-hidden={isClone || undefined}
                /* Not lazy: the track scrolls horizontally, so deferred images
                   pop in mid-animation and leave gaps. The whole set is 196KB
                   and the browser dedupes the duplicated URLs. */
                decoding="async"
                width={400}
                height={200}
                /* Full colour, at full opacity. These were previously
                   greyscaled and held at 60% — the usual "logo wall" treatment
                   — which on a white band left them looking washed out rather
                   than understated. The marks carry their own brand colours;
                   the files themselves are colour, so nothing but CSS was
                   muting them. */
                className="h-14 w-28 object-contain sm:h-20 sm:w-40 lg:h-24 lg:w-48"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
