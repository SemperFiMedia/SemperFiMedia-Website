'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DataLabel } from '@/components/primitives/data-label';

type Step = {
  number: string;
  title: string;
  meta: React.ReactNode;
  body: React.ReactNode;
};

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Discovery Call',
    meta: '30 min · free',
    body: (
      <>
        We meet on a call to hear the story, the audience, the deadline, and the budget. You
        leave knowing whether we're the right crew for the job. No pressure, no pitch deck.
      </>
    ),
  },
  {
    number: '02',
    title: 'Concept & Pre-Production',
    meta: '$100/hr · 1–2 weeks',
    body: (
      <>
        Treatment, shot list, location scout, schedule, and gear plan — billed hourly whether
        we're on Zoom or meeting in person. You see everything before the camera rolls. No
        guessing what you're paying for.
      </>
    ),
  },
  {
    number: '03',
    title: 'The Shoot',
    meta: (
      <>
        1–3 days ·{' '}
        <Link href="/pricing" className="underline decoration-brass/60 underline-offset-4">
          see pricing →
        </Link>
      </>
    ),
    body: (
      <>
        TJ leads every shoot personally — a Marine's discipline on prep, schedule, and execution.
        Standard jobs run solo-operator; conventions, complex music videos, and bigger brand days
        scale up to a full crew. Sony FX3 cinema rigs, cinema lenses, full lighting + audio
        package on every shoot.
      </>
    ),
  },
  {
    number: '04',
    title: 'Post-Production',
    meta: '2–4 weeks · 2 rounds of revisions',
    body: (
      <>
        Edit, color grade, sound design, and licensed music. Private review link via Vidflow —
        you comment by timecode, we lock the cut.
      </>
    ),
  },
  {
    number: '05',
    title: 'Delivery',
    meta: 'same day',
    body: (
      <>
        Every format you need: hero cut, social reels (9:16 &amp; 1:1), broadcast master,
        web-optimized, and raw selects on request.
        <span className="mt-3 block text-sm text-bone-subtle">
          *Raw footage buyouts start at 100% of project cost and transfer full media rights.
          Once delivered, Semper Fi Media retains no rights to the footage — priced to
          protect the creative reuse you and we both benefit from.
        </span>
      </>
    ),
  },
];

export function ProcessSection() {
  return (
    <section
      className="bg-black px-6 py-20 md:px-12 md:py-28"
      aria-label="How we work"
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-16 md:mb-20"
        >
          <DataLabel className="mb-5">HOW WE WORK</DataLabel>
          <h2 className="font-serif text-4xl italic leading-tight md:text-5xl lg:text-6xl">
            We run a shoot like a mission brief.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-muted">
            Clear objectives, a rehearsed plan, and no surprises on the day. Here's exactly
            what happens from your first email to final delivery.
          </p>
        </motion.div>

        <ol className="space-y-12 md:space-y-16">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.08 }}
              className="grid grid-cols-[auto_1fr] gap-6 border-l border-brass/30 pl-6 md:grid-cols-[120px_1fr] md:gap-10 md:pl-0 md:border-l-0"
            >
              <div className="font-mono text-4xl text-brass md:text-5xl">{step.number}</div>
              <div>
                <h3 className="font-serif text-2xl italic md:text-3xl">{step.title}</h3>
                <div className="mt-2 font-mono text-xs uppercase tracking-wider text-bone-subtle">
                  {step.meta}
                </div>
                <p className="mt-4 max-w-2xl leading-relaxed text-bone-muted">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
