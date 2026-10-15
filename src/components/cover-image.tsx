import { useState } from "react";
import { cn } from "@/lib/utils";

/* Blog covers arrive in whatever shape the author had to hand — a 16:9
   render, a square product shot, a tall infographic. The frames they go into
   are fixed (3:2 in the listing, 16:9 on the article) so rows stay aligned,
   which leaves the fit to object-fit.

   object-cover is right for landscape art and wrong for everything else: a
   736x1104 infographic dropped into a 16:9 frame keeps only the middle 414px
   of its 1104, which cuts off the title and the footer and leaves a headless
   diagram. So anything that is not comfortably landscape is contained on the
   frame's panel instead of being cropped — the whole graphic survives, and
   the bars read as a card rather than a mistake.

   The measurement has to happen on load because naturalWidth is 0 until the
   file arrives; until then the image is treated as landscape, which is the
   common case and avoids a visible swap for it. */
const LANDSCAPE = 1.3;

type Props = {
  src: string;
  className?: string;
  /* The article hero is the first thing in the band, so it opts out of lazy
     loading; listing thumbnails keep it. */
  eager?: boolean;
  preserve?: boolean;
};

export function CoverImage({ src, className, eager, preserve }: Props) {
  const [contain, setContain] = useState(false);

  return (
    <img
      src={src}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={(event) => {
        const img = event.currentTarget;
        if (img.naturalHeight > 0) {
          setContain(img.naturalWidth / img.naturalHeight < LANDSCAPE);
        }
      }}
      className={cn(
        "h-full w-full",
        contain || preserve ? "object-contain" : "object-cover",
        className,
      )}
    />
  );
}
