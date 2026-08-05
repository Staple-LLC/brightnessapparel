import { Section, SectionHeading, SectionLede, Quiet } from "@/components/section";
import { Link } from "react-router-dom";
import { ARTICLES } from "@/content/articles";

export default function JournalPage() {
  return (
    <Section id="journal" label="Journal" tone="light">
      <SectionHeading>
        Notes from <Quiet>the factory floor.</Quiet>
      </SectionHeading>

      <SectionLede>
        Practical guidance on materials, decoration, and production planning
        for teams putting apparel into production.
      </SectionLede>

      <ul className="mt-14 border-t rule sm:mt-20">
        {ARTICLES.map((article) => (
          <li key={article.slug}>
            <Link
              to={`/journal/${article.slug}`}
              className="group grid gap-2 border-b rule py-6 transition-opacity hover:opacity-60 sm:grid-cols-12 sm:items-baseline sm:gap-6"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] dim-sm sm:col-span-2">
                {article.date}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] dim-sm sm:col-span-2">
                {article.category}
              </span>
              <h3
                className="text-xl uppercase leading-[0.95] sm:col-span-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {article.title}
              </h3>
              <p className="text-sm leading-relaxed dim sm:col-span-4">
                {article.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
