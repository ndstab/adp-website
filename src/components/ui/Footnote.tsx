/** Superscript link to an entry in the page's Sources list. */
export function Footnote({n, id, label}: {n: number; id: string; label: string}) {
  return (
    <sup className="ms-0.5 align-super text-[0.6em] font-semibold">
      <a href={`#source-${id}`} className="rounded px-0.5 text-blue-600 hover:underline" aria-label={label}>
        {n}
      </a>
    </sup>
  );
}
