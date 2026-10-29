import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowUpRight, Check, UserRound} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {getIndustries, getSolutions} from '@/content';
import {isPlaceholder} from '@/lib/review';
import {PhotoHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {TagChip} from '@/components/ui/TagChip';
import {AddValue} from '@/components/ui/ReviewFlag';
import {ButtonLink} from '@/components/ui/Button';
import {Reveal} from '@/components/ui/Reveal';
import {CtaBand} from '@/components/home/CtaBand';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'company.about.meta'});
  return pageMetadata({locale: locale as Locale, path: '/about', title: t('title'), description: t('description')});
}

export default async function AboutPage({params}: Params) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <About locale={locale} />;
}

function About({locale}: {locale: Locale}) {
  const t = useTranslations('company.about');
  const tp = useTranslations('pages.breadcrumb');
  const why = useTranslations('home.contact.why');
  const stats = t.raw('stats') as Array<{label: string; value: string}>;
  const paragraphs = t.raw('story.paragraphs') as string[];
  const missionCards = t.raw('mission.cards') as Array<{title: string; body: string}>;
  const values = t.raw('values.items') as Array<{title: string; body: string}>;
  const phases = t.raw('focus.phases') as Array<{title: string; body: string}>;
  const offerSlugs = t.raw('focus.offerSlugs') as string[];
  const categories = t.raw('partners.categories') as string[];
  const members = t.raw('leadership.members') as Array<{name: string; role: string}>;
  const solutions = getSolutions(locale);
  const sectors = getIndustries(locale).slice(0, 6);

  return (
    <>
      <PhotoHero
        image="/images/about/riyadh-metro-towers.jpg"
        alt={t('hero.alt')}
        chip={t('hero.chip')}
        title1={t('hero.title1')}
        sub={t('hero.sub')}
        breadcrumbs={<Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t('hero.chip')}]} />}
      />

      {/* Stat row */}
      <section aria-label={t('hero.title1')} className="container-site py-14 sm:py-16">
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-2">
              <dt className="text-[14px] text-ink-500">{s.label}</dt>
              <dd className="text-[34px] leading-none font-medium tracking-tight text-navy-900 sm:text-[44px] rtl:tracking-normal">
                {isPlaceholder(s.value) ? <AddValue value={s.value} tone="light" /> : s.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Story */}
      <section aria-labelledby="story-title" className="container-site grid grid-cols-1 gap-10 pb-20 sm:pb-28 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
        <SectionHeading id="story-title" chip={t('story.chip')} title1={t('story.title1')} title2={t('story.title2')} />
        <div className="grid gap-5 text-[16px] leading-relaxed text-ink-700">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section aria-labelledby="mission-title" className="bg-white/50 py-20 sm:py-28">
        <div className="container-site text-center">
          <TagChip>{t('mission.chip')}</TagChip>
          <h2 id="mission-title" className="mx-auto mt-5 max-w-3xl text-[24px] leading-snug font-medium text-balance text-navy-900 sm:text-[30px]">
            {t('mission.title')}
          </h2>
          <ul className="mt-12 grid grid-cols-1 gap-3 text-start sm:grid-cols-2 lg:grid-cols-4">
            {missionCards.map((c, i) => (
              <li key={c.title}>
                <Reveal delay={i * 0.06} className="h-full rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
                  <span aria-hidden className="block h-0.5 w-8 rounded-full bg-gold-500" />
                  <h3 className="mt-5 text-[15px] font-semibold text-navy-900">{c.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{c.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="container-site grid grid-cols-1 items-start gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading id="values-title" chip={t('values.chip')} title1={t('values.title1')} title2={t('values.title2')} sub={t('values.intro')} />
          <ul className="mt-8 divide-y divide-navy-900/[0.08] rounded-[var(--radius-card)] bg-white px-6 ring-1 ring-navy-900/[0.06]">
            {values.map((v) => (
              <li key={v.title} className="py-5">
                <h3 className="text-[15px] font-semibold text-navy-900">{v.title}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:mt-24">
          <div className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
            <Image src="/images/about/professional-woman-tablet.jpg" alt={t('values.alt1')} fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
          </div>
          <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
            <Image src="/images/about/team-collaboration-table.jpg" alt={t('values.alt2')} fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Vision */}
      <section aria-labelledby="vision-title" className="bg-white/50 py-20 sm:py-28">
        <div className="container-site grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
            <Image src="/images/about/contract-review-meeting.jpg" alt={t('vision.alt')} fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
          </div>
          <div>
            <TagChip>{t('vision.chip')}</TagChip>
            <h2 id="vision-title" className="mt-5 text-[26px] leading-snug font-medium text-balance text-navy-900 sm:text-[32px]">
              {t('vision.title')}
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-500">{t('vision.body')}</p>
          </div>
        </div>
      </section>

      {/* Why ADP */}
      <section aria-labelledby="why-title" className="container-site py-20 sm:py-28">
        <SectionHeading id="why-title" chip={t('why.chip')} title1={t('why.title')} />
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(why.raw('points') as string[]).map((point) => (
            <li key={point} className="flex items-start gap-3 rounded-[var(--radius-card)] bg-sand-100 p-5 text-[15px] font-medium text-navy-900 ring-1 ring-navy-900/[0.04]">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-900">
                <Check aria-hidden strokeWidth={2.25} className="size-3.5" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* Focus */}
      <section aria-labelledby="focus-title" className="bg-white/50 py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading id="focus-title" chip={t('focus.chip')} title1={t('focus.title1')} title2={t('focus.title2')} />
          <ol className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
            {phases.map((phase, i) => (
              <li key={phase.title} className="relative rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
                <span className="grid size-9 place-items-center rounded-full bg-navy-700 text-[13px] font-semibold text-white ring-[1.5px] ring-gold-500 tabular-nums">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[17px] font-semibold text-navy-900">{phase.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{phase.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-[15px] font-semibold text-navy-900">{t('focus.sectors')}</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {sectors.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/industries/${s.slug}`} className="block rounded-full bg-navy-700 px-3.5 py-2 text-[12.5px] text-white transition-colors hover:bg-navy-900">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-navy-900">{t('focus.offers')}</h3>
              <ul className="mt-3 grid gap-1.5">
                {offerSlugs.map((slug) => {
                  const s = solutions.find((x) => x.slug === slug)!;
                  return (
                    <li key={slug}>
                      <Link href={`/solutions/${slug}`} className="group flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-[14px] text-navy-900 ring-1 ring-navy-900/[0.06] hover:ring-navy-900/20">
                        {s.title}
                        <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 shrink-0 text-ink-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section aria-labelledby="partners-title" className="container-site py-20 sm:py-28">
        <div className="on-dark grid grid-cols-1 gap-8 rounded-[1.75rem] bg-[linear-gradient(160deg,var(--color-navy-700),var(--color-navy-500))] p-6 text-white sm:p-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <TagChip tone="dark">{t('partners.chip')}</TagChip>
            <h2 id="partners-title" className="title mt-5 font-semibold text-white">
              {t('partners.title')}
            </h2>
            <p className="mt-5 text-[14.5px] leading-relaxed text-white/80">{t('partners.note')}</p>
            <ButtonLink href="/alliance" className="mt-8">
              {t('partners.cta')}
            </ButtonLink>
          </div>
          <div>
            <p className="text-[15px] text-white/80">{t('partners.body')}</p>
            <ul className="mt-4 grid gap-2">
              {categories.map((c) => (
                <li key={c} className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-4 py-3.5 text-[14.5px] ring-1 ring-white/10">
                  <span aria-hidden className="size-1.5 rounded-full bg-gold-500" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section aria-labelledby="leadership-title" className="container-site pb-20 sm:pb-28">
        <SectionHeading id="leadership-title" chip={t('leadership.chip')} title1={t('leadership.title')} sub={t('leadership.note')} />
        <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {members.map((m, i) => (
            <li key={i} className="overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-navy-900/[0.06]">
              <div className="grid aspect-[4/5] place-items-center bg-sand-100">
                <UserRound aria-hidden strokeWidth={1} className="size-16 text-ink-500/40" />
              </div>
              <div className="p-4">
                <p className="text-[15px] font-semibold">
                  <AddValue value={m.name} tone="light" />
                </p>
                <p className="mt-0.5 text-[12.5px]">
                  <AddValue value={m.role} tone="light" />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
