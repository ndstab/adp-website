import {ArrowUpRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Pillar, Solution} from '@/content/schema';
import {PillarIcon} from './PillarIcon';

export function SolutionCard({solution, pillar, cta}: {solution: Solution; pillar: Pillar; cta: string}) {
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="group flex h-full flex-col rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06] transition-shadow hover:shadow-card"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy-700 text-white ring-[1.5px] ring-gold-500">
          <PillarIcon icon={pillar.icon} className="size-[18px]" />
        </span>
        <span className="text-[12px] leading-tight text-ink-500">
          <span className="font-semibold text-navy-900 tabular-nums">{solution.code}</span> · {pillar.name}
        </span>
      </div>
      <h3 className="mt-5 text-[17px] leading-snug font-semibold text-navy-900">{solution.title}</h3>
      <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-500">{solution.summary}</p>
      <span className="label-caps mt-6 inline-flex items-center gap-1.5 text-navy-900 transition-colors group-hover:text-blue-600">
        {cta}
        <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
      </span>
    </Link>
  );
}
