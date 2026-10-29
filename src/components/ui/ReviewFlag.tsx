import {useTranslations} from 'next-intl';
import {isPlaceholder, reviewMode} from '@/lib/review';
import {cn} from '@/lib/cn';

/** Dashed marker shown next to any claim that still needs verification. */
export function VerifyFlag({className, tone = 'light'}: {className?: string; tone?: 'light' | 'dark'}) {
  const t = useTranslations('common.review');
  if (!reviewMode) return null;
  return (
    <span
      title={t('verifyTitle')}
      className={cn(
        'label-caps inline-flex shrink-0 items-center rounded border border-dashed px-1.5 py-0.5 align-middle !text-[9px] !tracking-[0.12em]',
        tone === 'light' ? 'border-blue-600/50 text-blue-600' : 'border-gold-300/70 text-gold-300',
        className
      )}
    >
      {t('verify')}
    </span>
  );
}

/** Renders a value, or a visible [ADD] marker when the value is still a placeholder. */
export function AddValue({value, className, tone = 'dark'}: {value: string; className?: string; tone?: 'light' | 'dark'}) {
  const t = useTranslations('common.review');
  if (!isPlaceholder(value)) return <span className={className}>{value}</span>;
  return (
    <span title={t('addTitle')} className={cn('font-semibold', tone === 'dark' ? 'text-gold-300' : 'text-blue-600', className)}>
      [ADD]
    </span>
  );
}
