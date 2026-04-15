import type { Metadata } from 'next';
import { NavEs } from '@/components/nav/nav-es';
import { FooterEs } from '@/components/footer/footer-es';
import { DataLabel } from '@/components/primitives/data-label';
import { ContactForm } from '@/components/contact/contact-form';
import { CalEmbed } from '@/components/contact/cal-embed';

export const metadata: Metadata = {
  title: 'Contacto — Reservar Llamada de Descubrimiento',
  description:
    'Reserva una llamada gratis de 30 minutos con Semper Fi Media. Producción de video en Dallas, bodas cinematográficas, quinceañeras, videos musicales.',
  alternates: {
    canonical: 'https://www.semperfimedia.llc/es/contact',
    languages: {
      'en-US': 'https://www.semperfimedia.llc/contact',
      'es-US': 'https://www.semperfimedia.llc/es/contact',
    },
  },
};

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'semperfimedia/discovery';

export default function EsContactPage() {
  return (
    <div lang="es">
      <NavEs />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">CONTACTO · RESERVAR LLAMADA</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Contemos
              <br />
              tu historia.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-bone-muted">
              Reserva una llamada de descubrimiento de 30 minutos abajo, o mándanos un mensaje y
              te respondo dentro de un día hábil. Hablamos español.
            </p>
          </div>
        </section>

        <section id="book" className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 md:grid-cols-2">
            <div>
              <DataLabel className="mb-6">RESERVAR LLAMADA DE DESCUBRIMIENTO</DataLabel>
              <CalEmbed calLink={CAL_LINK} />
            </div>
            <div>
              <DataLabel className="mb-6">O MANDA UN MENSAJE</DataLabel>
              <p className="mb-6 text-sm text-bone-muted">
                Llena el formulario y te contacto dentro de un día hábil. Para preguntas urgentes,
                llama al 817.239.2664.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <FooterEs />
    </div>
  );
}
