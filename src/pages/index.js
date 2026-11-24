import Head from 'next/head';
import Link from 'next/link';
import { getArticles } from '../lib/content';

const sections = [
  {
    href: '/guides/',
    title: 'Guides',
    text: 'Tuning, rigging, racing, and maintenance guides for the Vanguard 15.',
  },
  {
    href: '/articles/',
    title: 'Articles',
    text: 'Class history, contacts, membership info, and the 2005 season archive.',
  },
  {
    href: '/parts/',
    title: 'Parts & Vendors',
    text: 'Part numbers, the interactive parts finder, and where to buy V15 gear.',
  },
  {
    href: '/regattas/',
    title: 'Racing',
    text: 'Weekly series and championship regattas on the Fleet 53 calendar.',
  },
];

export default function Home({ articles }) {
  return (
    <>
      <Head>
        <title>V-15 Sailing | Vanguard 15 Class Resources</title>
        <meta name="description" content="Resources, parts, and regatta info for Vanguard 15 sailors" />
      </Head>
      <div className="bg-ink text-white">
        <section className="relative overflow-hidden border-b-4 border-signal">
          <img
            src="/images/fleet53/hiking-upwind.jpg"
            alt="Vanguard 15 crew hiking hard upwind"
            className="absolute inset-0 w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 race-hero-shade" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="flex items-center gap-3 text-signal text-xs font-mono tracking-[0.3em] uppercase mb-6">
              <img src="/images/v15-mark.svg" alt="Vanguard 15 sail insignia" width="80" height="65" className="w-16 md:w-20 h-auto shrink-0" />
              <span>Vanguard 15<br />Community Resources</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.92] tracking-tight max-w-4xl">
              Built to race.<br />
              <span className="text-race-red">Ready to sail.</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-lg font-light">
              Tuning guides, parts data, and the regatta calendar for the strict one-design V15.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/regattas/" className="bg-signal hover:bg-signal-dark text-white font-bold uppercase tracking-wide px-6 py-3 transition">
                Race calendar
              </Link>
              <Link href="/parts/catalog" className="border border-white/40 text-white font-bold uppercase tracking-wide px-6 py-3 hover:bg-white/10 transition">
                Parts finder
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-start">
            <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-signal pt-2">Index / Resources</h2>
            <div className="grid sm:grid-cols-2 gap-x-10">
              {sections.map((s, i) => (
                <Link key={s.href} href={s.href} className="group border-t border-white/15 py-5 flex gap-4">
                  <span className="font-mono text-signal text-sm pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block text-xl font-bold uppercase tracking-wide group-hover:text-signal transition">{s.title}</span>
                    <span className="block mt-1 text-sm text-white/60">{s.text}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-14 grid gap-8 md:grid-cols-[1fr_2fr] items-start">
          <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-signal pt-2">The Boat</h2>
          <div className="text-lg text-white/70 font-light space-y-4">
            <p>
              A fast, strict one-design two-person dinghy with an active racing community.
              This site collects the class knowledge that used to live on the old v15.org:
              tuning guides, rigging instructions, parts sources, and racing history.
            </p>
            <p>
              New to the boat? Start with the{' '}
              <Link href="/guides/rigging/rigging-manual" className="text-signal underline">rigging manual</Link>{' '}
              or find a fleet on the{' '}
              <Link href="/articles/clubs" className="text-signal underline">clubs page</Link>.
            </p>
          </div>
        </section>

        <section className="border-y border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-signal">From the Fleets</h2>
              <Link href="/gallery" className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 hover:text-signal transition">
                Full gallery →
              </Link>
            </div>
            <p className="text-white/60 text-sm mb-6">
              Frostbiting at{' '}
              <a href="https://crdc.v-15.org" target="_blank" rel="noopener" className="text-signal underline">
                Connetquot River Dinghy Club
              </a>
              , Oakdale NY.
            </p>
            <div className="grid gap-1 grid-cols-2 md:grid-cols-4">
              {[
                { src: '/images/crdc/start-lineup.jpg', alt: 'V15s lined up at a start' },
                { src: '/images/crdc/frostbite-fleet.jpg', alt: 'Frostbite fleet racing in winter' },
                { src: '/images/crdc/capsize-recovery.jpg', alt: 'Sailor righting a capsized V15' },
                { src: '/images/crdc/fleet-group-photo.jpg', alt: 'CRDC fleet sailors on shore' },
              ].map((img) => (
                <img key={img.src} src={img.src} alt={img.alt} className="w-full h-40 md:h-48 object-cover" />
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14 grid gap-8 md:grid-cols-[1fr_2fr]">
          <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-signal pt-2">Latest / Articles</h2>
          <ul className="divide-y divide-white/10">
            {articles.map((a, i) => (
              <li key={a.url}>
                <Link href={`/articles/${a.url}`} className="group flex items-baseline gap-4 py-4">
                  <span className="font-mono text-sm text-white/60">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block text-lg font-bold uppercase tracking-wide group-hover:text-signal transition">{a.title}</span>
                    {a.description && <span className="block text-sm text-white/55">{a.description}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

Home.fullBleed = true;

export async function getStaticProps() {
  const articles = await getArticles();
  return {
    props: {
      articles: articles.map(({ url, title, description }) => ({ url, title, description })),
    },
  };
}
