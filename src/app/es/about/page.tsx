import Image from 'next/image';
import type { Metadata } from 'next';
import { NavEs } from '@/components/nav/nav-es';
import { FooterEs } from '@/components/footer/footer-es';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { Reveal } from '@/components/primitives/reveal';

export const metadata: Metadata = {
  title: 'El Código Marino — Sobre Semper Fi Media',
  description:
    'Conoce a TJ Gutierrez — veterano del Cuerpo de Marines de EE.UU., cinematógrafo y fundador de Semper Fi Media. Cinco principios marinos aplicados a cada boda, video musical, y película de marca en Dallas–Fort Worth.',
  alternates: {
    canonical: 'https://www.semperfimedia.llc/es/about',
    languages: {
      'en-US': 'https://www.semperfimedia.llc/about',
      'es-US': 'https://www.semperfimedia.llc/es/about',
    },
  },
};

const PRINCIPIOS = [
  {
    n: 'I',
    name: 'Honor',
    headline: 'Precios transparentes. Sin upsells escondidos.',
    body: 'Cada paquete, cada add-on, cada tarifa por hora está publicada en el sitio web antes de que tomes el teléfono. Llegas a la llamada de descubrimiento ya sabiendo el costo — nosotros llegamos ya sabiendo el trabajo. Sin precios trampa, sin facturas sorpresa, sin juegos de markup de agencia.',
  },
  {
    n: 'II',
    name: 'Coraje',
    headline: 'Filmamos lo que realmente sucedió. No la versión de Instagram.',
    body: 'Las lágrimas de los abuelos durante el brindis. La niña de las flores que se tropezó y se rió. La novia susurrando la letra durante el primer baile. Perseguimos los momentos reales — los frames documentales que los videógrafos de highlight reels cortan. Ahí es donde vive la película.',
  },
  {
    n: 'III',
    name: 'Compromiso',
    headline: 'TJ lidera cada filmación. Sin excepciones.',
    body: 'Otros estudios te reservan en la llamada y luego mandan a un cinematógrafo junior a tu boda. Nosotros no. TJ está en cada filmación, cada edit, cada revisión. El equipo escala según el alcance, pero el líder nunca cambia. Esa es la promesa.',
  },
  {
    n: 'IV',
    name: 'Semper Fidelis',
    headline: 'Siempre Fieles — a la historia, la pareja, el momento.',
    body: 'Semper Fidelis no es un eslogan. Es el principio operativo. Fieles al timeline. Fieles al presupuesto. Fieles al familiar que no puede estar en la boda pero ve la película. Fieles al artista cuyo video musical tiene que sentirse como la canción. El trabajo significa algo. Lo tratamos así.',
  },
  {
    n: 'V',
    name: 'Hermandad',
    headline: 'El equipo es escogido a mano. Probado. De confianza.',
    body: 'Cuando la misión requiere más de una cámara, TJ trae segundos cinematógrafos, operadores de drone, y técnicos de audio de la comunidad de cine de Dallas — cada uno probado en proyectos previos, cada uno entrenado en estilo documental. Vendedores veteranos tienen primera llamada. El estándar nunca baja.',
  },
];

const STATS = [
  { value: '5+', label: 'Años filmando DFW' },
  { value: '100+', label: 'Bodas, marcas y videos musicales' },
  { value: '1', label: 'Marine liderando cada proyecto' },
];

export default function EsAboutPage() {
  return (
    <div lang="es">
      <NavEs />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-32 pb-20 md:px-12 md:pt-40 md:pb-28">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SOBRE NOSOTROS · EL CÓDIGO MARINO</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              La forma en que un Marine
              <br />
              filma tu historia.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-muted md:text-xl">
              Cinco principios del Cuerpo de Marines de Estados Unidos. Aplicados a cada boda,
              película de marca, y video musical que Semper Fi Media filma. Así es como
              trabajamos — y por qué nos siguen contratando.
            </p>
          </div>
        </section>

        <section className="bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 md:grid-cols-5 md:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded md:col-span-2">
              <Image
                src="/images/tj-founder.jpg"
                alt="TJ Gutierrez, fundador de Semper Fi Media"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
                priority
              />
            </div>
            <div className="md:col-span-3">
              <DataLabel className="mb-5">EL FUNDADOR</DataLabel>
              <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
                TJ Gutierrez —
                <br />
                <span className="text-brass">Marine, cinematógrafo, fundador.</span>
              </h2>
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-bone-muted">
                <p>
                  TJ sirvió en el Cuerpo de Marines de Estados Unidos antes de construir una
                  carrera detrás de una cámara de cine. La disciplina no se fue cuando cambió el
                  uniforme por un trípode. Se convirtió en el sistema operativo del estudio.
                </p>
                <p>
                  Semper Fi Media empezó en 2020 como una pequeña operación de marketing en
                  Forney, Texas. Cinco años después es un estudio cinematográfico completo,
                  filmando bodas, películas de marca, videos musicales, trabajo táctico, y
                  convenciones por todo Dallas–Fort Worth — todavía operado por su dueño, todavía
                  liderado por un Marine.
                </p>
                <p>
                  El nombre es el principio.{' '}
                  <em className="font-serif not-italic text-bone">Semper Fidelis</em> — siempre
                  fieles — es el lema del Cuerpo de Marines. Es exactamente lo que prometemos a
                  cada pareja, cada negocio, cada artista que nos entrega su historia.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-12 md:px-12 md:py-16">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-5xl italic text-brass md:text-6xl">{s.value}</div>
                <div className="data-label mt-2 text-bone-subtle">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28"
          aria-label="El Código Marino — cinco principios"
        >
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-16 max-w-3xl">
              <DataLabel className="mb-4">EL CÓDIGO MARINO</DataLabel>
              <h2 className="font-serif text-4xl italic leading-tight md:text-6xl">
                Cinco principios.
                <br />
                <span className="text-brass">Cada filmación. Cada vez.</span>
              </h2>
            </div>

            <div className="space-y-16 md:space-y-24">
              {PRINCIPIOS.map((p, i) => (
                <Reveal key={p.name}>
                  <article className="grid grid-cols-1 gap-8 md:grid-cols-[180px_1fr] md:gap-12">
                    <div>
                      <div
                        className="font-serif text-7xl italic leading-none text-brass/40 md:text-8xl"
                        aria-hidden="true"
                      >
                        {p.n}
                      </div>
                      <DataLabel className="mt-3 text-brass">{p.name.toUpperCase()}</DataLabel>
                    </div>
                    <div className="border-l border-brass/30 pl-6 md:pl-10">
                      <h3 className="font-serif text-2xl italic leading-snug text-bone md:text-3xl">
                        {p.headline}
                      </h3>
                      <p className="mt-5 text-lg leading-relaxed text-bone-muted">{p.body}</p>
                    </div>
                  </article>
                  {i < PRINCIPIOS.length - 1 && (
                    <div
                      className="mt-16 h-px bg-gradient-to-r from-transparent via-brass/30 to-transparent md:mt-24"
                      aria-hidden="true"
                    />
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 py-20 text-gunpowder md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-6xl">
              Entréganos la historia.
              <br />
              Nosotros traemos el oficio.
            </h2>
            <p className="mt-6 text-lg" style={{ color: '#2a1a08' }}>
              Llamada gratis de 30 minutos. Sin presión. Siempre Fieles.
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
