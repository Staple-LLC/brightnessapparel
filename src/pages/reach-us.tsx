import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";

const CONTACT_EMAIL = "hello@brightnessapparel.com";

/* PLACEHOLDER NUMBER — replace with the real business line. WhatsApp is now
   the only way to start an enquiry, so nothing on this site reaches the client
   until this is a working number. */
const WHATSAPP_NUMBER = "60000000000";

/* The form used to collect these four things. Prefilling the message keeps
   that structure without a form to submit — the enquiry arrives already
   itemised rather than as "hi, do you make shirts?". */
const WHATSAPP_TEMPLATE = [
  "Hi Brightness Apparel, I'd like to enquire about production.",
  "",
  "Garment:",
  "Quantity:",
  "Target date:",
  "Artwork / reference:",
].join("\n");

const DETAILS: { label: string; value: string; href?: string }[] = [
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: "Based in", value: "Malaysia — working with brands worldwide" },
  { label: "Minimums", value: "Discussed per garment and decoration method" },
];

export default function ReachUsPage() {
  return (
    <Section id="reach-us" label="Get in touch" tone="light">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading>
            Start your <Quiet>production brief.</Quiet>
          </SectionHeading>

          <SectionLede>
            Share what you want to produce, your target quantity, timeline, and
            any reference garments or artwork.
          </SectionLede>
        </div>

        <div className="lg:col-span-7">
          <div className="rule border-t pt-8">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                WHATSAPP_TEMPLATE
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] items-center gap-3 rounded-full bg-[hsl(var(--brand))] px-8 py-5 text-base font-medium text-foreground transition-transform hover:scale-[1.02] motion-reduce:transition-none"
            >
              Message us on WhatsApp
              <span className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                →
              </span>
            </a>

            <p className="dim mt-6 max-w-md text-sm leading-relaxed">
              The chat opens with a short checklist already filled in — garment,
              quantity, target date, and artwork. Answer what you know and we
              will come back with a quote.
            </p>

            <dl className="mt-12 text-sm">
              {DETAILS.map((row) => (
                <div
                  key={row.label}
                  className="rule flex flex-col gap-1 border-t py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <dt className="dim-sm text-[11px] uppercase tracking-[0.18em]">
                    {row.label}
                  </dt>
                  <dd className="sm:text-right">
                    {row.href ? (
                      <a
                        href={row.href}
                        className="underline underline-offset-4 transition-opacity hover:opacity-60"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
