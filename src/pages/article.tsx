import { Link, useParams } from "react-router-dom";
import { Section, SectionHeading, Quiet } from "@/components/section";
import { ARTICLES, getArticle, type Block } from "@/content/articles";

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h":
      return (
        <h2
          key={i}
          className="mt-12 text-2xl uppercase leading-[0.95] sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul key={i} className="mt-6 border-t rule">
          {block.items.map((item) => (
            <li key={item} className="dim border-b rule py-3 text-base leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <p
          key={i}
          className="mt-8 border-l-2 border-[hsl(var(--brand))] py-1 pl-5 text-base leading-relaxed"
        >
          {block.text}
        </p>
      );
    default:
      return (
        <p key={i} className="dim mt-6 text-base leading-relaxed sm:text-lg">
          {block.text}
        </p>
      );
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <Section id="journal-article" label="Journal" tone="light">
        <SectionHeading>
          Article <Quiet>not found.</Quiet>
        </SectionHeading>
        <Link
          to="/journal"
          className="mt-10 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
        >
          <span aria-hidden="true">←</span> Back to journal
        </Link>
      </Section>
    );
  }

  /* Next article in the list, wrapping at the end, so a reader always has
     somewhere to go rather than hitting a dead end. */
  const index = ARTICLES.findIndex((a) => a.slug === article.slug);
  const next = ARTICLES[(index + 1) % ARTICLES.length];

  return (
    <Section id="journal-article" label="Journal" tone="light">
      {/* Constrained measure: the band's full width is far too wide to read
          comfortably at body size. */}
      <article className="max-w-2xl">
        <div className="dim-sm flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.2em]">
          <time dateTime={article.iso}>{article.date}</time>
          <span>{article.category}</span>
          <span>{article.readingTime}</span>
        </div>

        <h1
          className="mt-5 text-[2rem] uppercase leading-[0.95] tracking-[-0.015em] sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {article.title}
        </h1>

        <p className="mt-6 border-b rule pb-10 text-lg leading-relaxed">
          {article.excerpt}
        </p>

        {article.body.map(renderBlock)}
      </article>

      <nav className="mt-16 flex flex-col gap-6 border-t rule pt-8 sm:flex-row sm:items-baseline sm:justify-between">
        <Link
          to="/journal"
          className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
        >
          <span aria-hidden="true">←</span> All articles
        </Link>

        <Link to={`/journal/${next.slug}`} className="group max-w-sm sm:text-right">
          <span className="dim-sm text-[11px] uppercase tracking-[0.2em]">
            Next
          </span>
          <span
            className="mt-2 block text-lg uppercase leading-[0.95] transition-opacity group-hover:opacity-60"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {next.title}
          </span>
        </Link>
      </nav>
    </Section>
  );
}
