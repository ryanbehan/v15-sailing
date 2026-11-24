import Seo from '../../components/Seo';
import Link from 'next/link';
import { getSections } from '../../lib/guides';

export async function getStaticProps() {
  const sections = await getSections();
  return { props: { sections } };
}

export default function GuidesIndex({ sections }) {
  return (
    <>
      <Seo
        title="Vanguard 15 Guides"
        description="Read Vanguard 15 rigging, tuning, racing, maintenance, and fleet-development guides, including practical boat setup and repair resources."
        path="/guides/"
        type="CollectionPage"
      />
      <div className="prose prose-invert mx-auto py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Index / Guides</p>
        <h1>Vanguard 15 Guides</h1>
        <ul>
          {sections.map((s) => (
            <li key={s}>
              <Link href={`/guides/${s}`} className="text-signal underline capitalize">
                {s.replace(/-/g, ' ')}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
