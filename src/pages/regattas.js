import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import Link from 'next/link';
import { getRegattas } from '../lib/content';

function RegattaRow({ r, meta }) {
  return (
    <li className="group">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
        {r.image && r.imageCaption && (
          <figure className="m-0 w-full sm:w-40 flex-shrink-0">
            <img src={r.image} alt={r.imageAlt || r.imageCaption} className="w-full h-48 sm:h-28 object-cover" loading="lazy" decoding="async" />
            <figcaption className="mt-2 text-xs text-white/60">{r.imageCaption}</figcaption>
          </figure>
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
            {r.contact && (
              <p className="text-sm text-white/55">
                Contact:{' '}
                <a href={`mailto:${r.contact}`} className="text-signal underline">
                  {r.contact}
                </a>
              </p>
            )}
            {r.notes && <p className="text-xs text-white/45">{r.notes}</p>}
            {meta && <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{meta}</p>}
          </div>
          {r.url && (
            <a href={r.url} target="_blank" rel="noopener" className="font-mono text-xs uppercase tracking-[0.2em] text-signal hover:text-white transition flex-shrink-0">Details →</a>
          )}
        </div>
      </div>
    </li>
  );
}

export default function Regattas({ current, pending, past }) {
  return (
    <>
      <Seo
        title="Vanguard 15 Racing & Regattas"
        description="Confirmed Vanguard 15 racing series, events awaiting current-season confirmation, and past regattas grouped by year."
        path="/regattas/"
        type="CollectionPage"
      />
      <div className="py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Calendar / Racing</p>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-6">Racing &amp; Regattas</h1>
        <p className="mb-10 text-white/60">
          Confirmed dates, organizer links, and past events for{' '}
          <Link href="/articles/clubs" className="text-signal underline">V15 clubs</Link>
          {' '}around the country. The Fleet 53 calendar at{' '}
          <a href="https://vanguard15.org/schedule/" target="_blank" rel="noopener" className="text-signal underline">
            vanguard15.org
          </a>
          {' '}has the latest dates and registration details for West Coast events.
          {' '}Photos are shown only with confirmed club attribution.
        </p>

        <section className="mb-12">
          <SectionHeading className="text-xl font-bold uppercase tracking-wide mb-5">Upcoming &amp; Current</SectionHeading>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {current.map((r) => (
              <RegattaRow key={r.url || r.name} r={r} meta={r.verifiedOn ? `Verified ${r.verifiedOn}` : null} />
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <SectionHeading className="text-xl font-bold uppercase tracking-wide mb-2">Awaiting Confirmation</SectionHeading>
          <p className="mb-5 text-sm text-white/50">These listings do not yet have verified current-season details.</p>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {pending.map((r) => (
              <RegattaRow key={r.url || r.name} r={r} meta={r.unconfirmed || 'Current-season details unconfirmed'} />
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <SectionHeading className="text-xl font-bold uppercase tracking-wide mb-5">Past Regattas</SectionHeading>
          {past.map(({ year, items }) => (
            <div key={year} className="mb-8">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-2">{year}</p>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {items.map((r) => (
                  <RegattaRow key={r.url || r.name} r={r} meta={r.verifiedOn ? `Listing verified ${r.verifiedOn}` : null} />
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const regattas = await getRegattas();
  const today = new Date().toISOString().slice(0, 10);
  const current = regattas.filter((r) => r.confirmedCurrent);
  const past = regattas
    .filter((r) => !r.confirmedCurrent && r.seasonEnd && r.seasonEnd < today)
    .sort((a, b) => (a.seasonEnd < b.seasonEnd ? 1 : -1));
  const pending = regattas.filter((r) => !r.confirmedCurrent && !(r.seasonEnd && r.seasonEnd < today));
  const years = new Map();
  for (const r of past) {
    const year = r.seasonEnd.slice(0, 4);
    if (!years.has(year)) years.set(year, []);
    years.get(year).push(r);
  }
  return { props: { current, pending, past: [...years.entries()].map(([year, items]) => ({ year, items })) } };
}
