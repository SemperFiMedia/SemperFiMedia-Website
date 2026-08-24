import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { NicheFeaturedWork } from '@/components/niche/featured-work';
import { SessionCaptureConfigurator } from '@/components/session-capture/session-capture-configurator';
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/seo/structured-data';
import { ViewContent } from '@/components/analytics/view-content';
import { getCaseStudiesByCategory } from '@/sanity/queries';
import {
  SESSION_CAPTURE_ADD_ONS,
  SESSION_CAPTURE_INCLUDES,
  SESSION_CAPTURE_POLICIES,
  SESSION_CAPTURE_PRICE,
  addOnPriceLabel,
  formatPrice,
} from '@/lib/session-capture';

export const metadata: Metadata = {
  title: 'Conference Videographer Dallas — Session Capture for Speakers',
  description:
    'Professional recording of your conference session, keynote, or panel in Dallas–Fort Worth. $1,000 flat: 4K cinema camera, dual-redundant board-feed audio, slides cut in, 14-day delivery. Vertical social clips available.',
  alternates: {
    canonical: 'https://semperfimedia.llc/session-capture',
  },
  openGraph: {
    title: 'Session Capture — Conference & Keynote Recording, Dallas–Fort Worth',
    description:
      'Your talk, recorded properly. 4K cinema camera, dual-redundant audio off the house board, slides cut in at full resolution. $1,000, delivered in 14 days.',
    url: 'https://semperfimedia.llc/session-capture',
    type: 'website',
  },
};

const TIMELINE = [
  {
    mark: 'T−60 TO T−45',
    title: 'Arrival and load-in.',
    body: 'We are in the room 45 to 60 minutes before you go on. Not because setup takes an hour, but because the ten-minute problems — a locked door, a stage change, an AV tech on break — only surface when there is time left to solve them.',
  },
  {
    mark: 'T−45',
    title: 'Camera position and sightline.',
    body: 'Camera goes up on sticks with a clear line to the stage that no one has to walk through. We pick a position that survives the room filling in — not one that works empty and gets blocked by a latecomer at minute four.',
  },
  {
    mark: 'T−35',
    title: 'Audio patch off the house board.',
    body: 'We introduce ourselves to the AV tech and ask for a line-level feed off the board. Your lavalier goes on separately and records to its own device. Two paths, no shared point of failure.',
  },
  {
    mark: 'T−20',
    title: 'Live test — with you, into the actual mic.',
    body: 'You say a few words at speaking volume through the house system. We watch both meters, set levels, and confirm the board feed is not hot and the lav is not rubbing your collar. This is the step most crews skip and every bad recording traces back to.',
  },
  {
    mark: 'T−0',
    title: 'The session.',
    body: 'Cameras roll before your introduction and keep rolling through the Q&A and the applause. Audio is monitored on headphones the entire time, so if something drifts we know in the moment instead of in the edit.',
  },
  {
    mark: 'WRAP',
    title: 'Wrap, backup, out.',
    body: 'Media offloaded and verified to two drives before the gear goes in the case — we do not leave a venue with a single copy of your talk. Then we get out of the room fast, because the next speaker is loading in.',
  },
];

const VENUE_CHECKLIST = [
  {
    title: 'A line-level feed from the house sound board.',
    body: 'An XLR or 3.5mm output carrying the room mix. This is the single most important item on this list — it is the difference between your voice and your voice plus 200 people breathing. Ask the AV tech for "a line out for a video recording." They will know exactly what you mean.',
  },
  {
    title: 'Room access 45 to 60 minutes before the session.',
    body: 'Enough time to place a camera, patch audio, and run a live test with the system actually on. If the room is in use until ten minutes prior, tell us in advance and we will change the plan rather than rush it.',
  },
  {
    title: 'A clear sightline from the back of the room.',
    body: 'A camera position at the rear or on a side aisle that does not sit in a walkway and does not get blocked once the room fills. Some venues require the camera behind a specific line — worth confirming before the day.',
  },
  {
    title: 'Written permission from the event organizer to film.',
    body: 'An email is enough. Many conferences hold recording rights to their own sessions by default, and this is the one item that can stop a shoot at the door. Sort it early and it is a non-issue.',
  },
  {
    title: 'Power at the camera position.',
    body: 'A standard outlet within reach, or confirmation there is not one so we bring the batteries to cover a full block. We can run on battery — we just need to know before we are standing there.',
  },
  {
    title: 'The AV tech’s name and contact.',
    body: 'A phone number or an introduction the day before. Thirty seconds of coordination in advance replaces ten minutes of hunting for the right person while your session is starting.',
  },
];

