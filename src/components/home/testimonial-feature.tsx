import { DataLabel } from '@/components/primitives/data-label';
import type { Testimonial } from '@/sanity/types';

type Props = {
  testimonial: Testimonial;
};

export function TestimonialFeature({ testimonial }: Props) {
  const stars = '★'.repeat(testimonial.rating ?? 5);
  return (
    <section
      className="border-y border-brass/15 bg-gradient-to-b from-gunpowder to-black px-6 py-24 text-center md:px-12 md:py-32"
      aria-label="Featured testimonial"
    >
      <DataLabel className="mb-6">
        {stars} · {testimonial.source || 'GOOGLE'} REVIEW
      </DataLabel>
      <blockquote className="mx-auto max-w-4xl font-serif text-3xl italic leading-snug md:text-4xl lg:text-5xl">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <DataLabel tone="muted" className="mt-8">
        {testimonial.author}
        {testimonial.authorTitle ? ` · ${testimonial.authorTitle}` : ''}
      </DataLabel>
    </section>
  );
}
