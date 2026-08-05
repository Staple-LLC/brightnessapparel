import { useEffect, useRef } from "react";

const videoSrc = new URL("../assets/video/factory.mp4", import.meta.url).href;
const posterSrc = new URL(
  "../assets/video/factory-poster.webp",
  import.meta.url
).href;

/* Silent 9:16 drone loop of the factory.

   No `autoPlay` attribute: playback is started here instead, so a visitor who
   has asked for reduced motion never sees even a frame of movement — setting
   the attribute and pausing afterwards would flash first. play() also returns a
   promise that browsers reject when they refuse autoplay, which has to be
   swallowed or it surfaces as an unhandled rejection. */
export function FactoryVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      if (media.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        void video.play().catch(() => {
          /* Autoplay refused — the poster stays, which is a fine fallback. */
        });
      }
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={posterSrc}
      loop
      muted
      playsInline
      preload="metadata"
      /* Silent and decorative-adjacent, but it does carry information — that
         there is a real factory — so it is not hidden from assistive tech. */
      aria-label="Aerial view of the Brightness Apparel factory"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
