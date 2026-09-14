import { useHead } from '@unhead/vue';

const SITE_URL = import.meta.env.VITE_SITE_URL ?? '';

/**
 * Per-page <title>, description, canonical URL and social-share text.
 * Site-wide tags (Open Graph image, locale, JSON-LD…) stay in index.html.
 */
export function usePageHead({ path, title, description }) {
  const url = `${SITE_URL}${path}`;
  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    link: [{ rel: 'canonical', href: url }],
  });
}
