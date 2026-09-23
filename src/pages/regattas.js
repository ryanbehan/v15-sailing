import Head from 'next/head';
import { getRegattas } from '../lib/content';

export default function Regattas({ regattas }) {
  return (
    <>
      <Head>
        <title>Regattas | V-15 Sailing</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Racing &amp; Regattas</h1>
      <p className="mb-6 text-gray-700">
        The Vanguard 15 calendar is maintained by{' '}
        <a href="https://vanguard15.org/schedule/" target="_blank" rel="noopener" className="text-sky-blue underline">
          Fleet 53 (vanguard15.org)
        </a>
        — check there for the latest dates and registration details.
      </p>
      <ul className="space-y-4 prose">
        {regattas.map((r) => (
          <li key={r.url} className="border p-4 rounded-md hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{r.name}</h2>
                <p className="text-sm text-gray-600">{r.location}{r.date ? ` — ${r.date}` : ''}</p>
              </div>
              <a href={r.url} target="_blank" rel="noopener" className="text-sky-blue underline text-sm">Details</a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export async function getStaticProps() {
  const regattas = await getRegattas();
  return { props: { regattas } };
}
