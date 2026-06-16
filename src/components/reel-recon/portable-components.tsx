import Image from 'next/image';
import { urlForImage } from '@/sanity/image';

export const reelReconPortableComponents = {
  types: {
    image: ({ value }: { value: { asset?: { _ref: string }; alt?: string } }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value)?.width(1600).url();
      if (!url) return null;
      return (
        <figure className="my-10">
          <div className="relative aspect-video w-full overflow-hidden rounded">
            <Image
              src={url}
              alt={value.alt ?? ''}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
          </div>
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-12 mb-4 font-serif text-3xl italic leading-tight">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-10 mb-3 font-serif text-2xl italic">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-8 border-l-2 border-brass pl-6 font-serif text-xl italic text-bone">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 leading-relaxed text-bone-muted">{children}</p>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href?: string };
    }) => (
      <a
        href={value?.href}
        className="text-brass underline hover:text-golden-hour"
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-5 list-disc space-y-2 pl-6 text-bone-muted">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-6 text-bone-muted">{children}</ol>
    ),
  },
};
