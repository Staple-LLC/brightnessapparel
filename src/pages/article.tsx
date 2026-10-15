import { Link, useParams } from "react-router-dom";
import { Section, SectionHeading, Quiet } from "@/components/section";
import { ARTICLES, getArticle, type Block, coverFor } from "@/content/articles";
import { CoverImage } from "@/components/cover-image";

function renderText(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      : part
  );
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "image":
      return (
        <figure key={i} className="mt-8">
          <a href={block.src} target="_blank" rel="noreferrer" aria-label={`View full-size image: ${block.alt}`}>
            <img src={block.src} alt={block.alt} loading="lazy" decoding="async" className="h-auto w-full rounded-lg" />
          </a>
        </figure>
      );
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
              {renderText(item)}
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
          {renderText(block.text)}
        </p>
      );
    default:
      return (
        <p key={i} className="dim mt-6 text-base leading-relaxed sm:text-lg">
          {renderText(block.text)}
        </p>
      );
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <Section id="journal-article" label="Blog" tone="light">
        <SectionHeading>
          Article <Quiet>not found.</Quiet>
        </SectionHeading>
        <Link
          to="/journal"
          className="mt-10 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
        >
          <span aria-hidden="true">←</span> Back to blog
        </Link>
      </Section>
    );
  }

  /* Next article in the list, wrapping at the end, so a reader always has
     somewhere to go rather than hitting a dead end. */
  const index = ARTICLES.findIndex((a) => a.slug === article.slug);
  const next = ARTICLES[(index + 1) % ARTICLES.length];
  const cover = coverFor(article.slug);

  return (
    <Section id="journal-article" label="Blog" tone="light">
      {/* Cover art leads, when there is any. Wider than the text measure
          below — a hero that matched the 2xl reading column would read as an
          inline figure rather than the top of the piece. */}
      {cover && article.preserveCover ? (
        <img src={cover} alt={article.title} className="mb-12 h-auto w-full rounded-xl" fetchPriority="high" />
      ) : cover && (
        <div className="mb-12 aspect-[16/9] w-full overflow-hidden rounded-xl bg-foreground/[0.06]">
          <CoverImage src={cover} eager />
        </div>
      )}

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

        {!article.preserveCover && <p className="mt-6 border-b rule pb-10 text-lg leading-relaxed">
          {article.excerpt}
        </p>}

        {article.body.map(renderBlock)}
      </article>

      <nav className="mt-16 flex flex-col gap-6 border-t rule pt-8 sm:flex-row sm:items-baseline sm:justify-between">
        <Link
          to="/journal"
          className="inline-flex min-h-[44px] items-center gap-3 self-start text-sm uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
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
