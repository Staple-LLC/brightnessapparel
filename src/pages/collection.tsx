import { Link, useParams } from "react-router-dom";
import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";
import { getProduct, PRODUCTS } from "@/content/portfolio";

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProduct(slug);

  if (!product) {
    return (
      <Section id="portfolio" label="Product portfolio" tone="light">
        <SectionHeading>
          Product <Quiet>not found.</Quiet>
        </SectionHeading>
        <Link
          to="/portfolio"
          className="rule mt-10 inline-flex min-h-[44px] items-center gap-3 text-sm uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
        >
          <span aria-hidden="true">←</span> All products
        </Link>
      </Section>
    );
  }

  /* Next garment in the same order the deck runs, so the two agree. */
  const index = PRODUCTS.findIndex((p) => p.slug === product.slug);
  const next = PRODUCTS[(index + 1) % PRODUCTS.length];

  return (
    <Section id="portfolio" label="Product portfolio" tone="light">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <img
            src={product.full}
            alt={product.title}
            /* The photograph is the reason for the page, so it is not deferred. */
            decoding="async"
            className="w-full bg-foreground/5 object-cover"
          />
        </div>

        <div className="lg:col-span-5">
          <SectionHeading>{product.title}</SectionHeading>

          {product.detail && <SectionLede>{product.detail}</SectionLede>}

          <dl className="rule mt-10 border-t text-sm">
            {product.method && (
              <div className="rule flex justify-between border-b py-4">
                <dt className="dim-sm uppercase tracking-[0.18em] text-[11px]">
                  Decoration
                </dt>
                <dd>{product.method}</dd>
              </div>
            )}
            <div className="rule flex justify-between border-b py-4">
              <dt className="dim-sm text-[11px] uppercase tracking-[0.18em]">
                Made by
              </dt>
              <dd>Brightness Apparel, Malaysia</dd>
            </div>
          </dl>

          <Link
            to="/contact"
            className="group mt-10 inline-flex min-h-[44px] items-center gap-3 rounded-full bg-[hsl(var(--brand))] px-7 py-4 text-sm font-medium text-foreground transition-transform hover:scale-[1.02]"
          >
            Produce something like this
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      <nav className="rule mt-16 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-baseline sm:justify-between">
        <Link
          to="/portfolio"
          className="inline-flex min-h-[44px] items-center gap-3 self-start text-sm uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
        >
          <span aria-hidden="true">←</span> All products
        </Link>

        <Link to={`/portfolio/${next.slug}`} className="group max-w-sm sm:text-right">
          <span className="dim-sm text-[11px] uppercase tracking-[0.2em]">
            Next
          </span>
          <span className="mt-1 block text-lg leading-snug transition-opacity group-hover:opacity-60">
            {next.title}
          </span>
        </Link>
      </nav>
    </Section>
  );
}
