import {useTranslations} from 'next-intl';
import {Reveal} from '@/components/ui/Reveal';
import {ButtonLink} from '@/components/ui/Button';

type Props = {title1?: string; title2?: string; sub?: string; button?: string};

/**
 * Navy closing band. Sits directly above the footer so the two read as one dark block.
 * Inner pages pass their own heading; the technology-domain strip stays the same.
 */
export function CtaBand({title1, title2, sub, button}: Props = {}) {
  const t = useTranslations('home.cta');
  const domains = t.raw('domains') as string[];

  return (
    <section aria-labelledby="cta-title" className="on-dark bg-[linear-gradient(180deg,var(--color-navy-700)_0%,var(--color-navy-500)_100%)] pt-20 pb-6 text-white sm:pt-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="cta-title" className="title text-balance text-white">
            <span className="block font-semibold">{title1 ?? t('title1')}</span>
            <span className="block font-normal">{title2 ?? t('title2')}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/75">{sub ?? t('sub')}</p>
          <ButtonLink href="/contact" className="mt-8">
            {button ?? t('button')}
          </ButtonLink>
        </Reveal>

        {/* Technology domains, in place of partner logos */}
        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="shrink-0">
            <p className="text-[14px] font-semibold">{t('domainsTitle')}</p>
            <p className="mt-0.5 text-[12.5px] text-white/80">{t('domainsSub')}</p>
          </div>
          <ul className="flex flex-wrap gap-2 lg:justify-end">
            {domains.map((domain) => (
              <li key={domain} className="flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-[13px] text-white/90 ring-1 ring-white/15">
                <span aria-hidden className="size-1.5 rounded-full bg-gold-500" />
                {domain}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
