import type { Metadata } from 'next';
import { NavEs } from '@/components/nav/nav-es';
import { FooterEs } from '@/components/footer/footer-es';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';
import { NicheFeaturedWork } from '@/components/niche/featured-work';
import { getCaseStudiesByCategory } from '@/sanity/queries';

export const metadata: Metadata = {
  title: { absolute: 'Videógrafo de Quinceañeras en Dallas–Fort Worth' },
  description:
    'Películas de quinceañera en Dallas y Fort Worth: misa, corte, vals, baile sorpresa y recepción, filmados con cámaras de cine y respeto a la tradición.',
  alternates: {
    canonical: 'https://semperfimedia.llc/es/quinceaneras',
    languages: {
      'en-US': 'https://semperfimedia.llc/corporate/quinceaneras',
      'es-US': 'https://semperfimedia.llc/es/quinceaneras',
    },
  },
};

const QUE_CAPTURAMOS = [
  'La misa y bendición — desde la entrada hasta el cambio de zapatos',
  'El vals con papá y la corte de honor',
  'El baile sorpresa con todos los chambelanes',
  'Los brindis, el pastel, y los momentos en familia',
  'La recepción completa — DJ, banda, mariachi, lo que sea',
  'Reels verticales para Instagram, TikTok y compartir con la familia (con Brand Film o como complemento)',
];

const POR_QUE = [
  {
    title: 'Respetamos la tradición.',
    body: 'El cambio de zapatos, el vals, la corte, el baile sorpresa, los brindis — no son solo escenas en una lista de tomas. Son la razón por la que la película existe. Sabemos qué proteger y cuándo dar un paso atrás.',
  },
  {
    title: 'Calidad de cine, no de "videógrafo de eventos".',
    body: 'Tu video de quinceañera debe sentirse como una boda cinematográfica — lentes de cine, color cuidadoso, música licenciada de verdad. No un highlight reel sobre una canción pop. Tratamos cada quinceañera como tratamos nuestras bodas premium.',
  },
  {
    title: 'Reels sociales que las primas comparten.',
    body: 'Película principal para la familia. Reels verticales para la quinceañera. La cumpleañera de quince quiere algo para postear al día siguiente: los cortes verticales vienen con Brand Film y se pueden agregar a cualquier trabajo.',
  },
  {
    title: 'Hablamos español. Filmamos para tu familia.',
    body: 'TJ y el equipo entienden que la quinceañera es un evento familiar. Las abuelas, las tías, los padrinos — todos cuentan. Filmamos con la sensibilidad cultural que merece tu día.',
  },
];

export default async function EsQuinceanerasPage() {
  const featured = await getCaseStudiesByCategory('quinceanera', 4);

  return (
    <div lang="es">
      <NavEs />
      <ServiceJsonLd
        name="Videógrafo de Quinceañeras en Dallas–Fort Worth"
        serviceType="Videografía de quinceañeras"
        description="Videografía cinematográfica de quinceañeras en Dallas–Fort Worth — Garland, Mesquite, Oak Cliff, Forney, Plano. Misa, corte, vals, baile sorpresa, recepción."
        url="https://semperfimedia.llc/es/quinceaneras"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">QUINCEAÑERAS · DALLAS / GARLAND / MESQUITE / OAK CLIFF</DataLabel>
            <h1 className="max-w-4xl font-serif text-4xl italic leading-[1.05] md:text-6xl">
              Videógrafo de Quinceañeras en Dallas–Fort Worth
            </h1>
            <p className="mt-5 font-serif text-2xl italic text-brass md:text-3xl">
              Una película digna del día que cumple quince.
            </p>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Videografía de quinceañera con calidad de cine para familias hispanas en Dallas,
              Garland, Mesquite, Oak Cliff y todo el área DFW. La misa, la corte, el vals, el
              baile sorpresa, la recepción — cada tradición capturada como la familia querrá
              recordarla, y como la quinceañera realmente querrá compartir.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/es/contact">Reservar Quinceañera</BrassButton>
              <BrassButton href="/es/weddings" variant="outline">
                Ver Bodas
              </BrassButton>
            </div>
          </div>
        </section>

        <NicheFeaturedWork
          eyebrow="QUINCEAÑERAS RECIENTES · DFW"
          heading="Quinceañeras como realmente sucedieron."
          caseStudies={featured}
        />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">QUÉ CAPTURAMOS</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Cada momento. Cada tradición.
              </h2>
              <ul className="mt-6 space-y-3 text-bone-muted">
                {QUE_CAPTURAMOS.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-brass">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <DataLabel className="mb-5">POR QUÉ SEMPER FI MEDIA</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Respeto por la tradición. Acabado de cine.
              </h2>
              <div className="mt-6 space-y-5">
                {POR_QUE.map((item) => (
                  <div key={item.title}>
                    <h3 className="font-serif text-xl italic">{item.title}</h3>
                    <p className="mt-1 text-bone-muted leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-black px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-3">SIRVIENDO A DFW</DataLabel>
            <h2 className="font-serif text-2xl italic md:text-3xl">
              Dallas · Garland · Mesquite · Oak Cliff · Forney · Plano · Frisco · Irving · Arlington · Fort Worth · Rockwall
            </h2>
            <p className="mt-4 text-bone-muted">
              Bodas destino y quinceañeras fuera del área DFW se cotizan con viaje y hospedaje
              cuando aplica. Cuéntanos dónde será en la llamada de descubrimiento.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 py-20 text-gunpowder md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              ¿Ya tienes la fecha?
            </h2>
            <p className="mt-6 text-lg" style={{ color: '#2a1a08' }}>
              Llamada gratis de 30 minutos. Trae la fecha, el venue, la visión — armamos el plan
              de cobertura y aseguramos el día.
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
