import {contactContent} from "@/cms/content";
import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";

const CONTACT_EMAIL = contactContent.email;
const WHATSAPP_NUMBER = contactContent.whatsappNumber;
const WHATSAPP_TEMPLATE = contactContent.whatsappMessage;

const DETAILS: { label: string; value: string; href?: string }[] = [
  {
    label: "Email",
    value: CONTACT_EMAIL,
    href: `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(CONTACT_EMAIL)}`,
  },
  { label: "Based in", value: contactContent.location },
  { label: "Minimums", value: contactContent.minimums },
];

export default function ReachUsPage() {
  return (
    <Section id="reach-us" label="Get in touch" tone="light">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading>
            {contactContent.headingStart}{" "}<Quiet>{contactContent.headingEnd}</Quiet>
          </SectionHeading>

          <SectionLede>
            {contactContent.introduction}
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
              {contactContent.buttonLabel}
              <span className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                →
              </span>
            </a>

            <p className="dim mt-6 max-w-md text-sm leading-relaxed">
              {contactContent.explanation}
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
