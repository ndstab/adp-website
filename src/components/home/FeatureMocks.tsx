import {useTranslations} from 'next-intl';
import {AlertTriangle, CheckCircle2, ChevronDown, FileLock2, Plus, ShieldAlert} from 'lucide-react';

/* Illustrative product UI for the feature rows. Decorative: hidden from assistive tech,
   since the row text beside each one carries the meaning. */

function Field({label, value, select}: {label: string; value: string; select?: boolean}) {
  return (
    <div className="min-w-0">
      <p className="text-[10.5px] text-ink-500">{label}</p>
      <p className="mt-1 flex items-center justify-between gap-2 rounded-lg bg-sand-50 px-2.5 py-2 text-[12px] text-navy-900 ring-1 ring-navy-900/[0.06]">
        <span className="truncate">{value}</span>
        {select && <ChevronDown strokeWidth={1.5} className="size-3.5 shrink-0 text-ink-500" />}
      </p>
    </div>
  );
}

function Toggle({on = true}: {on?: boolean}) {
  return (
    <span className={`relative inline-flex h-4 w-7 shrink-0 rounded-full ${on ? 'bg-success' : 'bg-sand-200'}`}>
      <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${on ? 'end-0.5' : 'start-0.5'}`} />
    </span>
  );
}

export function AgentBuilderMock() {
  const t = useTranslations('home.features.builder');
  const channels = t.raw('channelValues') as string[];
  const guardrails = t.raw('guardrailValues') as string[];
  return (
    <div aria-hidden className="w-full min-w-0 max-w-[25rem] rounded-2xl bg-white p-5 shadow-float ring-1 ring-navy-900/[0.05]">
      <p className="text-[13px] font-semibold text-navy-900">{t('title')}</p>
      <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-sand-100" />
      <div className="mt-5 grid grid-cols-1 gap-3">
        <Field label={t('name')} value={t('nameValue')} />
        <Field label={t('description')} value={t('descriptionValue')} />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('language')} value={t('languageValue')} select />
          <Field label={t('hosting')} value={t('hostingValue')} select />
        </div>
        <div>
          <p className="text-[10.5px] text-ink-500">{t('channels')}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {channels.map((c) => (
              <span key={c} className="rounded-md bg-blue-600/10 px-2 py-1 text-[11px] font-medium text-navy-700">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10.5px] text-ink-500">{t('guardrails')}</p>
          <ul className="mt-1 grid gap-1.5">
            {guardrails.map((g) => (
              <li key={g} className="flex items-center justify-between gap-3 rounded-lg bg-sand-50 px-2.5 py-2 text-[11.5px] text-ink-700">
                {g}
                <Toggle />
              </li>
            ))}
          </ul>
        </div>
        <p className="flex items-center justify-between text-[11.5px] text-ink-700">
          {t('active')}
          <Toggle />
        </p>
        <span className="label-caps flex items-center justify-center gap-1.5 rounded-lg bg-gold-500 py-2.5 !text-[10px] text-navy-900">
          <Plus strokeWidth={1.75} className="size-3.5" />
          {t('create')}
        </span>
      </div>
    </div>
  );
}

export function WatermarkMock() {
  const t = useTranslations('home.features.watermark');
  return (
    <div aria-hidden className="relative w-full min-w-0 max-w-[27rem]">
      <div className="overflow-hidden rounded-2xl bg-white shadow-float ring-1 ring-navy-900/[0.05]">
        <div className="flex items-center gap-2 border-b border-navy-900/[0.06] px-4 py-3">
          <span className="flex gap-1">
            <span className="size-2 rounded-full bg-sand-200" />
            <span className="size-2 rounded-full bg-sand-200" />
            <span className="size-2 rounded-full bg-sand-200" />
          </span>
          <FileLock2 strokeWidth={1.5} className="ms-2 size-3.5 text-blue-600" />
          <span className="truncate text-[11.5px] text-ink-700">{t('file')}</span>
        </div>
        <div className="relative px-6 py-6">
          <p className="text-[14px] font-semibold text-navy-900">{t('heading')}</p>
          <div className="mt-3 grid gap-2">
            {[100, 92, 96, 70].map((w, i) => (
              <span key={i} className="h-1.5 rounded-full bg-sand-100" style={{width: `${w}%`}} />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-1.5">
            {Array.from({length: 9}, (_, i) => (
              <span key={i} className={`h-5 rounded ${i < 3 ? 'bg-navy-700/10' : 'bg-sand-50'}`} />
            ))}
          </div>
          <div className="mt-5 grid gap-2">
            {[88, 94, 60].map((w, i) => (
              <span key={i} className="h-1.5 rounded-full bg-sand-100" style={{width: `${w}%`}} />
            ))}
          </div>
          {/* Faint, repeating user watermark */}
          <div dir="ltr" className="pointer-events-none absolute inset-[-40%] flex rotate-[-22deg] flex-col justify-center gap-7 text-[10px] font-medium whitespace-nowrap text-navy-700/[0.13]">
            {Array.from({length: 9}, (_, row) => (
              <p key={row} style={{marginLeft: row % 2 ? -90 : 0}}>
                {`${t('mark')}     ${t('mark')}     ${t('mark')}`}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 start-6 flex items-center gap-3 rounded-xl bg-navy-900 py-2.5 ps-3 pe-4 text-white shadow-float">
        <span className="grid size-8 place-items-center rounded-lg bg-gold-500 text-navy-900">
          <ShieldAlert strokeWidth={1.75} className="size-4" />
        </span>
        <span>
          <span className="block text-[12px] font-semibold">{t('blocked')}</span>
          <span className="block text-[11px] text-white/80">{t('logged')}</span>
        </span>
      </div>
    </div>
  );
}

export function IotMock() {
  const t = useTranslations('home.features.iot');
  const kpis = t.raw('kpis') as Array<{label: string; value: string; unit: string}>;
  const alerts = t.raw('alerts') as Array<{text: string; time: string}>;
  // Two smooth-ish series for flow vs. demand (illustrative).
  const flow = [52, 48, 50, 44, 40, 46, 58, 66, 62, 70, 64, 60, 68, 74, 70, 63];
  const demand = [46, 44, 45, 42, 41, 44, 50, 56, 60, 62, 61, 58, 60, 64, 66, 60];
  const toPath = (s: number[]) => s.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (s.length - 1)) * 300} ${100 - v}`).join(' ');

  return (
    <div aria-hidden className="w-full min-w-0 max-w-[28rem] rounded-2xl bg-white p-5 shadow-float ring-1 ring-navy-900/[0.05]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-navy-900">{t('title')}</p>
        <span className="label-caps flex items-center gap-1.5 !text-[9.5px] text-success">
          <span className="size-1.5 rounded-full bg-success" />
          {t('live')}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl bg-sand-50 p-2.5 ring-1 ring-navy-900/[0.04]">
            <p className="text-[10px] leading-tight text-ink-500">{k.label}</p>
            <p className="mt-1.5 text-navy-900">
              <bdi dir="ltr" className="text-[18px] font-semibold">
                {k.value}
              </bdi>
              <span className="ms-1 text-[10.5px] text-ink-500">{k.unit}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-sand-50 p-3 ring-1 ring-navy-900/[0.04]">
        <p className="text-[10.5px] text-ink-500">{t('chart')}</p>
        <svg viewBox="0 0 300 70" className="mt-2 h-24 w-full rtl:-scale-x-100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="iot-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0071BE" stopOpacity="0.22" />
              <stop offset="1" stopColor="#0071BE" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[20, 40, 60].map((y) => (
            <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#14305E" strokeOpacity="0.07" vectorEffect="non-scaling-stroke" />
          ))}
          <g transform="translate(0 -30)">
            <path d={`${toPath(flow)} L 300 100 L 0 100 Z`} fill="url(#iot-area)" />
            <path d={toPath(flow)} fill="none" stroke="#0071BE" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            <path d={toPath(demand)} fill="none" stroke="#4FA3E0" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
      </div>
      <ul className="mt-3 grid gap-1.5">
        {alerts.map((a, i) => (
          <li key={a.text} className="flex items-center gap-2.5 rounded-lg bg-sand-50 px-2.5 py-2 text-[11.5px] text-ink-700">
            {i === 0 ? (
              <AlertTriangle strokeWidth={1.5} className="size-3.5 text-danger" />
            ) : (
              <CheckCircle2 strokeWidth={1.5} className="size-3.5 text-success" />
            )}
            <span className="flex-1">{a.text}</span>
            <span className="text-[10.5px] text-ink-500">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
