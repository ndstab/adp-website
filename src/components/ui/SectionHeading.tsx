import {cn} from '@/lib/cn';
import {TagChip} from './TagChip';

type Props = {
  chip: string;
  title1: string;
  title2?: string;
  sub?: React.ReactNode;
  align?: 'start' | 'center';
  tone?: 'light' | 'dark';
  as?: 'h1' | 'h2';
  id?: string;
  className?: string;
};

/** Chip above a two-line title: line one medium, line two regular. */
export function SectionHeading({chip, title1, title2, sub, align = 'start', tone = 'light', as: Tag = 'h2', id, className}: Props) {
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', className)}>
      <TagChip tone={tone === 'dark' ? 'dark' : 'light'}>{chip}</TagChip>
      <Tag id={id} className={cn('title mt-5 text-balance', tone === 'dark' ? 'text-white' : 'text-navy-900')}>
        <span className="block font-semibold">{title1}</span>
        {title2 && <span className="block font-normal">{title2}</span>}
      </Tag>
      {sub && (
        <p className={cn('mt-4 max-w-xl text-[15px] leading-relaxed', align === 'center' && 'mx-auto', tone === 'dark' ? 'text-white/75' : 'text-ink-500')}>
          {sub}
        </p>
      )}
    </div>
  );
}
