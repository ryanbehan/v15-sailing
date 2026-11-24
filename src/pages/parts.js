import Head from 'next/head';
import { getParts } from '../lib/content';

export default function Parts({ parts }) {
  return (
    <>
      <Head>
        <title>Parts | V-15 Sailing</title>
      </Head>
      <div className="py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Index / Parts</p>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Parts Recommendations</h1>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {parts.map((p) => (
            <li key={p.url} className="py-5">
              <a href={p.url} target="_blank" rel="noopener" className="text-lg font-bold uppercase tracking-wide text-white hover:text-signal transition">
                {p.name}
              </a>
              <p className="text-sm text-white/55 mt-1">{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const parts = await getParts();
  return { props: { parts } };
}
