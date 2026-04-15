import Link from 'next/link';

const SERVICES = [
  { href: '/es/weddings', label: 'Bodas Cinematográficas' },
  { href: '/es/quinceaneras', label: 'Quinceañeras' },
] as const;

const COMPANY = [
  { href: '/es/about', label: 'Nosotros' },
  { href: '/es/contact', label: 'Contacto' },
  { href: '/', label: 'English Site' },
] as const;

const SOCIAL = [
  { href: 'https://www.facebook.com/SemperFiMedia', label: 'Facebook' },
  { href: 'https://www.instagram.com/semperfimediallc/', label: 'Instagram' },
  { href: 'https://www.youtube.com/@SemperFiMedia', label: 'YouTube' },
  { href: 'https://x.com/SemperFiMediaTX', label: 'X' },
  { href: 'https://www.tiktok.com/@semperfimedia', label: 'TikTok' },
  { href: 'https://www.linkedin.com/in/antonio-gutierrez-/', label: 'LinkedIn' },
  { href: 'https://vimeo.com/semperfimedia', label: 'Vimeo' },
] as const;

export function FooterEs() {
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
          <div className="data-label text-brass">Siempre Fieles a Tu Historia</div>
          <p className="text-sm leading-relaxed">
            Producción de video cinematográfica liderada por un Marine. Forney, TX —
            sirviendo a todo el área metropolitana de Dallas–Fort Worth.
          </p>
        </div>
        <div>
          <div className="data-label mb-4 text-brass">Servicios</div>
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
          <div className="data-label mb-4 text-brass">Compañía</div>
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
          <div className="data-label mb-4 text-brass">Contacto</div>
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
        <span>Semper Fi Media · Establecido 2020</span>
      </div>
    </footer>
  );
}
