import type {Pillar} from '@/content/schema';
import {cn} from '@/lib/cn';
import {PillarIcon} from './PillarIcon';

/** Navy pillar badge with the thin gold ring, matching the hero orbit. */
export function PillarBadge({icon, className}: {icon: Pillar['icon']; className?: string}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-[radial-gradient(120%_120%_at_30%_25%,#2a4a80_0%,var(--color-navy-700)_45%,var(--color-navy-900)_100%)] text-white shadow-[0_0_0_1.5px_var(--color-gold-500),0_0_0_5px_rgb(242_194_49/0.12),0_14px_30px_-10px_rgb(14_35_71/0.6)]',
        className
      )}
    >
      <PillarIcon icon={icon} className="size-[42%]" />
    </span>
  );
}
