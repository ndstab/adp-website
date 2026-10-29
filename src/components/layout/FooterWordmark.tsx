/** Giant outlined "ADP" bleeding off the bottom edge, over a fading text pattern. */
export function FooterWordmark() {
  return (
    <div aria-hidden className="relative h-[clamp(118px,25vw,360px)] select-none overflow-hidden">
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_62%_95%_at_62%_100%,#000_25%,transparent_72%)] rtl:[mask-image:radial-gradient(ellipse_62%_95%_at_38%_100%,#000_25%,transparent_72%)]">
        {/* Repeating "ADP SOLUTIONS" drawn as a background tile, so it adds no text nodes to the page. */}
        <div className="size-full bg-[url(/brand/wordmark-pattern.svg)] bg-[length:300px_36px] bg-repeat" />
      </div>
      <svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMin meet" className="absolute inset-x-0 top-[6%] w-full">
        <defs>
          <linearGradient id="wordmark-stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="wordmark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.75" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <text
          x="500"
          y="318"
          textAnchor="middle"
          textLength="960"
          lengthAdjust="spacingAndGlyphs"
          fontSize="400"
          fontWeight="800"
          fill="url(#wordmark-fill)"
          stroke="url(#wordmark-stroke)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          style={{fontFamily: 'var(--font-manrope), sans-serif'}}
        >
          ADP
        </text>
      </svg>
    </div>
  );
}
