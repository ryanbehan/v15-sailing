import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { tmpdir } from 'node:os';
import checker from '../deployment/check-content.cjs';

const exec = promisify(execFile);
const cli = path.resolve('deployment/check-content.cjs');

test('published local links, image paths and fragments must resolve; external archives stay advisory', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'v15-content-'));
  const pages = (html) => [{ url: 'https://v-15.org/', html }];
  try {
    await writeFile(path.join(directory, 'index.html'), '<main id="section-rigging"></main>');
    await writeFile(path.join(directory, 'rigging.pdf'), 'fixture PDF');
    assert.equal(await checker.validateReferences(pages('<a href="/#section-rigging">Rigging</a><a href="/rigging.pdf#page=2">PDF</a><a href="https://archive.example/old">Archive</a>'), directory), 2);
    for (const reference of ['<a href="/#missing">Missing section</a>', '<a href="/missing.pdf">Missing document</a>', '<img src="/missing.jpg"/>']) {
      await assert.rejects(checker.validateReferences(pages(reference), directory), /broken (href|src)/);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('editorial uncertainty and historical dates produce warnings without rejecting a valid export', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'v15-editorial-'));
  try {
    await mkdir(path.join(directory, 'out'));
    const state = { props: { pageProps: { regattas: [{ name: 'Historic race', date: '1900-01-01' }, { name: 'Recurring race', date: 'October' }] } } };
    await writeFile(path.join(directory, 'out/index.html'), `<html><head><title>Fixture</title><meta name="description" content="Editorial fixture"/><link rel="canonical" href="https://v-15.org/"/></head><body><main><h1>Archive</h1>Pending active club verification</main><script id="__NEXT_DATA__">${JSON.stringify(state)}</script></body></html>`);
    const result = await exec(process.execPath, [cli], { cwd: directory });
    assert.match(result.stdout, /Validated/);
    assert.match(result.stderr, /pending verification/);
    assert.match(result.stderr, /past date/);
    assert.match(result.stderr, /recurring or unconfirmed date/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
