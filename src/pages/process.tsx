import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";

const STEPS = [
  {
    number: "01",
    title: "Send your brief",
    detail: "Garment type, quantity, target date, and any reference artwork.",
  },
  {
    number: "02",
    title: "Quotation",
    detail: "Costing against fabric, decoration method, and order quantity.",
  },
  {
    number: "03",
    title: "Sample & approval",
    detail: "A physical sample to sign off on fit, colour, and construction.",
  },
  {
    number: "04",
    title: "Deposit & scheduling",
    detail: "Production slot confirmed once the sample and deposit are settled.",
  },
  {
    number: "05",
    title: "Bulk production",
    detail: "Cutting, sewing, decoration, labelling, and pressing.",
  },
  {
    number: "06",
    title: "QC & delivery",
    detail: "Inspected against the approved sample, then packed and dispatched.",
  },
];

export default function ProcessPage() {
  return (
    <Section id="process" label="How to order" tone="brand">
      <SectionHeading>
        From brief <Quiet>to delivery.</Quiet>
      </SectionHeading>

      <SectionLede>
        Six steps, with a clear decision point at each one. Nothing moves to
        bulk until you have approved a physical sample.
      </SectionLede>

      {/* Walkthrough map: a connecting rule runs behind the row on wide
          screens, so the six steps read as one continuous track. */}
      <ol className="relative mt-16 grid gap-10 sm:mt-24 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-[7px] hidden h-px bg-foreground/30 lg:block"
        />
        {STEPS.map((step) => (
          <li key={step.number} className="relative">
            <span
              aria-hidden="true"
              className="mb-5 hidden h-[15px] w-[15px] rounded-full border-[3px] border-[hsl(var(--brand))] bg-foreground lg:block"
            />
            <span className="text-xs tracking-[0.2em] dim lg:hidden">
              {step.number}
            </span>
            <h3
              className="mt-3 text-lg uppercase leading-[0.95] lg:mt-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed dim">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
