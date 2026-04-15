import Link from 'next/link';
import { NavDrawer } from './nav-drawer';

const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/corporate', label: 'Corporate' },
  { href: '/weddings', label: 'Weddings' },
  { href: '/social-reels', label: 'Social' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
] as const;

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
          className="font-serif text-xl italic font-bold tracking-tight md:text-2xl"
        >
          Semper Fi <span className="text-brass">Media</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-8">
          <ul className="hidden items-center gap-6 text-sm font-medium md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
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
