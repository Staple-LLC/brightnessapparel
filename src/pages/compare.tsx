import { useEffect, useState } from "react";
import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";
import { POSTS } from "@/content/instagram";

/* TEMPORARY — a side-by-side of the two ways to put Instagram on the page, so
   the choice can be made by looking rather than from a table. Delete this file
   and its route in App.tsx once decided. */

/* The segment after /reel/ or /p/ in a post URL. Typed as string rather than
   inferred as a literal, or the placeholder check below becomes a type error
   the moment a real value is filled in. */
const SHORTCODE: string = "DbrzolfiMa_";
const IS_REEL = false;

/** Bytes and request count pulled from anything served by Instagram. */
function useInstagramCost() {
  const [cost, setCost] = useState({ requests: 0, kb: 0, cookies: 0 });

  useEffect(() => {
    const tally = () => {
      const entries = performance
        .getEntriesByType("resource")
        .filter((e) => /instagram|cdninstagram|fbcdn/.test(e.name));
      setCost({
        requests: entries.length,
        kb: Math.round(
          entries.reduce(
            (sum, e) => sum + ((e as PerformanceResourceTiming).transferSize || 0),
            0
          ) / 1024
        ),
        cookies: document.cookie ? document.cookie.split(";").length : 0,
      });
    };
    tally();
    const timer = setInterval(tally, 1500);
    return () => clearInterval(timer);
  }, []);

  return cost;
}

function Facts({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-2 text-sm">
      {items.map((item) => (
        <li key={item} className="dim flex gap-3 leading-relaxed">
          <span aria-hidden="true">—</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ComparePage() {
  const cost = useInstagramCost();
  const reel = POSTS.find((p) => p.video);
  const embedSrc = `https://www.instagram.com/${IS_REEL ? "reel" : "p"}/${SHORTCODE}/embed`;

  return (
    <Section id="compare" label="Comparison — temporary page" tone="light">
      <SectionHeading>
        Self-hosted <Quiet>versus embedded.</Quiet>
      </SectionHeading>

      <SectionLede>
        The same idea rendered both ways. Look at the shape, the styling, and
        how each one sits against the rest of the page — then delete this page.
      </SectionLede>

      <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ---------------------------------------------------------------- */}
        <div>
          <h3
            className="text-2xl uppercase leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Self-hosted
          </h3>
          <p className="dim-sm mt-2 text-[11px] uppercase tracking-[0.2em]">
            What is built now
          </p>

          <div className="mt-6 w-44 overflow-hidden rounded-lg bg-foreground/[0.06] sm:w-52">
            {reel ? (
              <video
                poster={reel.src}
                muted
                loop
                playsInline
                autoPlay
                className="aspect-[9/16] h-full w-full object-cover"
              >
                <source src={reel.video} type="video/mp4" />
              </video>
            ) : (
              <div className="dim-sm flex aspect-[9/16] items-center justify-center text-[10px] uppercase tracking-[0.2em]">
                No reel in the folder
              </div>
            )}
          </div>

          <Facts
            items={[
              "Your tile shape, your radius, your carousel — it sits inside the band like everything else.",
              "0.61 MB for this reel, and nothing downloads until it scrolls into view.",
              "No third-party scripts, no cookies, no requests leaving your domain.",
              "The tile stays if the post is later deleted or the account goes private.",
              "Cost: you download and rename a file per post.",
            ]}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        <div>
          <h3
            className="text-2xl uppercase leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Official embed
          </h3>
          <p className="dim-sm mt-2 text-[11px] uppercase tracking-[0.2em]">
            Paste a URL, Instagram renders it
          </p>

          <div className="mt-6 overflow-hidden rounded-lg border rule">
            {SHORTCODE === "PASTE_HERE" ? (
              <div className="dim flex aspect-[4/5] items-center justify-center px-6 text-center text-sm leading-relaxed">
                Put a real shortcode in SHORTCODE at the top of
                src/pages/compare.tsx to see this side render.
              </div>
            ) : (
              <iframe
                src={embedSrc}
                title="Instagram embed"
                className="h-[560px] w-full"
                frameBorder={0}
                scrolling="no"
                allow="encrypted-media"
              />
            )}
          </div>

          <Facts
            items={[
              "Instagram's card — their white background, their fonts, their header and caption row. It cannot be a 9:16 tile.",
              "One iframe per post, each loading a whole mini Instagram page.",
              "Sets Instagram cookies and reports the visit to Meta. Your site currently loads no third-party anything.",
              "If the post is deleted or the account goes private, the embed turns into an error card.",
              "Cost: none — it updates itself and you never touch a file.",
            ]}
          />

          <dl className="rule mt-8 border-t pt-4 text-sm">
            <div className="flex justify-between py-1">
              <dt className="dim-sm text-[11px] uppercase tracking-[0.18em]">
                Instagram requests on this page
              </dt>
              <dd className="tabular-nums">{cost.requests}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="dim-sm text-[11px] uppercase tracking-[0.18em]">
                Transferred
              </dt>
              <dd className="tabular-nums">{cost.kb} KB</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="dim-sm text-[11px] uppercase tracking-[0.18em]">
                Cookies on this document
              </dt>
              <dd className="tabular-nums">{cost.cookies}</dd>
            </div>
          </dl>
          <p className="dim-sm mt-3 text-xs leading-relaxed">
            Counts update every 1.5s. Third-party cookies set inside the iframe
            belong to instagram.com and will not show here — this only counts
            what lands on your own document.
          </p>
        </div>
      </div>
    </Section>
  );
}
