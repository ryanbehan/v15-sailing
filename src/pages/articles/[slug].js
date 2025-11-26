import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
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
        <title>{article.title} | V-15 Sailing</title>
      </Head>
      <article className="prose prose-lg mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-navy-blue">{article.title}</h1>
        {article.content ? (
          article.format === 'markdown' ? (
            <ReactMarkdown>{article.content}</ReactMarkdown>
          ) : (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )
        ) : (
          <p className="text-xl text-gray-600">{article.description}</p>
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
