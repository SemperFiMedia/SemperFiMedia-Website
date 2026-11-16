import { DataLabel } from '@/components/primitives/data-label';
import { revisionRoundsPhrase } from '@/lib/revisions';

/** The four steps every event job follows. Only the shoot day differs by page. */
export function HowItWorks({ shootDay }: { shootDay: string }) {
  const steps = [
    {
      title: 'Discovery call',
      body: 'Free, 30 minutes. You give us the date, the venue, the run of show and what the video has to do. We tell you what coverage that takes.',
    },
    {
      title: 'Plan and quote',
      body: 'A written quote with crew size, hours, deliverables and travel spelled out. Nothing gets added after you sign.',
    },
    { title: 'The shoot', body: shootDay },
    {
      title: 'Edit and review',
      body: `Color, sound and licensed music, then a private Vidflow link where you comment on the timeline. Every package includes ${revisionRoundsPhrase()}.`,
    },
  ];
  return (
    <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <DataLabel className="mb-5">HOW IT WORKS</DataLabel>
        <h2 className="font-serif text-3xl italic md:text-4xl">Four steps. No surprises.</h2>
        <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title}>
              <DataLabel tone="muted" className="text-[11px]">
                STEP {i + 1}
              </DataLabel>
              <h3 className="mt-2 font-serif text-xl italic">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-bone-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
