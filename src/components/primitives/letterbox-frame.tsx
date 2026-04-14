import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function LetterboxFrame({ children, className }: Props) {
  return (
    <div className={cn('relative', className)}>
      <div className="letterbox-top absolute inset-x-0 top-0 z-10" />
      <div className="letterbox-bottom absolute inset-x-0 bottom-0 z-10" />
      {children}
    </div>
  );
}
