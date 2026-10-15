import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";
import { Link } from "react-router-dom";
import { ARTICLES, coverFor, HAS_COVERS } from "@/content/articles";
import { CoverImage } from "@/components/cover-image";

export default function JournalPage() {
  return (
    <Section id="journal" label="Blog" tone="light">
      <SectionHeading>
        Notes from <Quiet>the factory floor.</Quiet>
      </SectionHeading>

      <SectionLede>
        Practical guidance on materials, decoration, and production planning
        for teams putting apparel into production.
      </SectionLede>

      <ul className="rule mt-14 border-t sm:mt-20">
        {ARTICLES.map((article) => {
          const cover = coverFor(article.slug);

          return (
            <li key={article.slug}>
              <Link
                to={`/journal/${article.slug}`}
                className="rule group grid gap-3 border-b py-6 transition-opacity hover:opacity-60 sm:grid-cols-12 sm:items-center sm:gap-6"
              >
                {/* The column appears only once at least one article has art,
                    so a blog with no covers reads as a clean list rather than
                    a row of empty frames. */}
                {HAS_COVERS && (
                  <div className="aspect-[3/2] overflow-hidden rounded-lg bg-foreground/[0.06] sm:col-span-3">
                    {cover && <CoverImage src={cover} preserve={article.preserveCover} />}
                  </div>
                )}

                <div className={HAS_COVERS ? "sm:col-span-9" : "sm:col-span-12"}>
                  <div className="dim-sm flex flex-wrap items-center gap-x-4 text-[11px] uppercase tracking-[0.2em]">
                    <time dateTime={article.iso}>{article.date}</time>
                    <span>{article.category}</span>
                  </div>

                  <h3
                    className="mt-2 text-xl uppercase leading-[0.95]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {article.title}
                  </h3>

                  {/* max-w-2xl so the excerpt keeps a readable measure instead
                      of running the full width of the band. */}
                  <p className="dim mt-2 max-w-2xl text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
