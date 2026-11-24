import React from 'react';
import Seo from '../../components/Seo';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Markdown from '../../components/Markdown';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'doc/contacts/contacts.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);
  return { props: { content } };
}

export default function Contacts({ content }) {
  return (
    <>
      <Seo
        title="Vanguard 15 Contacts"
        description="Find links to Vanguard 15 class officers, membership, technical resources, fleet contacts, and the email list. Historical listings may need verification."
        path="/articles/contacts/"
      />
      <div className="prose prose-invert mx-auto py-8">
        <Markdown content={content} />
      </div>
    </>
  );
}
