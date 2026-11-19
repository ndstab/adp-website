// NEXT_PUBLIC_REVIEW_MODE keeps the site out of search engines until launch.
export const reviewMode = process.env.NEXT_PUBLIC_REVIEW_MODE !== 'false';

// Dashed VERIFY markers and the legal draft notice are for internal review only: NEXT_PUBLIC_REVIEW_MARKERS=true shows them.
export const showReviewMarkers = process.env.NEXT_PUBLIC_REVIEW_MARKERS === 'true';

// Values left empty or marked [ADD] in /content are left out of the page until they are supplied.
export const isPlaceholder = (value: string) => ['', '[ADD]'].includes(value.trim());
