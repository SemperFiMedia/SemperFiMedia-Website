import Image from 'next/image';
import { urlForImage } from '@/sanity/image';
import { DataLabel } from '@/components/primitives/data-label';
import type { Client } from '@/sanity/types';

type Props = {
  clients: Client[];
};

export function LogoWall({ clients }: Props) {
  return (
    <section
      className="border-y border-brass/15 bg-gunpowder/95 px-6 py-16 md:px-12"
      aria-label="Clients"
    >
      <DataLabel className="mb-10 text-center">TRUSTED BY</DataLabel>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-10 opacity-80 md:gap-14">
        {clients.map((client) => {
          const logoSource = client.logoDark ?? client.logo;
          if (!logoSource) return null;
          const builder = urlForImage(logoSource);
          if (!builder) return null;
          return (
            <div key={client._id} className="relative h-10 w-36">
              <Image
                src={builder.height(80).url()}
                alt={client.name}
                fill
                className="object-contain"
                sizes="144px"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
