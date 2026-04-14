import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  as?: 'div' | 'span' | 'p';
  className?: string;
  tone?: 'brass' | 'muted';
};

export function DataLabel({ children, as: Tag = 'div', className, tone = 'brass' }: Props) {
  const color = tone === 'brass' ? 'text-brass' : 'text-bone-subtle';
  return <Tag className={cn('data-label', color, className)}>{children}</Tag>;
}
