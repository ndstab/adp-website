/**
 * The soft "sunrise" arc from the logo: a blurred navy-to-blue ring with a gold glow
 * at its apex. Drawn as a full circle in a 1000×1000 box; the parent crops it.
 * `id` must be unique on the page (it prefixes the gradient and filter ids).
 */
export function ArcBand({id, className}: {id: string; className?: string}) {
  return (
    <svg aria-hidden viewBox="0 0 1000 1000" overflow="visible" className={className}>
      <defs>
        <linearGradient id={`${id}-band`} gradientUnits="userSpaceOnUse" x1="0" y1="780" x2="1000" y2="220">
          <stop offset="0" stopColor="#0E2347" stopOpacity="0.85" />
          <stop offset="0.32" stopColor="#3A5079" stopOpacity="0.62" />
          <stop offset="0.62" stopColor="#0071BE" stopOpacity="0.48" />
          <stop offset="1" stopColor="#4FA3E0" stopOpacity="0.32" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} gradientUnits="userSpaceOnUse" cx="500" cy="0" r="340">
          <stop offset="0" stopColor="#F8DC85" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#F2C231" stopOpacity="0.35" />
          <stop offset="1" stopColor="#F2C231" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={`${id}-halo`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>
      <circle cx="500" cy="500" r="500" fill="none" stroke={`url(#${id}-band)`} strokeWidth="190" opacity="0.2" filter={`url(#${id}-halo)`} />
      <ellipse cx="500" cy="8" rx="300" ry="150" fill={`url(#${id}-glow)`} filter={`url(#${id}-halo)`} />
      <circle cx="500" cy="500" r="500" fill="none" stroke={`url(#${id}-band)`} strokeWidth="104" filter={`url(#${id}-soft)`} />
      <circle cx="500" cy="500" r="484" fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="16" filter={`url(#${id}-soft)`} />
      <circle cx="500" cy="500" r="500" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="1 9" />
    </svg>
  );
}
