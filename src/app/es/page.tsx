import type { Metadata } from 'next';
import Link from 'next/link';
import { NavEs } from '@/components/nav/nav-es';
import { FooterEs } from '@/components/footer/footer-es';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';

export const metadata: Metadata = {
  title: 'Semper Fi Media — Producción de Video Cinematográfica en Dallas',
  description:
    'Producción de video cinematográfica liderada por un Marine en Dallas–Fort Worth. Bodas estilo Netflix, quinceañeras, videos musicales y películas de marca. Precios transparentes, calidad de cine.',
  alternates: {
    canonical: 'https://www.semperfimedia.llc/es',
    languages: {
      'en-US': 'https://www.semperfimedia.llc/',
      'es-US': 'https://www.semperfimedia.llc/es',
    },
  },
};

export default function EsHomePage() {
  return (
    <div lang="es">
      <NavEs />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-32 pb-20 md:px-12 md:pt-40 md:pb-28">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SEMPER FI MEDIA · DALLAS / FORT WORTH</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Tu historia,
              <br />
              filmada como una
              <br />
              <span className="text-brass">película de Netflix.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-muted md:text-xl">
              Producción de video cinematográfica liderada por un Marine, sirviendo a familias y
              negocios en Dallas, Garland, Mesquite, Oak Cliff y todo el área metropolitana de
              DFW. Bodas, quinceañeras, videos musicales — siempre con calidad de cine y precios
              transparentes.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/es/contact">Reservar Llamada Gratis</BrassButton>
              <BrassButton href="/es/quinceaneras" variant="outline">
                Ver Quinceañeras
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-4">NUESTROS SERVICIOS</DataLabel>
            <h2 className="mb-12 font-serif text-4xl italic leading-tight md:text-5xl">
              Cinemografía con propósito.
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Link
                href="/es/quinceaneras"
                className="group block border-l border-brass/40 pl-6 transition-colors hover:border-brass"
              >
                <h3 className="font-serif text-2xl italic transition-colors group-hover:text-brass">
                  Quinceañeras
                </h3>
                <p className="mt-3 text-bone-muted leading-relaxed">
                  La misa, el vals, el cambio de zapatos, el baile sorpresa. Filmadas con respeto
                  a la tradición y calidad de cine. Sirviendo a familias hispanas en todo DFW.
                </p>
                <span className="mt-4 inline-block text-sm font-medium uppercase tracking-wider text-brass">
                  Ver más →
                </span>
              </Link>
              <Link
                href="/es/weddings"
                className="group block border-l border-brass/40 pl-6 transition-colors hover:border-brass"
              >
                <h3 className="font-serif text-2xl italic transition-colors group-hover:text-brass">
                  Bodas Cinematográficas
                </h3>
                <p className="mt-3 text-bone-muted leading-relaxed">
                  Tu día de boda filmado como un documental de Netflix. Cámaras de cine, momentos
                  reales, el día como realmente se vivió. Tres paquetes desde $3,500.
                </p>
                <span className="mt-4 inline-block text-sm font-medium uppercase tracking-wider text-brass">
                  Ver más →
                </span>
              </Link>
              <Link
                href="/es/about"
                className="group block border-l border-brass/40 pl-6 transition-colors hover:border-brass"
              >
                <h3 className="font-serif text-2xl italic transition-colors group-hover:text-brass">
                  Sobre Nosotros
                </h3>
                <p className="mt-3 text-bone-muted leading-relaxed">
                  Conoce a TJ — veterano del Cuerpo de Marines de Estados Unidos, cinematógrafo y
                  fundador. Cinco principios marinos aplicados a cada filmación.
                </p>
                <span className="mt-4 inline-block text-sm font-medium uppercase tracking-wider text-brass">
                  Ver más →
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 py-20 text-gunpowder md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-6xl">
              Hablamos español.
              <br />
              Filmamos para tu familia.
            </h2>
            <p className="mt-6 text-lg" style={{ color: '#2a1a08' }}>
              Llamada de descubrimiento gratis de 30 minutos. Sin compromiso. Siempre Fieles.
            </p>
            <div className="mt-10">
              <BrassButton href="/es/contact">Reservar Llamada →</BrassButton>
            </div>
          </div>
        </section>
      </main>
      <FooterEs />
    </div>
  );
}
