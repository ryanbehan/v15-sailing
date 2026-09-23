import { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
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
      <Head>
        <title>Search | V-15 Sailing</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <input
        type="text"
        placeholder="Search articles, parts, regattas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />
      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((r) => (
            <li key={`${r.type}-${r.id}`} className="border p-4 rounded-md hover:bg-gray-50">
              {r.url.startsWith('http') ? (
                <a href={r.url} target="_blank" rel="noopener" className="text-lg font-semibold text-sky-blue underline">
                  {r.title}
                </a>
              ) : (
                <a href={r.url} className="text-lg font-semibold text-sky-blue underline">
                  {r.title}
                </a>
              )}
              <p className="text-sm text-gray-600 capitalize">{r.type}</p>
            </li>
          ))}
        </ul>
      ) : (
        query && <p>No results found.</p>
      )}
    </>
  );
}

export async function getStaticProps() {
  const docs = await getAllContent();
  return {
    props: { docs },
  };
}
