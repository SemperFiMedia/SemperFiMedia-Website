'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECTIONS = [
  {
    label: 'Services',
    links: [
      { href: '/corporate', label: 'Corporate Video' },
      { href: '/weddings', label: 'Cinema Weddings' },
      { href: '/social-reels', label: 'Social Media Reels' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    label: 'Niches',
    links: [
      { href: '/corporate/music-videos', label: 'Music Videos' },
      { href: '/corporate/mission-and-tactical', label: 'Mission & Tactical' },
      { href: '/corporate/faith-and-community', label: 'Faith & Community' },
      { href: '/corporate/small-business', label: 'Small Business' },
      { href: '/corporate/conventions', label: 'Conventions' },
      { href: '/corporate/quinceaneras', label: 'Quinceañeras' },
      { href: '/corporate/birthday-parties', label: 'Birthday Parties' },
    ],
  },
  {
    label: 'Company',
    links: [
      { href: '/work', label: 'Selected Work' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
] as const;

export function NavDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center rounded text-bone-muted transition-colors hover:text-bone"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-brass/15 bg-gunpowder px-6 py-6 shadow-2xl md:px-10">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                className="font-serif text-xl italic font-bold"
                onClick={() => setOpen(false)}
              >
                Semper Fi <span className="text-brass">Media</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded text-bone-muted transition-colors hover:text-bone"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            <nav aria-label="Full site" className="flex flex-col gap-8">
              {SECTIONS.map((section) => (
                <div key={section.label}>
                  <div className="data-label mb-3 text-brass">{section.label}</div>
                  <ul className="flex flex-col gap-2">
                    {section.links.map((link) => {
                      const active =
                        pathname === link.href || pathname?.startsWith(link.href + '/');
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={
                              'block font-serif text-2xl italic transition-colors ' +
                              (active ? 'text-brass' : 'text-bone hover:text-brass')
                            }
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="mt-10 border-t border-brass/15 pt-6">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="data-label block bg-brass px-5 py-4 text-center font-bold text-gunpowder transition-colors hover:bg-golden-hour"
              >
                Book a Discovery Call
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
