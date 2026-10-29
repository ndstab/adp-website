import type {MDXComponents} from 'mdx/types';
import {VerifyFlag} from '@/components/ui/ReviewFlag';

// Typography for insight articles. `<Verify />` marks a claim pending verification.
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 mb-4 text-[24px] leading-snug font-semibold text-navy-900" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-[19px] font-semibold text-navy-900" {...props} />,
  p: (props) => <p className="my-5 text-[17px] leading-[1.8] text-ink-700" {...props} />,
  ul: (props) => <ul className="my-5 grid list-disc gap-2 ps-6 text-[17px] leading-[1.8] text-ink-700 marker:text-gold-500" {...props} />,
  ol: (props) => <ol className="my-5 grid list-decimal gap-2 ps-6 text-[17px] leading-[1.8] text-ink-700 marker:font-semibold marker:text-navy-900" {...props} />,
  strong: (props) => <strong className="font-semibold text-navy-900" {...props} />,
  a: (props) => <a className="text-blue-600 underline underline-offset-2 hover:text-navy-900" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-10 rounded-2xl bg-sand-100 px-6 py-4 text-[14px] text-ink-500 ring-1 ring-navy-900/[0.05] [&_p]:my-0 [&_p]:text-[14px]" {...props} />
  ),
  Verify: () => <VerifyFlag className="mx-1" />
};

export function useMDXComponents(): MDXComponents {
  return components;
}
