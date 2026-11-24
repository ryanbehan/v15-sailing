import Seo from '../../components/Seo';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Markdown from '../../components/Markdown';

export async function getStaticPaths() {
  const base = path.join(process.cwd(), 'doc', 'parts');
  const files = fs.readdirSync(base);
  const paths = files.filter(f => f.endsWith('.md')).map(f => ({ params: { slug: path.basename(f, '.md') } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'doc', 'parts', `${params.slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(raw);
  return { props: { content: content.replace(/^\s*#\s+[^\n]*\n/, ''), title: data.title || params.slug, slug: params.slug } };
}

export default function PartCategory({ title, content, slug }) {
  return (
    <>
      <Seo
        title={`Vanguard 15 ${title}`}
        description={content}
        path={`/parts/${slug}/`}
      />
      <div className="prose prose-invert mx-auto py-8">
        <h1>{title}</h1>
        <Markdown content={content} />
      </div>
    </>
  );
}
