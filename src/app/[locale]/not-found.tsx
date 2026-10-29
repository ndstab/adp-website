import {useTranslations} from 'next-intl';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {ButtonLink} from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('common.notFound');
  return (
    <section className="container-site flex min-h-[78vh] flex-col items-center justify-center pt-32 pb-20 text-center">
      <SectionHeading as="h1" align="center" chip={t('chip')} title1={t('title1')} title2={t('title2')} sub={t('body')} />
      <ButtonLink href="/" className="mt-8">
        {t('cta')}
      </ButtonLink>
    </section>
  );
}
