import Link from 'next/link';
import { DataLabel } from '@/components/primitives/data-label';

type Props = {
  label: string;
  title: string;
  action?: { href: string; label: string };
};

export function SectionHeader({ label, title, action }: Props) {
  return (
    <div className="mb-10 flex items-end justify-between">
      <div>
        <DataLabel className="mb-2">{label}</DataLabel>
        <h2 className="font-serif text-4xl italic md:text-5xl">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="data-label text-bone-muted hover:text-bone">
          {action.label} →
        </Link>
      )}
    </div>
  );
}
