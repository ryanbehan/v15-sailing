import Head from 'next/head';
import { SITE_URL, SITE_NAME, SOCIAL_IMAGE, canonicalUrl, summarize, serializeJsonLd } from '../lib/seo';

export default function Seo({ title, description, path, type = 'WebPage', sourceUrl, noindex = false }) {
  const heading = title.replace(/\bV-15\b/g, 'V15');
  const fullTitle = `${heading} | ${SITE_NAME}`;
  const summary = summarize(description, `${heading}. Practical Vanguard 15 sailing information from the community resource library.`);
  const url = path ? canonicalUrl(path) : null;
  const organization = `${SITE_URL}/#organization`;
  const website = `${SITE_URL}/#website`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organization,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/images/vanguard-15-logo.png`,
          width: 390,
          height: 291,
        },
      },
      {
        '@type': 'WebSite',
        '@id': website,
        name: SITE_NAME,
        alternateName: 'Vanguard 15 Sailing',
        url: `${SITE_URL}/`,
        inLanguage: 'en',
        publisher: { '@id': organization },
      },
      {
        '@type': type,
        '@id': `${url}#${type === 'Article' ? 'article' : 'webpage'}`,
        url,
        name: heading,
        description: summary,
        inLanguage: 'en',
        isPartOf: { '@id': website },
        ...(type === 'Article' ? {
          headline: heading,
          mainEntityOfPage: url,
          publisher: { '@id': organization },
          ...(sourceUrl ? { isBasedOn: sourceUrl } : {}),
        } : {}),
      },
    ],
  };

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={summary} key="description" />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} key="robots" />
      {url && <link rel="canonical" href={url} key="canonical" />}
      {!noindex && url && <link rel="alternate" type="text/markdown" href={`${url}index.md`} key="markdown" />}
      {!noindex && url && <link rel="describedby" type="text/plain" href={`${SITE_URL}/llms.txt`} key="agent-index" />}
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:locale" content="en_US" key="og:locale" />
      <meta property="og:type" content={type === 'Article' ? 'article' : 'website'} key="og:type" />
      <meta property="og:title" content={fullTitle} key="og:title" />
      <meta property="og:description" content={summary} key="og:description" />
      {url && <meta property="og:url" content={url} key="og:url" />}
      <meta property="og:image" content={SOCIAL_IMAGE.url} key="og:image" />
      <meta property="og:image:secure_url" content={SOCIAL_IMAGE.url} key="og:image:secure_url" />
      <meta property="og:image:type" content="image/jpeg" key="og:image:type" />
      <meta property="og:image:width" content={String(SOCIAL_IMAGE.width)} key="og:image:width" />
      <meta property="og:image:height" content={String(SOCIAL_IMAGE.height)} key="og:image:height" />
      <meta property="og:image:alt" content={SOCIAL_IMAGE.alt} key="og:image:alt" />
      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={fullTitle} key="twitter:title" />
      <meta name="twitter:description" content={summary} key="twitter:description" />
      <meta name="twitter:image" content={SOCIAL_IMAGE.url} key="twitter:image" />
      <meta name="twitter:image:alt" content={SOCIAL_IMAGE.alt} key="twitter:image:alt" />
      {!noindex && url && (
        <script type="application/ld+json" key="structured-data" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
      )}
    </Head>
  );
}
