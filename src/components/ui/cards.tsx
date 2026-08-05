import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  title: string;
  subtitle: string;
  imageUrl?: string;
  /** When present the card renders as a router link rather than a bare div. */
  href?: string;
}

export interface HoverRevealCardsProps {
  items: CardItem[];
  className?: string;
  cardClassName?: string;
}

/**
 * Grid of cards with a hover-reveal effect: hovering one card de-emphasises
 * the rest. The `group` class on the container is what lets a child restyle
 * its siblings on parent hover.
 *
 * Adapted from the reference implementation in three ways:
 *
 *  1. Cards render as <Link> when given an `href`. The original made a <div>
 *     focusable with tabIndex, which puts it in the tab order without giving
 *     it a role, a name, or Enter-key behaviour. A real anchor gets all three
 *     for free and is announced as a link.
 *  2. The image is an <img>, not a CSS background. Backgrounds cannot be lazy
 *     loaded, carry no alt text, and are invisible to the preload scanner —
 *     which matters for a gallery of photographs.
 *  3. `text-2l` in the original is not a Tailwind class and silently rendered
 *     at the inherited size; corrected here.
 */
const HoverRevealCards: React.FC<HoverRevealCardsProps> = ({
  items,
  className,
  cardClassName,
}) => {
  return (
    <ul
      className={cn(
        "group grid w-full grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {items.map((item) => {
        const inner = (
          <>
            <div className="absolute inset-0 overflow-hidden bg-foreground/10">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            {/* Gradient scrim so the caption holds regardless of the photo. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.12em] opacity-80 sm:tracking-[0.2em]">
                {item.subtitle}
              </p>
              <h3
                className="mt-1 text-base uppercase leading-[0.95] sm:text-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>
            </div>
          </>
        );

        const classes = cn(
          "relative block aspect-[3/4] overflow-hidden",
          "transition-all duration-500 ease-in-out motion-reduce:transition-none",
          /* Siblings recede while any card in the group is hovered… */
          "group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px]",
          /* …and the one actually under the cursor comes back. */
          "hover:!scale-[1.03] hover:!opacity-100 hover:!blur-none",
          "focus-visible:!scale-[1.03] focus-visible:!opacity-100 focus-visible:!blur-none",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          cardClassName
        );

        return (
          <li key={item.id}>
            {item.href ? (
              <Link to={item.href} className={classes}>
                {inner}
              </Link>
            ) : (
              <div className={classes}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default HoverRevealCards;
