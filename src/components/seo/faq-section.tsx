import { DataLabel } from '@/components/primitives/data-label';
import { FaqJsonLd } from '@/components/seo/structured-data';

type Props = {
  eyebrow: string;
  heading: string;
  items: { q: string; a: string }[];
};

/** The FAQ list a visitor reads, plus FAQPage markup built from the same text. */
export function FaqSection({ eyebrow, heading, items }: Props) {
  return (
    <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28">
      <FaqJsonLd items={items} />
      <div className="mx-auto max-w-[900px]">
        <DataLabel className="mb-4">{eyebrow}</DataLabel>
        <h2 className="mb-10 font-serif text-4xl italic leading-tight md:text-5xl">{heading}</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-bone/10 pb-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl italic transition-colors hover:text-brass">
                {item.q}
                <span className="text-brass transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-bone-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
