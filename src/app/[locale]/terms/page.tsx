import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import type {Locale} from '@/i18n/routing';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {LegalPage} from '@/components/page/LegalPage';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'legal.terms.meta'});
  return pageMetadata({locale: locale as Locale, path: '/terms', title: t('title'), description: t('description')});
}

export default async function TermsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <LegalPage doc="terms" />;
}
