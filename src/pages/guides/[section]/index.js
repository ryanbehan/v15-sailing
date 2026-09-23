import Head from 'next/head';
import Link from 'next/link';
import { getArticlesBySection } from '../../../lib/guides';

export async function getStaticPaths() {
  // build-time list of sections from markdown directory structure
  const { promises: fs } = await import('fs');
  const path = (await import('path')).default;
  const base = path.join(process.cwd(), 'doc', 'guides');
  const entries = await fs.readdir(base, { withFileTypes: true });
  const paths = entries.filter((e) => e.isDirectory()).map((e) => ({ params: { section: e.name } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const articles = await getArticlesBySection(params.section);
  return { props: { section: params.section, articles } };
}

export default function GuidesSection({ section, articles }) {
  const title = section.replace(/-/g, ' ');
  const display = `${title.charAt(0).toUpperCase() + title.slice(1)} Guides`;
  return (
    <>
      <Head>
        <title>{`${display} | V-15 Sailing`}</title>
      </Head>
      <div className="prose mx-auto py-8">
        <h1>{display}</h1>
      <div className="space-y-4">
        {articles.map((a) => (
          <div key={a.slug} className="border rounded-lg p-4 hover:bg-gray-50 transition leading-relaxed">
            <Link href={`/guides/${section}/${a.slug}`} className="text-sky-blue hover:underline">
              {a.title}
            </Link>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
