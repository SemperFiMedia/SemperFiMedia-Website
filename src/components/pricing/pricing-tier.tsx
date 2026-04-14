import { cn } from '@/lib/utils';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';

type Props = {
  label: string;
  name: string;
  price: string;
  priceNote?: string;
  includes: string[];
  highlighted?: boolean;
  href?: string;
};

export function PricingTier({
  label,
  name,
  price,
  priceNote,
  includes,
  highlighted = false,
  href = '/contact',
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col border bg-gunpowder/80 p-8 md:p-10',
        highlighted
          ? 'border-brass bg-gradient-to-b from-texas-umber/40 to-gunpowder'
          : 'border-bone/15'
      )}
    >
      <DataLabel className="mb-3">{label}</DataLabel>
      <h3 className="font-serif text-3xl italic">{name}</h3>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-serif text-5xl">{price}</span>
        {priceNote && <span className="text-sm text-bone-subtle">{priceNote}</span>}
      </div>
      <ul className="mt-6 flex-1 space-y-3 text-sm text-bone-muted">
        {includes.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-brass">›</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <BrassButton href={href} variant={highlighted ? 'filled' : 'outline'}>
          Book This Package →
        </BrassButton>
      </div>
    </div>
  );
}
