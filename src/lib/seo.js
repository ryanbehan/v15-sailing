export const SITE_URL = 'https://v-15.org';
export const SITE_NAME = 'V15 Sailing';
export const SOCIAL_IMAGE = {
  url: `${SITE_URL}/images/v15-sailing-social.jpg`,
  alt: 'Vanguard 15 fleet sailing at CRDC on the Connetquot River',
  width: 1200,
  height: 630,
};

export function canonicalUrl(path) {
  const pathname = new URL(path, SITE_URL).pathname;
  return `${SITE_URL}${pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`}`;
}

export function summarize(value, fallback) {
  const text = String(value || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/^#{1,6}\s+.*$/gm, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[*_`>#|~]/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim() || fallback;
  if (text.length <= 160) return text;
  const excerpt = text.slice(0, 157);
  const boundary = excerpt.lastIndexOf(' ');
  return `${excerpt.slice(0, boundary > 100 ? boundary : 157).replace(/[.,;:]$/, '')}…`;
}

export function sectionId(value) {
  return `section-${value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')}`;
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
