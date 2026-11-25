import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import state from '../deployment/release-state.cjs';
import runtime from '../deployment/release-runtime.cjs';

const exec = promisify(execFile);
const root = process.cwd();
const cli = path.join(root, 'deployment/release.cjs');
const publisher = path.join(root, 'deployment/publish-verified.cjs');
const cleanEnv = { ...process.env, BASE_URL: '', WORKER_URL: '', ROUTING_ARGS: '' };

async function fixture(run) {
  const directory = await mkdtemp(path.join(tmpdir(), 'v15-release-'));
  const previousGit = process.env.GIT_DIR;
  try {
    for (const folder of ['out', 'src', 'doc', 'content', 'public', 'deployment', '__mocks__', 'tests', '.github/workflows']) await mkdir(path.join(directory, folder), { recursive: true });
    for (const file of ['out/index.html', 'src/page.js', 'doc/article.md', 'content/club.json', 'public/robots.txt', 'deployment/worker.js', 'tests/example.js', 'package.json', 'package-lock.json', 'wrangler.jsonc', 'Makefile', 'next.config.js', 'postcss.config.js', 'tailwind.config.js', 'playwright.config.js', 'jest.config.js', 'jest.setup.js']) {
      await writeFile(path.join(directory, file), file.endsWith('.json') ? '{}\n' : 'original\n');
    }
    process.chdir(directory);
    process.env.GIT_DIR = path.join(root, '.git');
    await run(directory);
  } finally {
    process.chdir(root);
    if (previousGit === undefined) delete process.env.GIT_DIR;
    else process.env.GIT_DIR = previousGit;
    await rm(directory, { recursive: true, force: true });
  }
}

test('release refuses remote origins and filtered suites before starting any build', async () => {
  for (const overrides of [{ BASE_URL: 'https://v-15.org' }, { WORKER_URL: 'https://dev.v-15.org' }, { ROUTING_ARGS: '--grep=canonical' }]) {
    await fixture(async (cwd) => {
      await assert.rejects(exec(process.execPath, [cli], { cwd, env: { ...cleanEnv, ...overrides } }), (error) => {
        assert.match(error.stderr, /Refusing|cannot filter/);
        assert.doesNotMatch(error.stdout, /next build/);
        return true;
      });
    });
  }
});

test('release rejects an occupied port without borrowing or terminating its owner', async () => {
  const server = net.createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const port = server.address().port;
    await fixture(async (cwd) => {
      await assert.rejects(exec(process.execPath, [cli], { cwd, env: { ...cleanEnv, RELEASE_PORT: String(port) } }), /occupied or unavailable/);
      assert.equal(server.listening, true);
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('failed unit checks invalidate old receipts and never reach browser checks or publication', async () => {
  await fixture(async (cwd) => {
    await mkdir('.wrangler/release', { recursive: true });
    await writeFile('.wrangler/release/verified.json', '{}');
    const bin = path.join(cwd, 'bin');
    await mkdir(bin);
    await writeFile(path.join(bin, 'make'), `#!/usr/bin/env node\nrequire('node:fs').appendFileSync('calls', process.argv.slice(2).join(' ') + '\\n');\nprocess.exit(process.argv[2] === 'test' ? 17 : 0);\n`, { mode: 0o755 });
    await assert.rejects(exec(process.execPath, [cli, '--publish'], { cwd, env: { ...cleanEnv, PATH: `${bin}${path.delimiter}${process.env.PATH}` } }), /failed \(17\)/);
    assert.equal(await readFile('calls', 'utf8'), 'build\ntest\n');
    await assert.rejects(readFile('.wrangler/release/verified.json'), { code: 'ENOENT' });
  });
});

test('publication rejects missing receipts before calling Wrangler', async () => {
  await fixture(async (cwd) => {
    await assert.rejects(exec(process.execPath, [publisher, '--dry-run'], { cwd, env: cleanEnv }), /verified\.json/);
  });
});

test('verified receipts bind output, Worker, tooling and test contracts and reject later mutations', async () => {
  await fixture(async () => {
    for (const file of ['out/index.html', 'src/page.js', 'doc/article.md', 'content/club.json', 'public/robots.txt', 'deployment/worker.js', 'wrangler.jsonc', 'package-lock.json', 'Makefile', 'tests/example.js']) {
      const before = await state.fingerprint();
      await state.record(before);
      await state.validate();
      await writeFile(file, `changed ${file}\n`);
      await assert.rejects(state.validate(), /stale/);
    }
    const before = await state.fingerprint();
    await writeFile('out/new-page.html', 'new page');
    await assert.rejects(state.record(before), /changed while checks/);
  });
});

test('child startup errors and nonzero exits cannot be reported as successful steps', async () => {
  await assert.rejects(runtime.command('/nonexistent-v15-release-command', [], { stdio: 'pipe' }), /ENOENT/);
  await assert.rejects(runtime.command(process.execPath, ['-e', 'process.exit(19)'], { stdio: 'pipe' }), /failed \(19\)/);
});

test('cancellation stays a failure even when the interrupted child gracefully exits zero', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'v15-cancel-'));
  try {
    const ready = path.join(directory, 'ready');
    const child = `process.on('SIGTERM', () => process.exit(0)); require('node:fs').writeFileSync(${JSON.stringify(ready)}, 'ready'); setInterval(() => {}, 1000);`;
    const script = `
      const { command } = require(${JSON.stringify(path.join(root, 'deployment/release-runtime.cjs'))});
      const timer = setInterval(() => {
        if (require('node:fs').existsSync(${JSON.stringify(ready)})) { clearInterval(timer); process.emit('SIGTERM'); }
      }, 10);
      command(process.execPath, ['-e', ${JSON.stringify(child)}], { stdio: 'ignore' }).then(
        () => { clearInterval(timer); },
        (error) => { clearInterval(timer); console.error(error.message); process.exitCode = 7; }
      );
    `;
    await assert.rejects(exec(process.execPath, ['-e', script], { timeout: 10000 }), (error) => error.code === 7 && /SIGTERM/.test(error.stderr));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
