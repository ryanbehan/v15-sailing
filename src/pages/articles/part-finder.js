import React from 'react';
import Seo from '../../components/Seo';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Markdown from '../../components/Markdown';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'doc/part-finder/v15-part-finder.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);
  return { props: { content } };
}

export default function PartFinder({ content }) {
  return (
    <>
      <Seo
        title="Vanguard 15 Part Finder Guide"
        description={content}
        path="/articles/part-finder/"
      />
      <div className="prose prose-invert mx-auto py-8">
        <Markdown content={content} />
      </div>
    </>
  );
}
