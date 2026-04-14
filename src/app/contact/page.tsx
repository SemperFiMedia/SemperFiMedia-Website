import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { ContactForm } from '@/components/contact/contact-form';
import { CalEmbed } from '@/components/contact/cal-embed';

export const metadata: Metadata = {
  title: 'Contact — Book a Discovery Call',
  description:
    'Book a free 30-minute discovery call with Semper Fi Media. Dallas video production, cinema weddings, music videos, tactical brand films.',
};

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'semperfimedia/discovery';

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">CONTACT · BOOK A CALL</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Let&apos;s tell
              <br />
              your story.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-bone-muted">
              Book a 30-minute discovery call below, or send a message and I&apos;ll reply within
              one business day.
            </p>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 md:grid-cols-2">
            <div>
              <DataLabel className="mb-6">BOOK A DISCOVERY CALL</DataLabel>
              <CalEmbed calLink={CAL_LINK} />
            </div>
            <div>
              <DataLabel className="mb-6">OR SEND A MESSAGE</DataLabel>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
