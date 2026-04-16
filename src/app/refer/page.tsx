import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { ReferralForm } from '@/components/referral/referral-form';

export const metadata: Metadata = {
  title: 'Refer & Earn — $200 Per Wedding Booking | Semper Fi Media',
  description:
    'Past Semper Fi Media couples: refer an engaged friend and earn $200 back when their wedding is filmed and paid in full. Simple, fast, no fine print.',
};

const STEPS = [
  {
    n: '01',
    title: 'Send us their info',
    body: 'Fill out the form below — your name and email, plus theirs. Tell us a quick line about the wedding so we know who to expect.',
  },
  {
    n: '02',
    title: 'We follow up — same day',
    body: 'TJ reaches out personally within one business day. Free 30-min discovery call, no pressure. We let them know you sent us.',
  },
  {
    n: '03',
    title: 'You get $200',
    body: 'Once their wedding is filmed and the final invoice is paid, we send you $200 via Venmo, Zelle, or check — your call. No paperwork, no waiting.',
  },
];

export default function ReferPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">REFER &amp; EARN · WEDDING REFERRAL PROGRAM</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Send a friend.
              <br />
              Earn <span className="text-brass">$200 back.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-muted md:text-xl">
              You loved your wedding film. Now your friends are getting engaged. Send them our
              way and earn $200 back the moment their wedding is filmed and paid in full. No
              fine print, no waiting, no agency-style fulfillment headaches. Marine&apos;s
              honor.
            </p>
          </div>
        </section>

        <section className="bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-4">HOW IT WORKS</DataLabel>
            <h2 className="mb-12 font-serif text-4xl italic leading-tight md:text-5xl">
              Three steps. Same handshake.
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.n} className="border-l border-brass/40 pl-6">
                  <div className="data-label text-brass">{step.n}</div>
                  <h3 className="mt-3 font-serif text-2xl italic">{step.title}</h3>
                  <p className="mt-3 text-bone-muted leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="refer"
          className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-28"
        >
          <div className="mx-auto max-w-[900px]">
            <DataLabel className="mb-4">SEND THE REFERRAL</DataLabel>
            <h2 className="mb-3 font-serif text-4xl italic leading-tight md:text-5xl">
              Tell us about the couple.
            </h2>
            <p className="mb-10 text-bone-muted">
              Quick form — takes about 60 seconds. We&apos;ll reach out to them within one
              business day and keep you in the loop.
            </p>
            <ReferralForm />
          </div>
        </section>

        <section className="border-t border-brass/15 bg-black px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[900px]">
            <DataLabel className="mb-4 text-brass">THE FINE PRINT (THERE&apos;S BARELY ANY)</DataLabel>
            <ul className="space-y-2 text-sm text-bone-muted">
              <li className="flex gap-2">
                <span className="text-brass">›</span>
                <span>
                  $200 reward applies to wedding bookings only ($3,500 Essentials tier and up).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brass">›</span>
                <span>
                  Reward sent within 7 days of the couple&apos;s final invoice being paid in
                  full.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brass">›</span>
                <span>
                  Payout via Venmo, Zelle, or check — your preference.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brass">›</span>
                <span>
                  Refer as many couples as you want — every booked wedding earns you $200.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brass">›</span>
                <span>
                  No claim if the couple already contacted us first or comes from another
                  source.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
