import Head from 'next/head';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { getGuideArticles, getArticle } from '../../../lib/guides';

import D2 from '../../../components/D2';

export default function GuideArticle({ article }) {
  const router = useRouter();
  if (router.isFallback) return <p className="text-center py-20">Loading…</p>;
  if (!article) return <p className="text-center py-20 text-red-600">Article not found.</p>;

  return (
    <>
      <Head>
        <title>{article.title} | V-15 Guides</title>
      </Head>
      <article className="prose mx-auto py-8">
        <h1>{article.title}</h1>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              if (!inline && match && match[1] === 'd2') {
                return <D2 chart={String(children).replace(/\n$/, '')} />;
              }
              return !inline && match ? (
                <code className={className} {...props}>
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {article.content}
        </ReactMarkdown>
        {article.original_pdf && (
          <p>
            Original PDF: {' '}
            <a href={`/${article.original_pdf}`} className="text-sky-blue underline" target="_blank" rel="noopener noreferrer">
              download
            </a>
          </p>
        )}
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const articles = await getGuideArticles();
  const paths = articles.map((a) => ({ params: { section: a.section, slug: a.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const article = await getArticle(params.section, params.slug);
  return { props: { article } };
}
