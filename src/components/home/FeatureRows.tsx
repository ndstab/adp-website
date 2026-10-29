import {useTranslations} from 'next-intl';
import {Check} from 'lucide-react';
import {cn} from '@/lib/cn';
import {TagChip} from '@/components/ui/TagChip';
import {Reveal} from '@/components/ui/Reveal';
import {AgentBuilderMock, IotMock, WatermarkMock} from './FeatureMocks';

type Row = {id: 'builder' | 'watermark' | 'iot'; chip: string; title1: string; title2: string; body: string; points: string[]};

const mocks = {builder: AgentBuilderMock, watermark: WatermarkMock, iot: IotMock};

export function FeatureRows() {
  const t = useTranslations('home.features');
  const rows = t.raw('rows') as Row[];

  return (
    <section aria-label={rows.map((r) => r.chip).join(', ')} className="container-site grid grid-cols-1 gap-20 py-20 sm:gap-28 sm:py-28">
      {rows.map((row, i) => {
        const Mock = mocks[row.id];
        const flip = i % 2 === 1;
        return (
          <article key={row.id} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <Reveal className={cn('flex justify-center rounded-[1.75rem] bg-sand-100 px-5 py-10 ring-1 ring-navy-900/[0.04] sm:px-10 sm:py-14', flip && 'lg:order-2')}>
              <Mock />
            </Reveal>
            <Reveal delay={0.1} className="max-w-[30rem]">
              <TagChip>{row.chip}</TagChip>
              <h2 className="title mt-5 text-navy-900">
                <span className="block font-semibold">{row.title1}</span>
                <span className="block font-normal">{row.title2}</span>
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-500">{row.body}</p>
              <ul className="mt-6 grid gap-2.5">
                {row.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[14px] text-ink-700">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-navy-700 text-gold-500">
                      <Check aria-hidden strokeWidth={2} className="size-3" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </article>
        );
      })}
    </section>
  );
}
