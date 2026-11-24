import React from 'react';
import Seo from '../../components/Seo';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Markdown from '../../components/Markdown';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'doc/rules/rules.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);
  return { props: { content } };
}

export default function Rules({ content }) {
  return (
    <>
      <Seo
        title="Vanguard 15 Class Rules"
        description="Read the archived 2015 and 2013 Vanguard 15 class rules, download the original PDFs, and check the latest rules before entering an official event."
        path="/articles/rules/"
      />
      <div className="prose prose-invert mx-auto py-8">
        <Markdown content={content} />
      </div>
    </>
  );
}
