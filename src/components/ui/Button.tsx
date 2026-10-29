import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';
import type {ComponentProps} from 'react';

type Variant = 'gold' | 'white' | 'navy' | 'ghost-dark';
type Size = 'md' | 'sm';

// Display, radius and padding live in one place per option so callers never pass a
// class that competes with them (Tailwind does not resolve such conflicts by order).
const base =
  'label-caps inline-flex items-center justify-center gap-2 transition-[background-color,box-shadow,transform] duration-200 ease-[var(--ease-soft)] active:translate-y-px disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  gold: 'rounded-lg bg-gold-500 text-navy-900 shadow-[0_8px_20px_-10px_rgb(242_194_49/0.9)] hover:bg-gold-300',
  white: 'rounded-full bg-white text-navy-900 shadow-pill hover:bg-sand-50',
  navy: 'rounded-lg bg-navy-700 text-white hover:bg-navy-900',
  'ghost-dark': 'rounded-lg bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15'
};

const sizes: Record<Size, string> = {
  md: 'px-5 py-3.5',
  sm: 'px-4 py-2.5'
};

export function buttonClass(variant: Variant = 'gold', className?: string, size: Size = 'md') {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  variant = 'gold',
  size = 'md',
  className,
  ...props
}: ComponentProps<typeof Link> & {variant?: Variant; size?: Size}) {
  return <Link className={buttonClass(variant, className, size)} {...props} />;
}