const FAQS = [
  {
    q: 'What if the venue can’t give you a board feed?',
    a: 'Then the wireless lavalier becomes the primary track instead of the backup, and we add a second wireless transmitter for redundancy at no extra charge. The recording is still clean and still professional — a lav on your collar is a far better source than a camera microphone in the back of the room. Tell us in advance and we plan for it; we have never lost a session to a venue that could not patch us in.',
  },
  {
    q: 'What if the organizer is already recording the session?',
    a: 'Most conference recordings are a locked wide shot from the back of the room with house audio, delivered whenever the organizer gets around to it, often with their branding on it and their terms attached to how you can use it. If that is what you need, take it and save the money. If you want a framed 4K image, board-feed audio, your slides cut in at full resolution, and a file you own outright in 14 days, that is a different product. Plenty of speakers book us alongside the organizer recording and use ours for everything public-facing.',
  },
  {
    q: 'What if my session runs long?',
    a: 'The base package covers up to two hours onsite, which comfortably fits a 45 or 60 minute talk plus setup and Q&A. If your session or the block around it runs longer, additional onsite hours are $250 each and can be added on the day — we will not stop recording mid-sentence and we will not surprise you with the line item afterward. If you already know it will run long, add the hours when you build your quote.',
  },
  {
    q: 'Do I own the footage?',
    a: 'You own the finished edited file outright — post it, license it, put it on your speaker reel, use it forever. Raw footage stays with Semper Fi Media by default so we can protect creative reuse on both sides. If you want the raw files with full rights transferred to you, that is a buyout at 100% of the project cost, the same policy that applies to every service we offer.',
  },
  {
    q: 'How fast is delivery?',
    a: 'Fourteen days from the session to your finished 4K file, color corrected and trimmed, with your slides cut in. Vertical social clips deliver on the same schedule. If you need it faster, rush delivery is $250 and puts the finished file in your hands within 5 days — worth it when the conference hashtag is still moving.',
  },
  {
    q: 'Do you travel outside DFW?',
    a: 'Travel anywhere in Dallas–Fort Worth is included in the base price — Dallas, Fort Worth, Plano, Frisco, Arlington, Irving, McKinney, Rockwall, and the rest of the metroplex. Beyond DFW we charge $0.67 per mile, quoted before you book so it is never a surprise on the invoice. Austin, Houston, and San Antonio conferences are regular work for us.',
  },
  {
    q: 'Can you cover a panel instead of a solo talk?',
    a: 'Yes. Panels need one wireless lavalier per speaker, which is the $200 multi-speaker audio add-on. Without it, the moderator sounds great and the panelists sound like they are in another room. For a panel of three or more we also recommend the second camera angle so the edit can cut to whoever is actually talking.',
  },
  {
    q: 'What do you need from me before the day?',
    a: 'Your slide deck if you have one, so we can cut it in at full resolution at no charge. The venue name, room, and session time. And a forwarded confirmation from your event organizer that filming is approved. That is the whole list — everything else is on us.',
  },
];

const SESSION_CAPTURE_OFFERS = [
  {
    name: 'Session Capture',
    description:
      'Professional recording of one conference session, keynote, or panel. Up to 2 hours onsite, one 4K cinema camera position, dual-redundant audio (house board feed plus backup wireless lavalier), full session color corrected, presentation slides cut in at full resolution, 14-day delivery, two rounds of revisions, travel within DFW included.',
    price: String(SESSION_CAPTURE_PRICE),
  },
  ...SESSION_CAPTURE_ADD_ONS.map((addOn) => ({
    name: `Session Capture add-on — ${addOn.name}`,
    description: addOn.blurb,
    price: String(addOn.price),
  })),
];

