const { createHash } = require('node:crypto');
const { readdir, readFile, mkdir, writeFile, unlink, lstat } = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const receiptFile = '.wrangler/release/verified.json';

async function fingerprint() {
  const hash = createHash('sha256');
  let files = 0;
  async function visit(file) {
    const stat = await lstat(file);
    if (stat.isSymbolicLink()) throw new Error(`Symlinks are not verified artifacts: ${file}`);
    if (stat.isDirectory()) {
      const names = (await readdir(file)).sort();
      if (names.includes('.ignore')) throw new Error(`Cannot verify ignored directory: ${file}`);
      for (const name of names) await visit(path.join(file, name));
    } else {
      hash.update(`${file}\0${stat.size}\0`);
      hash.update(await readFile(file));
      files++;
    }
  }
  for (const file of ['out', 'src', 'doc', 'content', 'public', 'deployment', 'package.json', 'package-lock.json', 'wrangler.jsonc', 'Makefile', 'next.config.js', 'postcss.config.js', 'tailwind.config.js', 'playwright.config.js', 'jest.config.js', 'jest.setup.js', '__mocks__', 'tests', '.github/workflows']) await visit(file);
  return { digest: hash.digest('hex'), files };
}

function revision() {
  return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

async function invalidate() {
  await unlink(receiptFile).catch((error) => { if (error.code !== 'ENOENT') throw error; });
}

async function record(before) {
  const after = await fingerprint();
  if (before.digest !== after.digest) throw new Error('Verified inputs changed while checks were running');
  const receipt = { version: 1, revision: revision(), ...after, checkedAt: new Date().toISOString(), platform: process.platform, node: process.version };
  await mkdir(path.dirname(receiptFile), { recursive: true });
  await writeFile(receiptFile, `${JSON.stringify(receipt, null, 2)}\n`);
  return receipt;
}

async function validate() {
  const receipt = JSON.parse(await readFile(receiptFile, 'utf8'));
  const current = await fingerprint();
  if (receipt.version !== 1 || receipt.digest !== current.digest || receipt.revision !== revision() || receipt.node !== process.version || receipt.platform !== process.platform) {
    throw new Error('Release receipt is stale; run make release-check again');
  }
  return receipt;
}

module.exports = { fingerprint, invalidate, record, validate };
