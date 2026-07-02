// Lead timestamps render server-side (UTC on Railway) — pin the business timezone.
export function fmtLeadDate(d: Date): string {
  return new Date(d).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Chicago',
  });
}
