import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Semper Fi Media collects, uses, shares, and protects your information — including contact details, analytics, and Google sign-in for comments.',
};

export const revalidate = 86400;

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 mb-3 font-serif text-2xl italic text-bone">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-relaxed text-bone-muted">{children}</p>;
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-gunpowder">
        <section className="px-6 pt-28 pb-20 md:px-12 md:pt-36">
          <div className="mx-auto max-w-[760px]">
            <DataLabel className="mb-4 text-brass">Legal</DataLabel>
            <h1 className="font-serif text-4xl italic leading-tight md:text-5xl">Privacy Policy</h1>
            <p className="mt-3 text-sm text-bone-subtle">Last updated: June 16, 2026</p>

            <div className="mt-10 text-lg">
              <P>
                This Privacy Policy explains how Semper Fi Media LLC (&ldquo;Semper Fi Media,&rdquo;
                &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, shares, and
                protects information when you visit{' '}
                <a href="https://semperfimedia.llc" className="text-brass underline">
                  semperfimedia.llc
                </a>{' '}
                (the &ldquo;Site&rdquo;), contact us, or sign in to leave a comment. We are a
                video production studio based in Forney, Texas, serving the Dallas–Fort Worth area.
              </P>

              <H2>Information we collect</H2>
              <P>
                <strong className="text-bone">Information you give us.</strong> When you submit a
                contact, proposal, or referral form, we collect the details you provide — such as
                your name, email address, phone number, and any message or project information. When
                you use our on-site chat, we collect the messages you send so we can respond.
              </P>
              <P>
                <strong className="text-bone">Information from signing in with Google.</strong> If
                you sign in to comment on a Reel Recon review, we receive basic profile information
                from your Google account — your name, email address, profile picture, and a unique
                Google account identifier. We use this only to create your commenter profile,
                display your name and picture next to your comments, and identify you on return
                visits. We do not access your contacts, files, or any other Google data, and we do
                not sell this information.
              </P>
              <P>
                <strong className="text-bone">Content you post.</strong> Comments and replies you
                submit are stored in our database along with your commenter profile and the time of
                posting.
              </P>
              <P>
                <strong className="text-bone">Information collected automatically.</strong> Like
                most websites, we and our analytics providers collect certain information
                automatically through cookies and similar technologies — such as your IP address,
                browser and device type, pages viewed, referring links, and on-site interactions.
                This helps us understand how the Site is used and improve it.
              </P>

              <H2>Cookies and analytics</H2>
              <P>
                We use cookies and similar technologies for analytics and advertising measurement.
                When you first visit, a consent banner lets you accept all, reject all, or choose
                which categories are active, and non-essential tracking stays off until you decide.
                Our analytics and measurement providers may include Google Analytics, the Meta
                (Facebook) Pixel and Conversions API, and PostHog (product analytics and session
                insights). You can also control cookies through your browser settings.
              </P>

              <H2>How we use your information</H2>
              <P>We use the information we collect to:</P>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-bone-muted">
                <li>Respond to your inquiries and provide quotes, proposals, and services;</li>
                <li>Operate the comment system and display your comments with your profile;</li>
                <li>Understand and improve how the Site performs and is used;</li>
                <li>Measure the effectiveness of our marketing, where you have consented;</li>
                <li>Protect the Site against spam, abuse, and fraud; and</li>
                <li>Comply with our legal obligations.</li>
              </ul>

              <H2>How we share information</H2>
              <P>
                We do not sell your personal information. We share information only with service
                providers that help us operate the Site and our business, and only as needed for
                them to perform their services. These providers may include hosting and
                infrastructure (such as Railway and Cloudflare), our content platform (Sanity),
                video hosting (Mux), email delivery (Resend), authentication (Google), analytics and
                advertising measurement (Google, Meta, PostHog), and our on-site assistant provider.
                We may also disclose information if required by law or to protect our rights, safety,
                or property.
              </P>

              <H2>Data retention</H2>
              <P>
                We keep contact and inquiry information for as long as needed to respond and for our
                legitimate business records. Comments and your commenter profile remain until you or
                we delete them. You can ask us to delete your commenter profile and comments at any
                time (see below).
              </P>

              <H2>Your choices and rights</H2>
              <P>
                You may request access to, correction of, or deletion of your personal information —
                including your Google sign-in profile and any comments you have posted — by emailing
                us at{' '}
                <a href="mailto:hello@semperfimedia.llc" className="text-brass underline">
                  hello@semperfimedia.llc
                </a>
                . You can also manage cookie preferences through the consent banner or your browser,
                and you can revoke our access to your Google account at any time through your{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  className="text-brass underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Account permissions
                </a>
                .
              </P>

              <H2>Security</H2>
              <P>
                We use reasonable administrative and technical measures to protect your information.
                No method of transmission or storage is completely secure, however, and we cannot
                guarantee absolute security.
              </P>

              <H2>Children&rsquo;s privacy</H2>
              <P>
                The Site is not directed to children under 13, and we do not knowingly collect
                personal information from children under 13.
              </P>

              <H2>Changes to this policy</H2>
              <P>
                We may update this Privacy Policy from time to time. When we do, we will revise the
                &ldquo;Last updated&rdquo; date above. Material changes will be reflected on this
                page.
              </P>

              <H2>Contact us</H2>
              <P>
                Questions about this policy or your information? Reach us at{' '}
                <a href="mailto:hello@semperfimedia.llc" className="text-brass underline">
                  hello@semperfimedia.llc
                </a>{' '}
                or (817) 239-2664. Semper Fi Media LLC, Forney, Texas, USA.
              </P>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
