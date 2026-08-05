import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";
import {
  CoverflowCarousel,
  type CoverflowSlide,
} from "@/components/ui/coverflow-carousel";
import { PRODUCTS } from "@/content/portfolio";

/* One slide per garment. The subtitle carries the decoration method where the
   client's own filename states one, and is simply absent otherwise rather than
   carrying an invented label. */
const slides: CoverflowSlide[] = PRODUCTS.map((product) => ({
  src: product.card,
  alt: product.title,
  title: product.title,
  subtitle: product.detail ?? product.method,
  href: `/portfolio/${product.slug}`,
}));

export default function GalleryPage() {
  return (
    <Section id="portfolio" label="Product portfolio" tone="dark">
      <SectionHeading>
        Work we have <Quiet>put into production.</Quiet>
      </SectionHeading>

      <SectionLede>
        {PRODUCTS.length} garments manufactured for events, corporate programs,
        and apparel labels. Drag the deck, or use the arrow keys.
      </SectionLede>

      {/* aspect 0.88 is the shape the photographs were shot at, so the garments
          sit in the frame uncropped. */}
      <div className="mt-10 sm:mt-14">
        <CoverflowCarousel
          slides={slides}
          aspect={0.88}
          cardWidth="clamp(180px, 26vw, 300px)"
          label="Product portfolio"
          showCaption
          showPagination
          showNavigation
          /* Radius is derived from --cf-card, the width the component already
             publishes, so it holds the same 5% proportion whether the card is
             180px on a phone or 300px on a desktop. A fixed radius drifts:
             16px is 5% of a 300px card but 9% of a 180px one, which reads as a
             different shape rather than the same card scaled. */
          cardClassName="rounded-[calc(var(--cf-card)*0.05)]"
        />
      </div>
    </Section>
  );
}
