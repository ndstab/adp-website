// Review markers stay visible until launch; set NEXT_PUBLIC_REVIEW_MODE=false to hide them.
export const reviewMode = process.env.NEXT_PUBLIC_REVIEW_MODE !== 'false';

export const isPlaceholder = (value: string) => value.trim() === '[ADD]';
