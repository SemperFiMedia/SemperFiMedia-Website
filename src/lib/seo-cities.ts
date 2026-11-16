/**
 * The cities we want to be found in on Google, in priority order.
 *
 * This is a search list, NOT a pricing promise. Where travel is included in a
 * quote is decided only by TRAVEL_INCLUDED_CITIES in service-area.ts, and some
 * cities here (Fort Worth, Royse City, Wylie) carry mileage. Never use this
 * list in a sentence about travel cost.
 */
export const PRIMARY_SEO_CITIES = [
  'Dallas',
  'Fort Worth',
  'Forney',
  'Rockwall',
  'Royse City',
  'Wylie',
] as const;

export const SECONDARY_SEO_CITIES = [
  'Garland',
  'Mesquite',
  'Plano',
  'Frisco',
  'Arlington',
  'Denton',
  'Irving',
] as const;

/** "Dallas, Fort Worth, Forney, Rockwall, Royse City, and Wylie" */
export function seoCityList(): string {
  const cities: string[] = [...PRIMARY_SEO_CITIES];
  const last = cities.pop();
  return `${cities.join(', ')}, and ${last}`;
}

/** "Dallas, Fort Worth, Forney, Rockwall, Royse City, Wylie" */
export function seoCityListShort(): string {
  return PRIMARY_SEO_CITIES.join(', ');
}

/** schema.org areaServed: every city in both lists. */
export function seoAreaServed() {
  return [...PRIMARY_SEO_CITIES, ...SECONDARY_SEO_CITIES].map((name) => ({
    '@type': 'City',
    name: `${name}, TX`,
  }));
}
