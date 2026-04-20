'use client';

import { useEffect, useState } from 'react';

type Section = {
  id: string;
  label: string;
};

type Props = {
  sections: Section[];
};

export function PricingJumpNav({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0% -50% 0%',
        threshold: 0,
      },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - 130;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }

  return (
    <div className="sticky top-[60px] z-40 border-b border-brass/20 bg-gunpowder/95 backdrop-blur-md md:top-[72px]">
      <div className="mx-auto max-w-[1440px]">
        <nav
          className="flex gap-2 overflow-x-auto whitespace-nowrap px-6 py-3 md:px-12"
          aria-label="Jump to pricing section"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className={`flex-shrink-0 rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                activeId === section.id
                  ? 'border-brass bg-brass/15 text-brass'
                  : 'border-bone/15 text-bone-muted hover:border-brass/60 hover:text-bone'
              }`}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
