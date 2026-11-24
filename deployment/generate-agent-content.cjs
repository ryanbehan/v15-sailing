const { writeFile } = require('node:fs/promises');
const path = require('node:path');
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');
const { OUTPUT_DIR, publishedPages } = require('./exported-pages.cjs');

const converter = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
converter.use(gfm);
converter.remove(['script', 'style', 'button', 'input', 'select', 'textarea', 'svg', 'canvas', 'noscript', 'template']);

function link(label, url) {
  const name = label.replace(/[\[\]\\]/g, '\\$&').replace(/\s+/g, ' ').trim();
  return `[${name}](${url.replace(/\(/g, '%28').replace(/\)/g, '%29')})`;
}

function markdownBody(page) {
  const article = page.props.article;
  const originalArticle = article && (article.format === 'markdown' || article.section);
  const source = originalArticle ? article.content : page.props.content;
  let body = typeof source === 'string' && source.trim() ? source.trim() : converter.turndown(page.html);
  if (!/^#\s+/m.test(body)) body = `# ${page.heading}\n\n${body}`;
  if (originalArticle && article.original_pdf) {
    const pdf = new URL(`/${article.original_pdf.replace(/^\/+/, '')}`, page.url).href;
    body += `\n\nOriginal PDF: ${link('download', pdf)}`;
  }
  if (originalArticle && article.source_url) {
    body += `\n\nOriginally published on ${link('the original source', new URL(article.source_url, page.url).href)}.`;
  }
  return body.trim();
}

function group(url) {
  const section = new URL(url).pathname.split('/')[1];
  return {
    guides: 'Guides',
    articles: 'Articles and fleets',
    parts: 'Parts and vendors',
    regattas: 'Racing',
    gallery: 'Optional',
  }[section] || 'Start here';
}

async function main() {
  const pages = await publishedPages();
  const home = pages.find((page) => new URL(page.url).pathname === '/');
  const groups = new Map(['Start here', 'Guides', 'Articles and fleets', 'Parts and vendors', 'Racing', 'Optional'].map((name) => [name, []]));
  for (const page of pages) {
    const frontmatter = Object.entries({ title: page.title, description: page.description, url: page.url })
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
    const contents = page.sections.map((section) => {
      const target = new URL(page.url);
      target.hash = section.id;
      return `- ${link(section.title, target.href)}`;
    }).join('\n');
    const body = contents ? markdownBody(page).replace(/(^# [^\n]+)(\n|$)/m, (_, heading, ending) => `${heading}\n\n## On this page\n\n${contents}\n${ending}`) : markdownBody(page);
    const markdown = `---\n${frontmatter}\n---\n\n${body}\n`;
    await writeFile(path.join(path.dirname(page.file), 'index.md'), markdown);
    const label = page.title.endsWith(` | ${home.siteName}`) ? page.title.slice(0, -(` | ${home.siteName}`).length) : page.title;
    groups.get(group(page.url)).push(`- ${link(label, `${page.url}index.md`)}: ${page.description}`);
  }
  const sections = [...groups].filter(([, entries]) => entries.length)
    .map(([name, entries]) => `## ${name}\n\n${entries.join('\n')}`).join('\n\n');
  const discovery = `# ${home.siteName}\n\n> ${home.description}\n\nThis volunteer-supported community resource includes historical material. Preserve the source attribution, archival context, and club-activity verification notes on individual pages.\n\n${sections}\n`;
  await writeFile(path.join(OUTPUT_DIR, 'llms.txt'), discovery);
  console.log(`Generated ${pages.length} Markdown pages and llms.txt.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
