import {cn} from '@/lib/cn';

type Tone = 'light' | 'dark' | 'hero';

const tones: Record<Tone, string> = {
  light: 'bg-white/70 text-ink-700 ring-navy-900/[0.06]',
  dark: 'bg-white/10 text-white/85 ring-white/15',
  hero: 'bg-gold-300/45 text-navy-900 ring-gold-500/30'
};

export function TagChip({children, tone = 'light', className}: {children: React.ReactNode; tone?: Tone; className?: string}) {
  return (
    <span className={cn('label-caps inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 ring-1', tones[tone], className)}>
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-gold-500" />
      {children}
    </span>
  );
}
