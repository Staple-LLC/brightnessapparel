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
    let frame = 0;

    /* Playback is gated on the video being on screen. Calling play() on mount
       buffers the whole 1.7MB file, which was acceptable when this lived on a
       route somebody chose to open; on the home page it would land on every
       visitor, including the ones who never scroll this far. Pausing on the
       way out costs nothing and stops decoding a video nobody is watching.

       Measured on scroll rather than through an IntersectionObserver, matching
       the nav spy and the stat counters. */
    const sync = () => {
      frame = 0;
      const rect = video.getBoundingClientRect();
      const onScreen = rect.top < window.innerHeight && rect.bottom > 0;

      if (media.matches || !onScreen) {
        video.pause();
        if (media.matches) video.currentTime = 0;
        return;
      }
      if (video.paused) {
        void video.play().catch(() => {
          /* Autoplay refused — the poster stays, which is a fine fallback. */
        });
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    media.addEventListener("change", sync);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      media.removeEventListener("change", sync);
      cancelAnimationFrame(frame);
    };
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
