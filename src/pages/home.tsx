import {heroContent} from "@/cms/content";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SpecularButton from "@/components/ui/specular-button";

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
      /* min-h-screen is 100vh, which on a phone is the viewport with the URL
         bar RETRACTED — so at first paint the buttons sit below the fold,
         under the browser chrome. min-h-svh is the small viewport (chrome
         shown) and always fits. It is listed second because Tailwind emits
         it after screen, so browsers without svh drop it and keep the vh
         fallback. dvh is wrong here: it resizes mid-scroll and reflows. */
      className="hero-stage relative z-10 mt-[calc(var(--nav-h)*-1)] flex min-h-screen min-h-svh flex-col overflow-hidden bg-[#4a2a20] text-background"
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
      {/* In normal flow below lg, absolute only from lg up.
          It used to be absolute at top-[54%] at every size while the subline
          and buttons were anchored to the bottom and grew upward — so on a
          short viewport the two met and overlapped. A phone with browser
          chrome is ~620px, not the 812px a bare emulator reports, and the
          longer subline closed the remaining gap. Flow cannot overlap.
          Absolute positioning is only needed at lg, where the headline has to
          sit behind the model. */}
      <h1
        className="relative z-[1] mt-auto lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-0 lg:mt-0 lg:flex lg:items-center"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {/* Desktop size and offsets are plate coordinates times --u (see
            .hero-stage in index.css), so the composition is locked to the
            model and only scales on resize. 160 / 1271 are x-positions in the
            source plate; 1271 clears her right edge at plate x=1236 at every
            viewport. Mobile keeps a plain centred line. */}
        <span className="mx-auto block w-full max-w-7xl px-6 text-[clamp(3.25rem,13.5vw,11rem)] uppercase leading-[0.82] tracking-[-0.02em] text-background sm:px-10 lg:relative lg:max-w-none lg:pl-[calc(160*var(--u))] lg:pr-0 lg:text-[calc(241*var(--u))]">
          <span>{heroContent.headlineStart}</span>{" "}
          <span className="lg:absolute lg:left-[calc(1271*var(--u))] lg:top-0">
            {heroContent.headlineEnd}
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
      {/* flex-1 only from lg: below it the headline above takes the free space
          via mt-auto, which is what stacks the two rather than letting them
          overlap. pt is small on mobile for the same reason — it is now the
          gap under the headline, not clearance for the nav. */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-12 pt-6 sm:px-10 lg:flex-1 lg:px-16 lg:pt-28">
        {/* max-w-xl, not lg: the specular buttons carry more padding than the
            ones they replaced and the pair needs 527px, which wrapped inside
            the old 512px measure. The subline sets its own max-w-md, so this
            only widens the button row. */}
        <div className="max-w-xl">
          {/* max-w-lg, up from md: this line is half again as long as the one
              it replaced and ran to four lines on the old measure. */}
          <p className="animate-fade-rise-delay-2 max-w-lg text-sm leading-relaxed text-background/75 sm:text-base">
            {heroContent.description}
          </p>

          <div className="animate-fade-rise-delay-3 mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {/* Both CTAs are SpecularButton. The primary keeps a solid fill
                (tintOpacity 1) rather than the component's default glass —
                two identical translucent buttons would leave the hero with no
                primary action. Its rim light is brand orange, which reads on
                white where the default white line would not.

                radius 999 clamps to a pill, matching every other button on
                the site; the shader clamps its own corner to height/2. */}
            <SpecularButton
              size="lg"
              radius={999}
              tint="#ffffff"
              tintOpacity={1}
              textColor="hsl(0 0% 6%)"
              lineColor="#ff640a"
              baseColor="#d4d4d4"
              intensity={1.4}
              proximity={280}
              /* Transparent border of the same width as the outlined button
                 beside it, so both border boxes measure the same — otherwise
                 the pair sit 2px apart in height on one row. */
              style={{ ["--sb-border" as string]: "1px solid transparent" }}
              className="group"
              onClick={() => navigate("/contact")}
            >
              {/* The component wraps every child in one .specular-button__label
                  span, so the button's own flex gap never reaches in here — the
                  block-level badge below would drop onto its own line. This row
                  is what keeps label and badge side by side. */}
              <span className="flex items-center gap-3">
                {heroContent.primaryButton}
                {/* Two arrows in a clipped circle: one leaves, the next arrives. */}
                <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[hsl(var(--brand))] text-foreground">
                  <ArrowRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-6 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute size-3.5 -translate-x-6 transition-transform duration-300 ease-out group-hover:translate-x-0 motion-reduce:hidden"
                  />
                </span>
              </span>
            </SpecularButton>

            {/* The glass variant, as designed. --sb-border is the fallback
                edge: the shine only fades in as the pointer nears, so without
                it this button is invisible until approached — and invisible
                outright on a touch screen, where there is no pointer at all. */}
            <SpecularButton
              size="lg"
              radius={999}
              textColor="hsl(0 0% 100%)"
              lineColor="#ffffff"
              baseColor="#8a8a8a"
              blur={4}
              proximity={280}
              style={{ ["--sb-border" as string]: "1px solid rgba(255,255,255,0.7)" }}
              onClick={() =>
                document
                  .getElementById("studio")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {/* h-7 matches the arrow badge opposite, so both buttons enclose
                  the same 28px inner box and end up the same height. */}
              <span className="flex h-7 items-center">{heroContent.secondaryButton}</span>
            </SpecularButton>
          </div>
        </div>
      </div>
    </section>
  );
}
