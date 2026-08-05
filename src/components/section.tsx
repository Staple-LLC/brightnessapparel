import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionTone = "light" | "dark" | "brand";

/* Every band is a solid colour with a hard edge, and all content hangs off one
   shared left margin. Descendants express hierarchy with opacity rather than
   fixed greys, so the same markup reads correctly on white, black, or orange. */
const TONE: Record<SectionTone, string> = {
  light: "bg-background text-foreground",
  dark: "bg-foreground text-background",
  brand: "bg-[hsl(var(--brand))] text-foreground",
};

export function Section({
  id,
  label,
  tone = "light",
  children,
}: {
  id: string;
  label: string;
  tone?: SectionTone;
  children: ReactNode;
}) {
  return (
    <section id={id} data-tone={tone} className={cn("relative z-10", TONE[tone])}>
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <div className="rule border-t pt-4">
          <p className="band-label text-[11px] uppercase tracking-[0.28em]">
            / {label}
          </p>
        </div>
        <div className="mt-10 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}

/* Shared display heading. `Quiet` dims the trailing clause without hardcoding a
   grey, so it survives on any band tone. */
export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="max-w-4xl text-[2.25rem] uppercase leading-[0.9] tracking-[-0.015em] sm:text-5xl lg:text-6xl"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {children}
    </h2>
  );
}

/* Opacity composites differently against white, black, and orange, so the exact
   value is set per band in index.css rather than fixed here — a single value
   that looks right on white drops to 2.4:1 on the orange band. */
export function Quiet({ children }: { children: ReactNode }) {
  return <span className="quiet">{children}</span>;
}

/* Divided column grids (Services, Why choose us, One stop, Clientele).
   The gap must match the cell's padding or text sits hard against the rule —
   previously the cells had `pr-6` against a 1px gap, so the breathing room was
   24px on one side and 1px on the other. Row-end cells drop both the border
   and that padding, so no rule is left hanging at the container edge and the
   last column's text wraps on the same measure as the rest. */
export const DIVIDED_GRID = "grid gap-x-8 gap-y-10 border-t rule";

export function dividedCell(lgCols: 3 | 4) {
  return cn(
    "rule py-6 sm:border-r sm:pr-8",
    "sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:pr-0",
    "lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(2n)]:pr-8",
    lgCols === 4
      ? "lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(4n)]:pr-0"
      : "lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:pr-0"
  );
}

/* Holds two lines so a title that wraps does not push its description out of
   line with its neighbours. Em-based, so it tracks whatever size it is used at. */
export const CELL_TITLE = "min-h-[1.9em]";

export function SectionLede({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 max-w-2xl text-base leading-relaxed dim sm:text-lg">
      {children}
    </p>
  );
}
