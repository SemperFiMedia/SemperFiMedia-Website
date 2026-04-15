import type { Metadata } from 'next';
import { NavEs } from '@/components/nav/nav-es';
import { FooterEs } from '@/components/footer/footer-es';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';
import { NicheFeaturedWork } from '@/components/niche/featured-work';
import { getCaseStudiesByCategory } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'Bodas Cinematográficas Dallas — Estilo Documental Netflix',
  description:
    'Bodas filmadas como documentales de Netflix en Dallas–Fort Worth. Liderado por un Marine, precios transparentes desde $3,500. Tres paquetes flat, sin sorpresas.',
  alternates: {
    canonical: 'https://www.semperfimedia.llc/es/weddings',
    languages: {
      'en-US': 'https://www.semperfimedia.llc/weddings',
      'es-US': 'https://www.semperfimedia.llc/es/weddings',
    },
  },
};

const TIERS = [
  {
    label: 'ESSENTIALS',
    name: 'Essentials',
    price: '$3,500',
    note: 'Precio fijo',
    bullets: [
      '6 horas de cobertura del día',
      'TJ — Cinematógrafo Certificado por la Marina',
      'Cámaras de cine 4K + lentes primos de cine',
      'Tomas con drone (donde se permite)',
      'Sonido profesional (lavalier + boom)',
      'Película destacada cinematográfica de 4–5 minutos',
    ],
  },
  {
    label: 'CINEMATIC',
    name: 'Cinematic',
    price: '$5,000',
    note: 'Más popular',
    bullets: [
      '8 horas de cobertura',
      'TJ + segundo cinematógrafo certificado',
      'Teaser social de 1 minuto',
      'Película destacada de 6–8 minutos',
      'Edit completo de la ceremonia',
    ],
  },
  {
    label: 'HEIRLOOM',
    name: 'Heirloom',
    price: '$8,000',
    note: 'Estilo Netflix completo',
    bullets: [
      '10 horas de cobertura',
      'TJ + segundo + asistente',
      'Película documental estilo Netflix de 8–12 min',
      'Edit completo de ceremonia + recepción',
      'Reel de entrevistas con damas y padrinos',
      'USBs para padres (2 incluidos)',
      'Teaser de 48 horas para redes sociales',
    ],
  },
];

const PROCESO = [
  {
    n: '01',
    title: 'Llamada de Descubrimiento',
    body: 'Llamada gratis de 30 minutos. Mapeamos el día — venue, ceremonia, familia clave, los momentos que no puedes perder. Sin presión, sin upsell. Sales con un plan.',
  },
  {
    n: '02',
    title: 'Día de Filmación',
    body: 'TJ lidera el equipo. Cámaras de cine, técnica documental, cero interrupciones a tu día. Trabajamos como invitados, no como paparazzi. La película se construye mientras vives el día.',
  },
  {
    n: '03',
    title: 'La Película',
    body: 'Tu boda editada como un documental de Netflix — momentos reales, ritmo íntimo, soundtrack que mueve. Entregada en 4–8 semanas. Re-vista por 50 años.',
  },
];

export default async function EsWeddingsPage() {
  const featured = await getCaseStudiesByCategory('wedding', 4);

  return (
    <div lang="es">
      <NavEs />
      <ServiceJsonLd
        name="Bodas Cinematográficas Dallas — Estilo Netflix"
        description="Videografía de bodas con calidad de cine en Dallas–Fort Worth. Estilo documental Netflix. Tres paquetes desde $3,500."
        url="https://www.semperfimedia.llc/es/weddings"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">BODAS · DALLAS / FORT WORTH / DESTINO</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Tu día de boda,
              <br />
              filmado como un
              <br />
              <span className="text-brass">documental de Netflix.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted md:text-xl">
              Cámaras de cine. Momentos reales. El día como realmente se sintió — no un highlight
              reel genérico. Liderado por un Marine, precios transparentes desde $3,500.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/es/contact">Reservar Llamada Gratis</BrassButton>
              <BrassButton href="#paquetes" variant="outline">
                Ver Paquetes
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <DataLabel className="mb-6">EL ARREPENTIMIENTO #1 DESPUÉS DE LA BODA</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Las fotos congelan el día.
              <br />
              <span className="text-brass">La película te deja revivirlo.</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-bone-muted">
              El arrepentimiento más común que las parejas tienen después de la boda no es el
              venue, el vestido, ni la comida. Es no haber tenido una película. Las fotos capturan
              un momento. Una película captura el día — la cara de tu papá durante el brindis,
              cómo se rió tu dama de honor, las primeras tres notas de su canción del primer
              baile. Semper Fi Media filma tu boda como un documental de Netflix.
            </p>
          </div>
        </section>

        <NicheFeaturedWork
          eyebrow="BODAS RECIENTES · DFW Y DESTINO"
          heading="Trabajo de bodas reciente."
          caseStudies={featured}
        />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-4">TU BODA EN TRES PASOS</DataLabel>
            <h2 className="mb-12 font-serif text-4xl italic leading-tight md:text-5xl">
              Sin estrés desde el descubrimiento hasta la entrega.
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {PROCESO.map((step) => (
                <div key={step.n} className="border-l border-brass/40 pl-6">
                  <div className="data-label text-brass">{step.n}</div>
                  <h3 className="mt-3 font-serif text-2xl italic">{step.title}</h3>
                  <p className="mt-3 text-bone-muted leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="paquetes"
          className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28"
        >
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-4">INVERSIÓN DE BODA</DataLabel>
            <h2 className="mb-3 font-serif text-4xl italic leading-tight md:text-5xl">
              Tres paquetes. Precios fijos. Sin sorpresas.
            </h2>
            <p className="mb-12 max-w-2xl text-bone-muted">
              Cada paquete incluye USB de entrega, premiere gratis en YouTube + Facebook, y
              licencias de música completas. Add-ons disponibles — descuentos por combinar.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className="flex flex-col border border-brass/20 bg-gunpowder/40 p-6"
                >
                  <DataLabel className="mb-3 text-brass">{tier.label}</DataLabel>
                  <h3 className="font-serif text-2xl italic">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-brass">{tier.price}</span>
                    <span className="text-xs text-bone-subtle">{tier.note}</span>
                  </div>
                  <ul className="mt-6 space-y-2 text-sm text-bone-muted">
                    {tier.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="text-brass">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-bone-subtle">
              Bodas destino fuera de DFW: viaje a $0.67/milla más hospedaje cuando aplica.
              Paquetes personalizados disponibles.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 py-20 text-gunpowder md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Filmemos una boda que valga la pena re-ver.
            </h2>
            <p className="mt-6 text-lg" style={{ color: '#2a1a08' }}>
              Llamada gratis de 30 minutos. Trae la fecha, el venue, la visión.
            </p>
            <div className="mt-10">
              <BrassButton href="/es/contact">Reservar Llamada Gratis →</BrassButton>
            </div>
          </div>
        </section>
      </main>
      <FooterEs />
    </div>
  );
}
