import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

const GUIDES_DIR = path.join(process.cwd(), 'doc', 'guides');

export async function getSections() {
  const entries = await fs.readdir(GUIDES_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

export async function getGuideArticles() {
  const sections = await getSections();
  const articles = [];
  for (const section of sections) {
    const dirPath = path.join(GUIDES_DIR, section);
    const files = await fs.readdir(dirPath);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const fullPath = path.join(dirPath, file);
        const raw = await fs.readFile(fullPath, 'utf-8');
        const { data, content } = matter(raw);
        const slug = path.basename(file, '.md');
        articles.push({
          section,
          slug,
          title: data.title || slug,
          content,
          original_pdf: data.original_pdf || null,
          source_url: data.source_url || null,
        });
      }
    }
  }
  return articles;
}

export async function getArticlesBySection(section) {
  const all = await getGuideArticles();
  return all.filter((a) => a.section === section);
}

export async function getArticle(section, slug) {
  const articles = await getArticlesBySection(section);
  return articles.find((a) => a.slug === slug) || null;
}
