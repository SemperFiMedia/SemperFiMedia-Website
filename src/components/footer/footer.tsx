import Link from 'next/link';

const SERVICES = [
  { href: '/corporate', label: 'Corporate Video' },
  { href: '/weddings', label: 'Cinema Weddings' },
  { href: '/corporate/music-videos', label: 'Music Videos' },
  { href: '/corporate/mission-and-tactical', label: 'Mission & Tactical' },
  { href: '/pricing', label: 'Pricing' },
] as const;

const COMPANY = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
] as const;

const SOCIAL = [
  { href: 'https://www.instagram.com/semperfimediallc/', label: 'Instagram' },
  { href: 'https://www.youtube.com/channel/UC0lvEKU7FPlCy-pjIfyAorA', label: 'YouTube' },
  { href: 'https://www.tiktok.com/@semperfimedia', label: 'TikTok' },
  { href: 'https://www.facebook.com/SemperFiMedia', label: 'Facebook' },
  { href: 'https://twitter.com/SemperFiMediaTX', label: 'X / Twitter' },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t border-brass/15 bg-black px-6 py-16 text-bone-subtle md:px-12"
      role="contentinfo"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="font-serif text-2xl italic text-bone">
            Semper Fi <span className="text-brass">Media</span>
          </div>
          <div className="data-label text-brass">Always Faithful to Your Story</div>
          <p className="text-sm leading-relaxed">
            Marine-led cinematic video production. Forney, TX — serving all of Dallas–Fort Worth.
          </p>
        </div>
        <div>
          <div className="data-label mb-4 text-brass">Services</div>
          <ul className="space-y-2 text-sm">
            {SERVICES.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-bone">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="data-label mb-4 text-brass">Company</div>
          <ul className="space-y-2 text-sm">
            {COMPANY.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-bone">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="data-label mb-4 text-brass">Contact</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="tel:+18172392664" className="hover:text-bone">
                817.239.2664
              </a>
            </li>
            <li>
              <a href="mailto:hello@semperfimedia.llc" className="hover:text-bone">
                hello@semperfimedia.llc
              </a>
            </li>
            <li className="pt-3 data-label flex flex-wrap gap-3 text-[10px]">
              {SOCIAL.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="hover:text-bone"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1440px] items-center justify-between border-t border-brass/10 pt-6 data-label text-[10px]">
        <span>Semper Fi Media · Forney TX · {year}</span>
        <span>Semper Fidelis · Est. MMXX</span>
      </div>
    </footer>
  );
}
