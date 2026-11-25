const { spawn } = require('node:child_process');
const net = require('node:net');

function command(program, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(program, args, { stdio: 'inherit', ...options });
    let interrupted;
    const stop = (signal) => { interrupted = signal; child.kill(signal); };
    const interrupt = () => stop('SIGINT');
    const terminate = () => stop('SIGTERM');
    process.once('SIGINT', interrupt);
    process.once('SIGTERM', terminate);
    const cleanup = () => {
      process.removeListener('SIGINT', interrupt);
      process.removeListener('SIGTERM', terminate);
    };
    child.once('error', (error) => { cleanup(); reject(error); });
    child.once('exit', (code, signal) => {
      cleanup();
      if (code === 0 && !interrupted) resolve();
      else reject(new Error(`${program} ${args.join(' ')} failed (${interrupted || signal || code})`));
    });
  });
}

function releaseEnvironment(env = process.env) {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 12)) throw new Error('Release checks require Node >=22.12');
  const port = Number(env.RELEASE_PORT || 3027);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid RELEASE_PORT');
  const origin = `https://127.0.0.1:${port}`;
  for (const name of ['BASE_URL', 'WORKER_URL']) {
    if (env[name] && env[name] !== origin) throw new Error(`Refusing ${name}: release checks must target ${origin}`);
  }
  if (env.ROUTING_ARGS) throw new Error('Release checks cannot filter ROUTING_ARGS');
  return { ...env, BASE_URL: origin, WORKER_URL: origin, RELEASE_PORT: String(port), WRANGLER_SEND_METRICS: 'false' };
}

async function availablePort(port) {
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', () => reject(new Error(`Release port ${port} is occupied or unavailable`)));
    server.listen(Number(port), '127.0.0.1', () => server.close(resolve));
  });
}

module.exports = { command, releaseEnvironment, availablePort };
