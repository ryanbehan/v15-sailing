import React from 'react';
import Head from 'next/head';
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
  });
  return { props: { clubs } };
}

export default function Clubs({ clubs }) {
  return (
    <>
      <Head>
        <title>Clubs | V-15 Sailing</title>
      </Head>
      <div className="prose mx-auto py-8">
        <h1>Vanguard 15 Clubs</h1>
        <div className="space-y-4">
          {clubs.map(({ title, body }) => (
            <div key={title} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <h3>{title}</h3>
              <Markdown
                content={body}
                components={{
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5" {...props} />,
                  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                  a: ({ node, ...props }) => (
                    <a className="text-sky-blue hover:underline" {...props} />
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
