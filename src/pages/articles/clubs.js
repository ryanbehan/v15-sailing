import React from 'react';
import Seo from '../../components/Seo';
import SectionHeading from '../../components/SectionHeading';
import fs from 'fs';
import path from 'path';
import Markdown from '../../components/Markdown';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'doc/clubs/clubs.md');
  const raw = fs.readFileSync(filePath, 'utf8');
  // Split into sections by '## '
  const sections = raw.split(/^## /m).slice(1); // first split before first heading is intro
  const clubs = sections.map((sec) => {
    const [titleLine, ...rest] = sec.split('\n');
    const title = titleLine.trim();
    const body = rest.join('\n').trim();
    return { title, body };
  }).sort((a, b) => {
    if (a.title === 'National Class Association') return -1;
    if (b.title === 'National Class Association') return 1;
    return a.title.localeCompare(b.title, 'en');
  });
  return { props: { clubs } };
}

export default function Clubs({ clubs }) {
  return (
    <>
      <Seo
        title="Vanguard 15 Clubs & Fleets"
        description="Find Vanguard 15 clubs by region. Clubs marked active have confirmed current V15 sailing; other fleets may have scaled back or disbanded."
        path="/articles/clubs/"
        type="CollectionPage"
      />
      <div className="prose prose-invert mx-auto py-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">Index / Clubs</p>
        <h1>Vanguard 15 Clubs</h1>
        <p className="border-l-2 border-signal pl-4">
          <strong>Club activity verification</strong><br />
          Every club here is a real sailing organization with a history of V15 activity — but V15 fleets
          come and go, and some may have scaled back or disbanded. Clubs marked Active have confirmed
          current V15 sailing as of November 2026; for the rest, check with the club before planning a visit.
        </p>
        <div className="space-y-4">
          {clubs.map(({ title, body }) => (
            <div key={title} className="border border-white/10 bg-panel p-5 transition">
              <SectionHeading>{title}</SectionHeading>
              <Markdown
                content={body}
                components={{
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5" {...props} />,
                  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                  a: ({ node, ...props }) => (
                    <a className="text-signal hover:text-white transition" {...props} />
                  ),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
