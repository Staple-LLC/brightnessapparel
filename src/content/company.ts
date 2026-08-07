/* Company facts, in one place.

   The founding year is quoted in three spots — the hero's "30+ Years", the
   About profile, and the years counter on the home page — so it lives here and
   the elapsed figure is computed rather than written down. A hardcoded "36"
   would be wrong next January. */

export const FOUNDED = 1990;

export const ADDRESS = "55-3, Jalan Ledang, Taman Bandar, Batu Pahat, Johor";

export const COUNTRY = "Malaysia";

export function yearsInOperation(now = new Date()) {
  return now.getFullYear() - FOUNDED;
}
