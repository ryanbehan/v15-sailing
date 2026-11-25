const { command } = require('./release-runtime.cjs');
const { validate } = require('./release-state.cjs');

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const receipt = await validate();
  const env = { ...process.env, WRANGLER_SEND_METRICS: 'false' };
  if (!dryRun) await command('npx', ['--no-install', 'wrangler', 'whoami'], { env });
  await validate();
  console.log(`${dryRun ? 'Packaging' : 'Publishing'} verified artifact ${receipt.digest}`);
  await command('npx', ['--no-install', 'wrangler', 'deploy', ...(dryRun ? ['--dry-run'] : [])], { env });
  await validate();
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
