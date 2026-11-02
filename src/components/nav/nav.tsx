import Link from 'next/link';
import { NavDrawer } from './nav-drawer';

const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/corporate', label: 'Corporate' },
  { href: '/weddings', label: 'Weddings' },
  { href: '/filmmaking', label: 'Filmmaking' },
  // Short label follows the /social-reels → "Social" precedent; the desktop bar is tight.
  // Secondary links only show on wide screens; between lg and xl they live in the drawer.
  { href: '/session-capture', label: 'Sessions', secondary: true },
  { href: '/social-reels', label: 'Social', secondary: true },
  // Published rates are the core brand promise ("No surprises"), so /pricing
  // earns a slot in the bar. Reel Recon is audience-building rather than a
  // service anyone buys — it stays in the drawer and the footer.
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog', secondary: true },
  { href: '/about', label: 'About', secondary: true },
] as const satisfies readonly { href: string; label: string; secondary?: boolean }[];

export function Nav() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-bone/10 bg-gunpowder/85 backdrop-blur-md"
      role="banner"
    >
      <nav
        className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12 md:py-5"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="whitespace-nowrap font-serif text-xl italic font-bold tracking-tight md:text-2xl"
        >
          Semper Fi <span className="text-brass">Media</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-8">
          <ul className="hidden items-center gap-6 text-sm font-medium lg:flex">
            {LINKS.map((link) => (
              <li key={link.href} className={'secondary' in link ? 'hidden xl:block' : undefined}>
                <Link
                  href={link.href}
                  className="text-bone-muted transition-colors hover:text-bone"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/es"
            className="hidden text-xs font-medium uppercase tracking-wider text-bone-muted transition-colors hover:text-bone md:inline-block"
            aria-label="Ver el sitio en español"
          >
            ES
          </Link>
          <Link
            href="/contact"
            className="data-label hidden bg-brass px-5 py-3 font-bold text-gunpowder transition-colors hover:bg-golden-hour sm:inline-block"
          >
            Book a Call
          </Link>
          <NavDrawer />
        </div>
      </nav>
    </header>
  );
}
