import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowLeft} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {getInsight, insightSlugs} from '@/content/insights';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {TagChip} from '@/components/ui/TagChip';
import {CtaBand} from '@/components/home/CtaBand';
import {JsonLd} from '@/components/ui/JsonLd';
import {siteUrl} from '@/lib/seo';

type Params = {params: Promise<{locale: string; slug: string}>};

export const dynamicParams = false;

export function generateStaticParams() {
  return insightSlugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, slug} = (await params) as {locale: Locale; slug: string};
  const insight = await getInsight(locale, slug);
  if (!insight) return {};
  return pageMetadata({locale: locale as Locale, path: `/insights/${slug}`, title: insight.meta.title, description: insight.meta.excerpt, type: 'article', image: insight.meta.image});
}

export default async function InsightPage({params}: Params) {
  const {locale, slug} = (await params) as {locale: Locale; slug: string};
  setRequestLocale(locale);
  const insight = await getInsight(locale, slug);
  if (!insight) notFound();
  const {Post, meta} = insight;
  const t = await getTranslations('company.insights');
  const tp = await getTranslations('pages.breadcrumb');
  const date = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', {dateStyle: 'long', timeZone: 'Asia/Riyadh'});

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    inLanguage: locale,
    image: `${siteUrl}${meta.image}`,
    author: {'@id': `${siteUrl}/#organization`},
    publisher: {'@id': `${siteUrl}/#organization`}
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <article className="container-site pt-32 pb-20 sm:pt-36 sm:pb-28">
        <div className="mx-auto max-w-[44rem]">
          <Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t('chip'), href: '/insights'}, {label: meta.title}]} />
          <div className="mt-8">
            <TagChip tone="hero">{t('draft')}</TagChip>
          </div>
          <h1 className="title mt-5 font-semibold text-balance text-navy-900">{meta.title}</h1>
          <p className="mt-4 text-[18px] leading-relaxed text-ink-500">{meta.excerpt}</p>
          <p className="mt-5 text-[13px] text-ink-500">
            <time dateTime={meta.date}>{date.format(new Date(meta.date))}</time> · {t('minutes', {n: meta.readMinutes})}
          </p>
        </div>
        <div className="relative mx-auto mt-10 aspect-[16/8] max-w-5xl overflow-hidden rounded-[var(--radius-card)]">
          <Image src={meta.image} alt={meta.imageAlt} fill priority sizes="(min-width: 1024px) 1000px, 95vw" className="object-cover" />
        </div>
        <div className="mx-auto mt-6 max-w-[44rem]">
          <Post />
          <Link href="/insights" className="label-caps mt-10 inline-flex items-center gap-2 text-navy-900 hover:text-blue-600">
            <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4 rtl:-scale-x-100" />
            {t('back')}
          </Link>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
