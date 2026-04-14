'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DataLabel } from '@/components/primitives/data-label';

type FAQ = {
  q: string;
  a: React.ReactNode;
};

const FAQS: FAQ[] = [
  {
    q: 'How much does a video cost?',
    a: (
      <>
        Every service has published rates on the{' '}
        <Link href="/pricing" className="underline decoration-brass/60 underline-offset-4">
          pricing page
        </Link>
        . Weddings start at $3,000. Corporate brand films start at $1,500. Music videos are $3,000
        flat with 14-day delivery. Full productions are custom-quoted after a discovery call.
      </>
    ),
  },
  {
    q: 'How long does a project take from start to finish?',
    a: (
      <>
        4–8 weeks for most projects. Pre-production runs 1–2 weeks, the shoot itself is 1–3 days
        depending on scope, and post-production takes 2–4 weeks. Music videos ship in 14 days.
        Rush delivery is available for an upcharge.
      </>
    ),
  },
  {
    q: 'Do you travel outside Dallas–Fort Worth?',
    a: (
      <>
        Yes. Travel within the DFW metroplex is included. Beyond DFW we charge $0.67/mile.
        Destination weddings and multi-day out-of-state shoots are quoted separately.
      </>
    ),
  },
  {
    q: 'Who owns the final video and footage?',
    a: (
      <>
        You own the final edited film outright — use it anywhere, forever. Raw footage stays
        with Semper Fi Media by default so we can protect creative reuse (your social reels, our
        portfolio). If you want the raw files with full rights transferred to you, that's a
        separate buyout starting at 100% of the project cost.
      </>
    ),
  },
  {
    q: 'How many rounds of revisions do I get?',
    a: (
      <>
        Two rounds included in every package. You'll get a private review link via Vidflow where
        you can comment directly on the timeline by timecode — no emailing timestamps back and
        forth. Additional rounds beyond the included two are billed hourly.
      </>
    ),
  },
  {
    q: 'Can you also cut my footage into social media reels?',
    a: (
      <>
        Yes — it's one of our most-requested services. We take your finished video and cut it
        into vertical 9:16 reels built for Instagram, TikTok, and YouTube Shorts.{' '}
        <Link href="/social-reels" className="underline decoration-brass/60 underline-offset-4">
          Details here →
        </Link>
      </>
    ),
  },
  {
    q: 'What do I need to prep before the shoot?',
    a: (
      <>
        Nothing — that's what pre-production is for. After the discovery call, we handle the
        shot list, location scout, schedule, gear plan, and prep brief. You show up, we
        shoot, you go home with the hard part already done.
      </>
    ),
  },
  {
    q: 'Why does Semper Fi Media exist?',
    a: (
      <>
        Because Dallas video production either looks like a student project or costs $15k+ for
        generic agency work. We bring Marine-led discipline and cinema-grade craft at
        independent operator pricing. Half the overhead, none of the bureaucracy.
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <section
      className="bg-gunpowder px-6 py-20 md:px-12 md:py-28"
      aria-label="Frequently asked questions"
    >
      <div className="mx-auto max-w-[1000px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 md:mb-16"
        >
          <DataLabel className="mb-5">FAQ</DataLabel>
          <h2 className="font-serif text-4xl italic leading-tight md:text-5xl lg:text-6xl">
            The questions we get every week.
          </h2>
        </motion.div>

        <div className="divide-y divide-bone/10 border-y border-bone/10">
          {FAQS.map((faq, i) => (
            <motion.details
              key={faq.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.04 }}
              className="group py-6"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass">
                <h3 className="font-serif text-xl italic md:text-2xl">{faq.q}</h3>
                <span
                  aria-hidden="true"
                  className="mt-1 font-mono text-2xl text-brass transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-4 max-w-3xl leading-relaxed text-bone-muted">{faq.a}</div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
