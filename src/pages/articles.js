import Seo from '../components/Seo';
import Link from 'next/link';

import { getArticles } from '../lib/content';

export default function Articles({ articles }) {
  return (
    <>
      <Seo
        title="Vanguard 15 Articles & Class Resources"
        description="Browse Vanguard 15 class history, archived contacts, membership information, and sailing articles, with links to clubs, rules, and boat resources."
        path="/articles/"
        type="CollectionPage"
      />
      <div className="py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Index / Articles</p>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Articles</h1>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {articles.map((a) => (
            <li key={a.url} className="group py-5">
              <Link href={`/articles/${a.url}`} className="text-lg font-bold uppercase tracking-wide text-white group-hover:text-signal transition">
                {a.title}
              </Link>
              <p className="text-sm text-white/55 mt-1">{a.description}</p>
              {a.category && (
                <span className="inline-block mt-2 font-mono text-[10px] uppercase tracking-[0.2em] border border-white/20 text-white/60 px-2 py-0.5">{a.category}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const articles = await getArticles();
  return {
    props: {
      articles: articles.map(({ url, title, description, category }) => ({
        url,
        title,
        description,
        category: category || null,
      })),
    },
  };
}
