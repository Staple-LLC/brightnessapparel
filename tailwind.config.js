import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  future: {
    /* Wraps every hover:/group-hover: rule in @media (hover: hover). Without
       it a tap on a touch screen latches :hover until the next tap elsewhere —
       most visibly on the portfolio cards, where the tapped card's siblings
       stay scaled down and blurred after you navigate back. Desktop is
       unaffected: pointers report hover: hover. */
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ring: "hsl(var(--ring))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
