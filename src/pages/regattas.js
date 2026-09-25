import Head from 'next/head';
import Link from 'next/link';
import { getRegattas } from '../lib/content';

export default function Regattas({ regattas }) {
  return (
    <>
      <Head>
        <title>Regattas | V-15 Sailing</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Racing &amp; Regattas</h1>
      <p className="mb-6 text-gray-700">
        Weekly series and annual regattas hosted by active{' '}
        <Link href="/articles/clubs" className="text-sky-blue underline">V15 clubs</Link>
        {' '}around the country. The Fleet 53 calendar at{' '}
        <a href="https://vanguard15.org/schedule/" target="_blank" rel="noopener" className="text-sky-blue underline">
          vanguard15.org
        </a>
        {' '}has the latest dates and registration details for West Coast events.
      </p>
      <ul className="space-y-4 prose">
        {regattas.map((r) => (
          <li key={r.url} className="border rounded-md hover:bg-gray-50 overflow-hidden">
            <div className="flex items-center gap-4">
              {r.image && (
                <img src={r.image} alt="" className="w-32 h-24 sm:w-40 sm:h-28 object-cover flex-shrink-0" loading="lazy" />
              )}
              <div className="flex justify-between items-center flex-1 p-4">
                <div>
                  <h2 className="text-lg font-semibold">{r.name}</h2>
                  <p className="text-sm text-gray-600">{r.location}{r.date ? ` — ${r.date}` : ''}</p>
                  {r.host && (
                    <p className="text-sm text-gray-600">
                      Host:{' '}
                      <a href={r.hostUrl} target="_blank" rel="noopener" className="text-sky-blue underline">
                        {r.host}
                      </a>
                    </p>
                  )}
                </div>
                <a href={r.url} target="_blank" rel="noopener" className="text-sky-blue underline text-sm flex-shrink-0">Details</a>
              </div>
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
