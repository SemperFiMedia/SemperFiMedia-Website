import { DataLabel } from '@/components/primitives/data-label';
import type { Testimonial } from '@/sanity/types';

type Props = {
  testimonials: Testimonial[];
  eyebrow?: string;
  heading?: string;
  limit?: number;
};

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div aria-label={`${rating} out of 5 stars`} className="text-brass">
      {'★'.repeat(rating)}
      <span className="text-bone-subtle">{'★'.repeat(5 - rating)}</span>
    </div>
  );
}

export function TestimonialsGrid({
  testimonials,
  eyebrow = 'WHAT CLIENTS SAY',
  heading = 'Reviewed by the people who hired us.',
  limit,
}: Props) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;
  if (items.length === 0) return null;

  return (
    <section
      className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-28"
      aria-label="Client testimonials"
    >
      <div className="mx-auto max-w-[1200px]">
        <DataLabel className="mb-4">{eyebrow}</DataLabel>
        <h2 className="mb-12 font-serif text-4xl italic leading-tight md:text-5xl">
          {heading}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t._id}
              className="flex h-full flex-col border border-bone/15 bg-black/40 p-7"
            >
              <Stars rating={t.rating ?? 5} />
              <blockquote className="mt-5 flex-1 font-serif text-lg italic leading-snug text-bone">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-bone/10 pt-4">
                <div className="font-medium text-bone">{t.author}</div>
                {t.authorTitle && (
                  <div className="text-sm text-bone-muted">{t.authorTitle}</div>
                )}
                {t.source && (
                  <DataLabel tone="muted" className="mt-2 text-[10px]">
                    {t.source} Review
                  </DataLabel>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