export default async function SessionCapturePage() {
  const featured = await getCaseStudiesByCategory('events', 4);

  return (
    <>
      <ViewContent
        contentType="service"
        contentName="Session Capture"
        contentIds={['session-capture']}
        value={SESSION_CAPTURE_PRICE}
      />
      <Nav />
      <ServiceJsonLd
        name="Conference Session Recording Dallas — Session Capture"
        description="Professional conference session, keynote, and panel recording in Dallas–Fort Worth. 4K cinema camera, dual-redundant house board audio, presentation slides cut in, vertical social clips, 14-day delivery."
        url="https://semperfimedia.llc/session-capture"
        offers={SESSION_CAPTURE_OFFERS}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Session Capture', href: '/session-capture' },
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <main>
        {/* HERO */}
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · SESSION CAPTURE</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              The talk landed.
              <br />
              The recording
              <br />
              didn&apos;t.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Most conference sessions are either never recorded at all, or recorded by the venue
              on a locked wide from the back of the room with a microphone pointed at 200 people
              breathing. You gave the talk once. This is the version you can actually use — a
              framed 4K image, your voice off the sound board, and your slides cut in at full
              resolution.
            </p>
            <div className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="font-serif text-5xl text-brass md:text-6xl">
                {formatPrice(SESSION_CAPTURE_PRICE)}
              </span>
              <span className="text-bone-subtle">
                flat · up to 2 hours onsite · delivered in 14 days
              </span>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="#configure" variant="outline">
                Build Your Quote
              </BrassButton>
            </div>
            <p className="mt-6 text-sm text-bone-subtle">
              Conference videographer serving Dallas, Fort Worth, and the wider DFW metroplex —
              keynotes, breakout sessions, panels, association meetings, and industry events.
            </p>
          </div>
        </section>

        <NicheFeaturedWork
          eyebrow="EVENT WORK · DFW"
          heading="Recent sessions and events."
          caseStudies={featured}
        />

        {/* WHAT YOU GET */}
        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1000px]">
            <DataLabel className="mb-5">WHAT YOU GET</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Audio first. Everything
              <br />
              else follows.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-bone-muted">
              Nobody has ever stopped watching a talk because the framing was a little loose.
              They stop because they cannot hear it. That is why the audio plan comes first here
              and why it is the thing that separates a professional capture from a phone on a
              tripod.
            </p>

            <div className="mt-12 divide-y divide-bone/10 border-y border-bone/10">
              {SESSION_CAPTURE_INCLUDES.map((item) => (
                <div key={item.title} className="py-7">
                  <h3 className="font-serif text-xl italic md:text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-3xl leading-relaxed text-bone-muted">{item.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-bone-subtle">
              Every number on this page is published. Nothing is quoted in private.{' '}
              <Link
                href="/pricing"
                className="text-brass underline decoration-brass/60 underline-offset-4 hover:no-underline"
              >
                See every service and rate →
              </Link>
            </p>
          </div>
        </section>

        {/* HOW THE DAY RUNS */}
        <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1000px]">
            <DataLabel className="mb-5">HOW THE DAY RUNS</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              We are in the room
              <br />
              an hour before you are.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-bone-muted">
              A session is a live event with one take. There is no reset, no second pass, and no
              asking a room of 200 people to hold while we sort out a cable. So the work happens
              before you walk on.
            </p>

            <ol className="mt-12 space-y-8">
              {TIMELINE.map((step) => (
                <li
                  key={step.mark}
                  className="grid grid-cols-1 gap-2 border-l-2 border-brass/30 pl-6 md:grid-cols-[140px_1fr] md:gap-6 md:pl-8"
                >
                  <div className="data-label pt-1 text-brass">{step.mark}</div>
                  <div>
                    <h3 className="font-serif text-xl italic md:text-2xl">{step.title}</h3>
                    <p className="mt-2 max-w-2xl leading-relaxed text-bone-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ADD-ONS */}
        <section
          id="add-ons"
          className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-5">ADD-ONS</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Add only what the
              <br />
              session actually needs.
            </h2>

            {/* Second camera gets its own block — it is a craft decision, not a line item. */}
            <div className="mt-12 border border-brass/40 bg-texas-umber/20 p-8 md:p-10">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <DataLabel className="mb-3">READ THIS ONE FIRST</DataLabel>
                  <h3 className="font-serif text-2xl italic md:text-3xl">Second camera angle</h3>
                </div>
                <div className="font-serif text-4xl text-brass">$350</div>
              </div>
              <p className="mt-6 max-w-3xl leading-relaxed text-bone-muted">
                Here is the honest reason this matters, and it has nothing to do with production
                value. With one camera, a vertical clip is a static frame with a digital punch-in.
                It holds for about three seconds on a phone before the thumb moves. With two
                cameras, we cut between real angles — wide to tight on your face at the exact
                moment the line lands — and the clip actually holds attention long enough to
                finish.
              </p>
              <p className="mt-4 max-w-3xl leading-relaxed text-bone-muted">
                If you are only ever going to post the full session, one camera is genuinely
                enough and you should skip this. If you want social clips that perform, the second
                angle is what makes them work. That is the whole decision.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <caption className="sr-only">
                  Session Capture add-on pricing for Dallas–Fort Worth conference and event
                  recording
                </caption>
                <thead>
                  <tr className="border-b border-brass/30">
                    <th scope="col" className="data-label pb-3 pr-6 text-brass">
                      Add-on
                    </th>
                    <th scope="col" className="data-label pb-3 pr-6 text-right text-brass">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SESSION_CAPTURE_ADD_ONS.map((addOn) => (
                    <tr key={addOn.id} className="border-b border-bone/10 align-top">
                      <th scope="row" className="py-5 pr-6 font-normal">
                        <span className="font-serif text-lg italic">{addOn.name}</span>
                        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-bone-muted">
                          {addOn.blurb}
                        </p>
                      </th>
                      <td className="whitespace-nowrap py-5 pr-6 text-right font-serif text-lg text-brass">
                        {addOnPriceLabel(addOn)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Site-wide policies, worded exactly as they are on /pricing. */}
            <div className="mt-12">
              <DataLabel as="h3" className="mb-6">
                POLICIES THAT APPLY TO EVERY SEMPER FI MEDIA PROJECT
              </DataLabel>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {SESSION_CAPTURE_POLICIES.map((policy) => (
                  <div
                    key={policy.name}
                    className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8"
                  >
                    <DataLabel className="mb-3">{policy.label}</DataLabel>
                    <h4 className="font-serif text-2xl italic">{policy.name}</h4>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-serif text-4xl">{policy.price}</span>
                      <span className="text-sm text-bone-subtle">{policy.unit}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-bone-muted">{policy.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICE BUILDER */}
        <SessionCaptureConfigurator />

        {/* VENUE CHECKLIST */}
        <section
          id="venue-checklist"
          className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-28"
        >
          <div className="mx-auto max-w-[1000px]">
            <DataLabel className="mb-5">WHAT I NEED FROM THE VENUE</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Forward this to your
              <br />
              event organizer.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-bone-muted">
              Six things, and only one of them is difficult. Organizers and AV teams handle these
              requests constantly — the entire reason recordings go wrong is that nobody asked
              until the morning of. Send this list ahead and the day runs itself.
            </p>

            <ol className="mt-12 space-y-7">
              {VENUE_CHECKLIST.map((item, i) => (
                <li key={item.title} className="flex gap-5">
                  <span className="data-label flex h-9 w-9 flex-none items-center justify-center border border-brass/40 text-brass">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl italic md:text-2xl">{item.title}</h3>
                    <p className="mt-2 max-w-2xl leading-relaxed text-bone-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-10 max-w-2xl text-bone-muted">
              If your organizer has a question about any of it, they can{' '}
              <Link
                href="/contact"
                className="text-brass underline decoration-brass/60 underline-offset-4 hover:no-underline"
              >
                contact us directly
              </Link>{' '}
              and we will coordinate with their AV team so you never have to relay a technical
              question you did not sign up to answer.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="scroll-mt-32 border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28"
          aria-label="Session Capture frequently asked questions"
        >
          <div className="mx-auto max-w-[1000px]">
            <DataLabel className="mb-5">FAQ</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              The questions speakers
              <br />
              ask before they book.
            </h2>

            <div className="mt-12 divide-y divide-bone/10 border-y border-bone/10">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group py-6">
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
                </details>
              ))}
            </div>

            <p className="mt-10 text-bone-muted">
              Want to see how the footage actually looks before you commit? The{' '}
              <Link
                href="/work"
                className="text-brass underline decoration-brass/60 underline-offset-4 hover:no-underline"
              >
                selected work
              </Link>{' '}
              page has full projects with sound on.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 text-center md:px-12 md:py-28">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              You have a date.
              <br />
              Let&apos;s lock the room.
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Thirty minutes on a call. Tell us the venue, the session time, and whether the house
              board can give us a feed — we will tell you exactly what we can deliver and what it
              costs before you commit to anything.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="#configure" variant="outline">
                Build Your Quote
              </BrassButton>
            </div>
            <p className="mt-8 text-sm text-bone-subtle">
              Speaker video capture across Dallas–Fort Worth — keynote recording, panel recording,
              breakout sessions, association and industry conferences. Marine-led, cinema-grade,
              always faithful to your story.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
