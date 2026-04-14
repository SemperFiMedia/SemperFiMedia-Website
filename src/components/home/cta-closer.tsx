import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';

export function CtaCloser() {
  return (
    <section
      className="bg-gradient-to-br from-gunpowder via-texas-umber to-dusk-teal px-6 py-32 text-center md:px-12 md:py-40"
      aria-label="Book a call"
    >
      <DataLabel className="mb-5">READY WHEN YOU ARE</DataLabel>
      <h2 className="font-serif text-5xl italic leading-[1.0] md:text-7xl lg:text-8xl">
        Let&apos;s tell
        <br />
        your story.
      </h2>
      <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-bone-muted">
        Book a 30-minute discovery call. I&apos;ll listen first, quote second, and if we&apos;re a
        fit we get to work.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
      </div>
    </section>
  );
}
