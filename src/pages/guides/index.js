import Head from 'next/head';
import Link from 'next/link';
import { getSections } from '../../lib/guides';

export async function getStaticProps() {
  const sections = await getSections();
  return { props: { sections } };
}

export default function GuidesIndex({ sections }) {
  return (
    <>
      <Head>
        <title>Guides | V-15 Sailing</title>
      </Head>
      <div className="prose mx-auto py-8">
        <h1>Vanguard 15 Guides</h1>
        <ul>
          {sections.map((s) => (
            <li key={s}>
              <Link href={`/guides/${s}`} className="text-sky-blue underline capitalize">
                {s.replace(/-/g, ' ')}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
