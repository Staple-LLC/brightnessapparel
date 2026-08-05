import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";

const FIELD =
  "w-full border-b rule bg-transparent py-3 text-sm text-foreground placeholder:opacity-40 focus:border-foreground focus:outline-none";
const LABEL = "text-[11px] uppercase tracking-[0.24em] dim-sm";

export default function ReachUsPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

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

          {/* WhatsApp is the faster path for most enquiries, so it leads.
              PLACEHOLDER NUMBER — replace with the real business line. */}
          <a
            href={`https://wa.me/60000000000?text=${encodeURIComponent(
              "Hi Brightness Apparel, I'd like to enquire about production."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[hsl(var(--brand))] px-7 py-4 text-sm font-medium text-foreground transition-transform hover:scale-[1.02]"
          >
            Message us on WhatsApp
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>

          <div className="mt-8 space-y-1 text-sm dim">
            <p>Based in Malaysia — working with brands worldwide.</p>
            <p>
              <a
                href="mailto:hello@brightnessapparel.com"
                className="underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                hello@brightnessapparel.com
              </a>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          {sent ? (
            <div className="border-t rule pt-8">
              <h3
                className="text-3xl uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Brief received.
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed dim">
                Thank you for reaching out. We'll review your production details
                and get back to you with the next step.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border-t rule pt-8"
            >
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={LABEL}>
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                    className={FIELD}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={LABEL}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="message" className={LABEL}>
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="What you want to manufacture, quantity, timeline..."
                  className={`${FIELD} resize-none`}
                />
              </div>

              <Button type="submit" size="lg" className="group mt-10 gap-3 px-8">
                Send Brief
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
