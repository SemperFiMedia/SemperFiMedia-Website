export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Whole dollars, with thousands separators: 1500 -> "$1,500". */
export function formatPrice(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}
