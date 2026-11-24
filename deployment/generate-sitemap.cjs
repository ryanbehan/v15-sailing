const { writeFile } = require('node:fs/promises');
const path = require('node:path');
const { OUTPUT_DIR, publishedPages } = require('./exported-pages.cjs');

function escapeXml(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

async function main() {
  const pages = await publishedPages();
  const entries = pages.map((page) => `  <url><loc>${escapeXml(page.url)}</loc></url>`).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  await Promise.all([
    writeFile(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap),
    writeFile(path.resolve('public', 'sitemap.xml'), sitemap),
  ]);
  console.log(`Generated sitemap for ${pages.length} indexable pages.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
