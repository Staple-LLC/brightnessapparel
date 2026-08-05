import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const heroPlate = new URL("../assets/hero-motion.webp", import.meta.url).href;
const heroSubject = new URL("../assets/hero-subject.webp", import.meta.url).href;

export default function HomePage() {
  const navigate = useNavigate();

  return (
    /* data-tone="dark" is load-bearing: the sticky nav reads it to invert to
       white, and it scopes the shared .dim / .rule band utilities. */
    <section
      id="home"
      data-tone="dark"
      className="hero-stage relative z-10 mt-[calc(var(--nav-h)*-1)] flex min-h-screen flex-col overflow-hidden bg-[#4a2a20] text-background"
    >
      {/* Layer 1 — full plate, including the motion smear. Anchored left
          because cover has to crop somewhere and the right edge is empty
          field. The subject layer below uses identical sizing, and both
          sources share an aspect of 1.792, so they register exactly. */}
      <img
        src={heroPlate}
        alt="Model in technical apparel, captured with long-exposure motion blur"
        className="absolute inset-0 h-full w-full object-cover object-[46%_50%] lg:object-left"
      />

      {/* Layer 2 — the slogan, which the subject then cuts across. It stays a
          real <h1> in the DOM, so screen readers get the full line even though
          the middle of it is visually occluded. */}
      {/* Desktop: sits high so the line crosses the narrow top of her head
          rather than its widest point — lower down, the occlusion swallows
          whole letters. Mobile: the crop leaves her filling the frame with
          only ~14px of clear band, so the line drops to the lower third and
          the occlusion layer is disabled entirely (see below). */}
      <h1
        className="absolute inset-x-0 top-[54%] z-[1] lg:bottom-0 lg:top-0 lg:flex lg:items-center"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {/* Desktop size and offsets are plate coordinates times --u (see
            .hero-stage in index.css), so the composition is locked to the
            model and only scales on resize. 160 / 1271 are x-positions in the
            source plate; 1271 clears her right edge at plate x=1236 at every
            viewport. Mobile keeps a plain centred line. */}
        <span className="mx-auto block w-full max-w-7xl px-6 text-[clamp(3.25rem,13.5vw,11rem)] uppercase leading-[0.82] tracking-[-0.02em] text-background sm:px-10 lg:relative lg:max-w-none lg:pl-[calc(160*var(--u))] lg:pr-0 lg:text-[calc(241*var(--u))]">
          <span>Made to</span>{" "}
          <span className="lg:absolute lg:left-[calc(1271*var(--u))] lg:top-0">
            spec.
          </span>
        </span>
      </h1>

      {/* Layer 3 — subject only, matted out of the same frame. Sitting above
          the slogan is what puts the type behind her. Desktop only: on a phone
          the crop makes her fill the frame, so this layer would bury the
          slogan wherever it sat. She is still present via the plate below. */}
      <img
        src={heroSubject}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] hidden h-full w-full object-cover object-[46%_50%] lg:block lg:object-left"
      />

      {/* Layer 4 — anything that has to stay readable sits above the subject. */}
      {/* The eyebrow strapline is gone: it collided with the raised slogan and
          repeated what the subline already says. */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-12 pt-28 sm:px-10 lg:px-16">
        <div className="max-w-lg">
          <p className="animate-fade-rise-delay-2 max-w-md text-sm leading-relaxed text-background/75 sm:text-base">
            Performance apparel, uniforms, and retail-ready collections,
            manufactured in Malaysia.
          </p>

          <div className="animate-fade-rise-delay-3 mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button
              size="lg"
              className="group gap-3 bg-background px-8 text-foreground hover:bg-background/90"
              onClick={() => navigate("/contact")}
            >
              Discuss a Project
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Button>

            {/* Not variant="glass": that utility hardcodes a near-white fill
                for the light theme and wins on layer order. */}
            <Button
              variant="ghost"
              size="lg"
              className="border border-background/40 px-8 text-background backdrop-blur-sm hover:border-background hover:bg-background/10 hover:text-background"
              onClick={() =>
                document
                  .getElementById("studio")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Capabilities
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
