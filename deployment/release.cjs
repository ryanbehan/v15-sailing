const { command, releaseEnvironment, availablePort } = require('./release-runtime.cjs');
const { fingerprint, invalidate, record } = require('./release-state.cjs');

async function main() {
  await invalidate();
  const env = releaseEnvironment();
  await availablePort(env.RELEASE_PORT);
  console.log(`Release checks: Node ${process.version}, ${process.platform}, ${env.BASE_URL}`);
  await command('make', ['build'], { env });
  const before = await fingerprint();
  await command('make', ['test'], { env });
  await command('make', ['check-content'], { env });
  await command('make', ['release-browser'], { env });
  await command('make', ['check'], { env });
  const receipt = await record(before);
  console.log(`Verified ${receipt.files} artifact/input files: ${receipt.digest}`);
  if (process.argv.includes('--publish')) await command('make', ['publish-verified'], { env });
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
