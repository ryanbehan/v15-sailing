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
      <section className="relative text-center py-32 md:py-40 bg-gradient-to-b from-sky-blue to-sunset-orange text-white overflow-hidden">
        <img
          src="/images/v15-boat.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-contain opacity-20 pointer-events-none"
        />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Supporting the Vanguard 15 Sailing Community
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl font-light">
            Find articles, parts recommendations, and upcoming regattas—all in one place.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
        <img
          src="/images/crdc/start-lineup.jpg"
          alt="Vanguard 15s lined up at a race start, Connetquot River"
          className="rounded-xl shadow-lg w-full object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold text-navy-blue mb-4">The Vanguard 15</h2>
          <p className="text-lg text-gray-700 mb-4">
            A fast, strict one-design two-person dinghy with an active racing community.
            This site collects the class knowledge that used to live on the old v15.org:
            tuning guides, rigging instructions, parts sources, and racing history.
          </p>
          <p className="text-lg text-gray-700">
            New to the boat? Start with the{' '}
            <Link href="/guides/rigging/rigging-manual" className="text-sky-blue underline">rigging manual</Link>{' '}
            or find a fleet on the{' '}
            <Link href="/articles/clubs" className="text-sky-blue underline">clubs page</Link>.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-sky-blue transition"
            >
              <h3 className="text-xl font-bold text-navy-blue mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-navy-blue mb-2">From the Fleets</h2>
        <p className="text-gray-600 mb-4">
          Frostbiting at{' '}
          <a href="https://crdc.v-15.org" target="_blank" rel="noopener" className="text-sky-blue underline">
            Connetquot River Dinghy Club
          </a>
          , Oakdale NY.{' '}
          <Link href="/gallery" className="text-sky-blue underline">See the full gallery</Link>.
        </p>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[
            { src: '/images/crdc/start-lineup.jpg', alt: 'V15s lined up at a start' },
            { src: '/images/crdc/frostbite-fleet.jpg', alt: 'Frostbite fleet racing in winter' },
            { src: '/images/crdc/capsize-recovery.jpg', alt: 'Sailor righting a capsized V15' },
            { src: '/images/crdc/fleet-group-photo.jpg', alt: 'CRDC fleet sailors on shore' },
          ].map((img) => (
            <img key={img.src} src={img.src} alt={img.alt} className="rounded-lg shadow w-full h-40 object-cover" />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-navy-blue mb-4">Latest Articles</h2>
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.url}>
              <Link href={`/articles/${a.url}`} className="text-lg text-sky-blue underline">
                {a.title}
              </Link>
              {a.description && <p className="text-sm text-gray-600">{a.description}</p>}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export async function getStaticProps() {
  const articles = await getArticles();
  return {
    props: {
      articles: articles.map(({ url, title, description }) => ({ url, title, description })),
    },
  };
}
