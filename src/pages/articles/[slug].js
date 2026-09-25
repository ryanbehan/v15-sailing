import Head from 'next/head';
import { useRouter } from 'next/router';
import Markdown from '../../components/Markdown';
import { getArticles } from '../../lib/content';

export default function Article({ article }) {
  const router = useRouter();

  // Fallback state (should not happen with fallback: false, but safeguard anyway)
  if (router.isFallback) {
    return <p className="text-center py-20">Loading…</p>;
  }

  if (!article) {
    return (
      <p className="text-center py-20 text-red-600">Article not found.</p>
    );
  }

  return (
    <>
      <Head>
        <title>{`${article.title} | V-15 Sailing`}</title>
      </Head>
      <article className="prose prose-lg mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-navy-blue">{article.title}</h1>
        {article.content ? (
          article.format === 'markdown' ? (
            <Markdown content={article.content} />
          ) : (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )
        ) : (
          <p className="text-xl text-gray-600">{article.description}</p>
        )}
        {article.source_url && (
          <p className="text-sm text-gray-500 mt-8">
            Originally published on{' '}
            <a href={article.source_url} className="underline" target="_blank" rel="noopener noreferrer">
              {article.source_url.includes('medium.com') ? 'Medium' : 'v15.org (archived)'}
            </a>
          </p>
        )}
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const articles = await getArticles();
  const paths = articles.map((a) => ({ params: { slug: a.url } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const articles = await getArticles();
  const article = articles.find((a) => a.url === params.slug) || null;
  return { props: { article } };
}
