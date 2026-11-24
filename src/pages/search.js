import { useEffect, useState, useMemo } from 'react';
import Seo from '../components/Seo';
import lunr from 'lunr';
import { getAllContent } from '../lib/content';

export default function Search({ docs }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Build index once using useMemo so it only runs client-side once.
  const idx = useMemo(() => {
    return lunr(function () {
      this.ref('id');
      this.field('title');
      this.field('text');
      docs.forEach((d) => this.add(d));
    });
  }, [docs]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    try {
      const matches = idx.search(query).map((r) => {
        const doc = docs.find((d) => d.id === r.ref);
        return doc;
      }).filter(Boolean);
      setResults(matches);
    } catch (err) {
      setResults([]);
    }
  }, [query, idx, docs]);

  return (
    <>
      <Seo
        title="Search Vanguard 15 Resources"
        description="Search Vanguard 15 sailing articles, parts, and regatta information in this community-supported resource library."
        path="/search/"
        noindex
      />
      <div className="py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Query / Search</p>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-6">Search</h1>
        <label htmlFor="site-search" className="sr-only">Search the site</label>
        <input
          type="text"
          id="site-search"
          placeholder="Search articles, parts, regattas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-panel border border-white/15 p-3 mb-6 text-white placeholder-white/60 font-mono text-sm focus:outline-none focus:border-signal"
        />
        {results.length > 0 ? (
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {results.map((r) => (
              <li key={`${r.type}-${r.id}`} className="py-4">
                {r.url.startsWith('http') ? (
                  <a href={r.url} target="_blank" rel="noopener" className="text-lg font-bold uppercase tracking-wide text-white hover:text-signal transition">
                    {r.title}
                  </a>
                ) : (
                  <a href={r.url} className="text-lg font-bold uppercase tracking-wide text-white hover:text-signal transition">
                    {r.title}
                  </a>
                )}
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal mt-1">{r.type}</p>
              </li>
            ))}
          </ul>
        ) : (
          query && <p className="text-white/60">No results found.</p>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const docs = await getAllContent();
  return {
    props: { docs },
  };
}
