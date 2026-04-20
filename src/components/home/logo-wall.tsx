import Image from 'next/image';
import { DataLabel } from '@/components/primitives/data-label';

type Client = {
  name: string;
  logo: string;
  website: string | null;
  builtBySFM: boolean;
};

const CLIENTS: Client[] = [
  {
    name: 'High Bar Roofing',
    logo: '/images/clients/high-bar-roofing.png',
    website: 'https://www.highbarroofing.com',
    builtBySFM: true,
  },
  {
    name: 'Total Pro Roofing',
    logo: '/images/clients/total-pro-roofing.png',
    website: 'https://www.totalproroofingllc.net',
    builtBySFM: true,
  },
  {
    name: 'Prime Seal Notary',
    logo: '/images/clients/prime-seal-notary.png',
    website: 'https://www.primesealnotarytx.com',
    builtBySFM: true,
  },
  {
    name: 'Big Feet Art',
    logo: '/images/clients/big-feet-art.png',
    website: 'https://bigfeetart.com',
    builtBySFM: true,
  },
  {
    name: 'Elite 2A Pay',
    logo: '/images/clients/elite-2a-pay.png',
    website: null,
    builtBySFM: false,
  },
  {
    name: 'Retire Guides',
    logo: '/images/clients/retire-guides.png',
    website: null,
    builtBySFM: false,
  },
  {
    name: 'Coutior',
    logo: '/images/clients/coutior.png',
    website: null,
    builtBySFM: false,
  },
  {
    name: 'Empress',
    logo: '/images/clients/empress.png',
    website: null,
    builtBySFM: false,
  },
];

function LogoCell({ client }: { client: Client }) {
  const logoBlock = (
    <div className="relative h-20 w-48 flex-shrink-0">
      <Image
        src={client.logo}
        alt={client.name}
        fill
        className="object-contain"
        sizes="192px"
      />
    </div>
  );

  if (client.builtBySFM && client.website) {
    return (
      <a
        href={client.website}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-28 w-60 flex-shrink-0 flex-col items-center justify-between opacity-80 transition-opacity hover:opacity-100"
      >
        {logoBlock}
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass group-hover:underline">
          Designed by SFM →
        </span>
      </a>
    );
  }

  return (
    <div className="flex h-28 w-60 flex-shrink-0 flex-col items-center justify-center opacity-70">
      {logoBlock}
    </div>
  );
}

export function LogoWall() {
  const doubled = [...CLIENTS, ...CLIENTS];

  return (
    <section
      className="overflow-hidden border-y border-brass/15 bg-gunpowder/95 py-16"
      aria-label="Clients"
    >
      <DataLabel className="mb-10 text-center">TRUSTED BY</DataLabel>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-gunpowder to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-gunpowder to-transparent" />

        <div
          className="flex w-max animate-marquee gap-16 hover:[animation-play-state:paused] motion-reduce:animate-none"
          aria-hidden={false}
        >
          {doubled.map((client, i) => (
            <LogoCell key={`${client.name}-${i}`} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
}
