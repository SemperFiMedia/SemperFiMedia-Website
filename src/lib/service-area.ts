/**
 * Single source of truth for where travel is included and what it costs past
 * that. Every surface that states a travel promise imports from here.
 *
 * Why a named city list rather than a radius: a radius forces the client to do
 * geometry off a map, and our own boundaries did not fit a tidy circle — the
 * east edge (Rockwall, 22.3 miles from downtown Dallas) sits well outside the
 * north and west edges (Addison 12.9, Irving at 635 13.4). Naming the towns is
 * unambiguous for the buyer and trivial to adjust.
 *
 * This file exists because the mileage rate itself was wrong on seven separate
 * surfaces before 2026-08-24 — $0.67 in six places, $0.75 in one. Change a
 * number or a town here and every page follows.
 */

/** Towns where travel is included in the quoted price, no mileage line. */
export const TRAVEL_INCLUDED_CITIES = [
  'Dallas',
  'Oak Cliff',
  'South Dallas',
  'Garland',
  'Mesquite',
  'Irving',
  'Addison',
  'Rockwall',
  'Forney',
  'Plano',
] as const;

/** Dollars per mile beyond the included area. */
export const MILEAGE_RATE = 0.75;
export const MILEAGE_RATE_LABEL = `$${MILEAGE_RATE.toFixed(2)}`;

/**
 * Where the mileage clock starts. Stating this is not pedantry — the rate
 * without an origin is unbillable, and the chatbot had begun telling visitors
 * "from Forney" on its own initiative because nothing here said otherwise.
 */
export const MILEAGE_ORIGIN = 'Dallas';

/** "$0.75/mile from Dallas" — use wherever the rate is quoted. */
export const MILEAGE_RATE_PHRASE = `${MILEAGE_RATE_LABEL}/mile from ${MILEAGE_ORIGIN}`;

/** "Dallas, Oak Cliff, … and Plano" */
export function travelIncludedList(): string {
  const cities = [...TRAVEL_INCLUDED_CITIES];
  const last = cities.pop();
  return `${cities.join(', ')}, and ${last}`;
}

/** "Dallas, Oak Cliff, … Plano" — no conjunction, for tighter copy. */
export function travelIncludedListShort(): string {
  return TRAVEL_INCLUDED_CITIES.join(', ');
}

/** The full policy, for FAQs and rate sheets. */
export function travelPolicySentence(): string {
  return `Travel is included in ${travelIncludedList()}. Anywhere else, ${MILEAGE_RATE_PHRASE}, plus lodging where an overnight is required — quoted before you book, never added after.`;
}

/** Compact version, for configurator fine print and cards. */
export function travelPolicyShort(): string {
  return `Travel included in ${travelIncludedList()}. Beyond that, ${MILEAGE_RATE_PHRASE}, quoted up front.`;
}

/** Spanish, for the /es site. */
export function travelPolicySentenceEs(): string {
  const cities = [...TRAVEL_INCLUDED_CITIES];
  const last = cities.pop();
  return `El viaje está incluido en ${cities.join(', ')} y ${last}. Fuera de esa área, ${MILEAGE_RATE_LABEL}/milla medido desde ${MILEAGE_ORIGIN}, más hospedaje cuando aplica — cotizado antes de reservar, nunca agregado después.`;
}
