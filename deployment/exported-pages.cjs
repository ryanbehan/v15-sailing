const { readdir, readFile } = require('node:fs/promises');
const path = require('node:path');
const { parse, serialize } = require('parse5');

const OUTPUT_DIR = path.resolve('out');

function* elements(node) {
  if (node.tagName) yield node;
  for (const child of node.childNodes || []) yield* elements(child);
}

function attributes(node) {
  return Object.fromEntries((node.attrs || []).map((attribute) => [attribute.name, attribute.value]));
}

function text(node) {
  return node?.value || (node?.childNodes || []).map(text).join('');
}

async function readPage(file) {
  const document = parse(await readFile(file, 'utf8'));
  const nodes = [...elements(document)];
  const head = nodes.find((node) => node.tagName === 'head');
  const tags = (head?.childNodes || []).map((node) => ({ tagName: node.tagName, ...attributes(node) }));
  if (tags.some((tag) => tag.tagName === 'meta' && tag.name?.toLowerCase() === 'robots' && /\b(?:noindex|none)\b/i.test(tag.content || ''))) return null;
  const canonicals = tags.filter((tag) => tag.tagName === 'link' && tag.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  if (canonicals.length !== 1 || !canonicals[0].href) throw new Error(`Expected one canonical URL in ${file}`);
  const url = new URL(canonicals[0].href).href;
  const main = nodes.find((node) => node.tagName === 'main');
  const title = text(head?.childNodes.find((node) => node.tagName === 'title'));
  const description = (head?.childNodes || []).map(attributes).find((tag) => tag.name === 'description')?.content;
  const siteName = tags.find((tag) => tag.property === 'og:site_name')?.content;
  if (!main || !title || !description) throw new Error(`Expected page content and metadata in ${file}`);
  const heading = text([...elements(main)].find((node) => node.tagName === 'h1')).replace(/\s+/g, ' ').trim();
  for (const node of elements(main)) {
    node.attrs = (node.attrs || []).filter((attribute) => {
      if (!['href', 'src'].includes(attribute.name) || !attribute.value) return true;
      const target = new URL(attribute.value, url);
      if (!['https:', 'http:', 'mailto:', 'tel:'].includes(target.protocol)) return false;
      attribute.value = target.href;
      return true;
    });
  }
  const state = nodes.find((node) => node.tagName === 'script' && attributes(node).id === '__NEXT_DATA__');
  const props = state ? JSON.parse(text(state)).props?.pageProps || {} : {};
  const sections = [...elements(main)].filter((node) => ['h2', 'h3'].includes(node.tagName))
    .map((node) => ({ id: attributes(node).id, title: text(node).replace(/\s+/g, ' ').trim() }));
  if (sections.some((section) => !section.id) || new Set(sections.map((section) => section.id)).size !== sections.length) {
    throw new Error(`Expected unique citable section IDs in ${file}`);
  }
  return { url, file, title, description, siteName, heading, sections, html: serialize(main), props };
}

async function pageFiles(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });
  if (entries.some((entry) => entry.name === '.ignore')) return files;
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_') || path.relative(OUTPUT_DIR, file) === 'admin') continue;
      files.push(...await pageFiles(file));
    } else if (entry.isFile() && entry.name === 'index.html') {
      files.push(file);
    }
  }
  return files;
}

async function publishedPages() {
  const home = await readPage(path.join(OUTPUT_DIR, 'index.html'));
  const origin = home && new URL(home.url);
  if (!origin || origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash) {
    throw new Error('The homepage must have an indexable HTTPS root canonical');
  }
  const pages = [];
  const urls = new Set();
  for (const file of await pageFiles(OUTPUT_DIR)) {
    const page = await readPage(file);
    if (!page) continue;
    const route = `/${path.relative(OUTPUT_DIR, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
    if (page.url !== new URL(route, origin).href || urls.has(page.url)) {
      throw new Error(`Canonical URL does not uniquely match the exported route: ${file}`);
    }
    urls.add(page.url);
    pages.push(page);
  }
  return pages.sort((a, b) => a.url.localeCompare(b.url, 'en'));
}

module.exports = { OUTPUT_DIR, publishedPages };
