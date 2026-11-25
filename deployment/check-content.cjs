const path = require('node:path');
const { readFile, stat } = require('node:fs/promises');
const { parse } = require('parse5');
const { OUTPUT_DIR, publishedPages, elements, attributes } = require('./exported-pages.cjs');

async function validateReferences(pages, directory) {
  const cache = new Map();
  async function target(url) {
    if (!cache.has(url.pathname)) {
      cache.set(url.pathname, (async () => {
        const file = path.resolve(directory, `.${decodeURIComponent(url.pathname)}`);
        if (file !== directory && !file.startsWith(`${directory}${path.sep}`)) throw new Error('Reference escapes output directory');
        let resolved = file;
        const info = await stat(file);
        if (info.isDirectory()) resolved = path.join(file, 'index.html');
        if (!resolved.endsWith('.html')) return { html: false };
        const document = parse(await readFile(resolved, 'utf8'));
        return { html: true, ids: new Set([...elements(document)].flatMap((node) => {
          const values = attributes(node);
          return [values.id, node.tagName === 'a' ? values.name : undefined].filter(Boolean);
        })) };
      })());
    }
    return cache.get(url.pathname);
  }
  let checked = 0;
  for (const page of pages) {
    for (const node of elements(parse(page.html))) {
      const values = attributes(node);
      for (const attribute of ['href', 'src']) {
        if (!values[attribute]) continue;
        const url = new URL(values[attribute], page.url);
        if (!['http:', 'https:'].includes(url.protocol) || !['v-15.org', 'www.v-15.org'].includes(url.hostname)) continue;
        try {
          const destination = await target(url);
          if (url.hash && destination.html && !destination.ids.has(decodeURIComponent(url.hash.slice(1)))) {
            throw new Error(`Missing fragment ${url.hash}`);
          }
          checked++;
        } catch (error) {
          throw new Error(`${page.url}: broken ${attribute} ${values[attribute]} (${error.message})`);
        }
      }
    }
  }
  return checked;
}

function editorialWarnings(pages) {
  const warnings = [];
  const today = new Date().toISOString().slice(0, 10);
  for (const page of pages) {
    if (page.html.includes('Pending active club verification')) warnings.push(`${page.url}: club activity remains pending verification`);
    for (const event of page.props?.regattas || []) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date || '') || !Number.isFinite(Date.parse(event.date))) {
        warnings.push(`${page.url}: ${event.name} has a recurring or unconfirmed date; confirm with its host`);
      } else if (event.date < today) {
        warnings.push(`${page.url}: ${event.name} has a past date; review archival labeling`);
      }
    }
  }
  return warnings;
}

if (require.main === module) {
  publishedPages().then(async (pages) => {
    const count = await validateReferences(pages, OUTPUT_DIR);
    console.log(`Validated ${count} local references across ${pages.length} published pages`);
    for (const warning of editorialWarnings(pages)) console.warn(`Editorial review (advisory): ${warning}`);
  }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}

module.exports = { validateReferences };
