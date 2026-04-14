import Link from 'next/link';
import { cn } from '@/lib/utils';

type BaseProps = {
  children: React.ReactNode;
  variant?: 'filled' | 'outline';
  className?: string;
};

type LinkProps = BaseProps & { href: string; onClick?: never; type?: never };
type ButtonProps = BaseProps & {
  onClick?: () => void;
  href?: never;
  type?: 'button' | 'submit';
};

function buttonClasses(variant: 'filled' | 'outline', className?: string) {
  const base = 'data-label inline-block px-8 py-4 font-bold uppercase transition-colors';
  const variants = {
    filled: 'bg-brass text-gunpowder hover:bg-golden-hour',
    outline: 'border border-bone-muted text-bone hover:bg-bone hover:text-gunpowder',
  };
  return cn(base, variants[variant], className);
}

export function BrassButton(props: LinkProps | ButtonProps) {
  const { children, variant = 'filled', className } = props;
  const classes = buttonClasses(variant, className);
  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }
  const type = 'type' in props && props.type ? props.type : 'button';
  return (
    <button
      type={type}
      onClick={'onClick' in props ? props.onClick : undefined}
      className={classes}
    >
      {children}
    </button>
  );
}
