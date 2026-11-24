import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import Link from 'next/link';
import { getRegattas } from '../lib/content';

export default function Regattas({ regattas }) {
  return (
    <>
      <Seo
        title="Vanguard 15 Racing & Regattas"
        description="Explore Vanguard 15 racing series and regattas, find host clubs, and follow the Fleet 53 calendar for current West Coast dates and registration."
        path="/regattas/"
        type="CollectionPage"
      />
      <div className="py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Calendar / Racing</p>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-6">Racing &amp; Regattas</h1>
        <p className="mb-8 text-white/60">
          Weekly series and annual regattas hosted by active{' '}
          <Link href="/articles/clubs" className="text-signal underline">V15 clubs</Link>
          {' '}around the country. The Fleet 53 calendar at{' '}
          <a href="https://vanguard15.org/schedule/" target="_blank" rel="noopener" className="text-signal underline">
            vanguard15.org
          </a>
          {' '}has the latest dates and registration details for West Coast events.
        </p>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {regattas.map((r) => (
            <li key={r.url} className="group">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
                {r.image && (
                  <img src={r.image} alt={r.name} className="w-full h-48 sm:w-40 sm:h-28 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                )}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1 min-w-0">
                  <div>
                    <SectionHeading className="text-lg font-bold uppercase tracking-wide group-hover:text-signal transition">{r.name}</SectionHeading>
                    <p className="text-sm text-white/55">{r.location}{r.date ? ` — ${r.date}` : ''}</p>
                    {r.host && (
                      <p className="text-sm text-white/55">
                        Host:{' '}
                        <a href={r.hostUrl} target="_blank" rel="noopener" className="text-signal underline">
                          {r.host}
                        </a>
                      </p>
                    )}
                  </div>
                  <a href={r.url} target="_blank" rel="noopener" className="font-mono text-xs uppercase tracking-[0.2em] text-signal hover:text-white transition flex-shrink-0">Details →</a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const regattas = await getRegattas();
  return { props: { regattas } };
}
