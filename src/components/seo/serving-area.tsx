import { seoCityList } from '@/lib/seo-cities';

/**
 * One sentence naming the cities we film in, placed above a page's final CTA.
 * Says where we work, never what travel costs: that is service-area.ts.
 */
export function ServingArea({ eventType }: { eventType: string }) {
  return (
    <section className="border-t border-brass/15 bg-black px-6 py-10 md:px-12">
      <p className="mx-auto max-w-[1200px] text-center text-bone-muted">
        Filming {eventType} across {seoCityList()} and the rest of Dallas–Fort Worth.
      </p>
    </section>
  );
}
