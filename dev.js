const { spawn } = require('child_process');
const path = require('path');

// Clean up inherited npm environment variables that confuse Next.js / Turbopack
const env = { ...process.env };
delete env.INIT_CWD;
delete env.npm_config_prefix;
delete env.npm_package_json;
delete env.npm_lifecycle_event;
delete env.npm_lifecycle_script;
delete env.npm_node_execpath;
delete env.npm_execpath;

function runService(name, dir, command, args, color) {
  const child = spawn(command, args, {
    cwd: path.resolve(__dirname, dir),
    shell: true,
    env,
    stdio: 'pipe'
  });

  const print = (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      // Clean up carriage returns from Windows
      const cleaned = line.replace(/\r$/, '');
      if (cleaned.trim() || cleaned === '') {
        console.log(`\x1b[${color}m[${name}]\x1b[0m ${cleaned}`);
      }
    });
  };

  child.stdout.on('data', print);
  child.stderr.on('data', print);

  child.on('close', (code) => {
    console.log(`\x1b[1;31m[${name}]\x1b[0m process exited with code ${code}`);
    // Terminate the entire orchestrator if any service exits
    process.exit(code || 0);
  });

  return child;
}

console.log('\x1b[1;32mStarting Clube do Livro services...\x1b[0m\n');

// Start backend (magenta: 35) and frontend (cyan: 36)
const backend = runService('backend', 'backend', 'npm', ['run', 'start:dev'], '35');
const frontend = runService('frontend', 'frontend', 'npm', ['run', 'dev'], '36');

// Graceful termination
const shutdown = () => {
  console.log('\n\x1b[1;33mStopping all services...\x1b[0m');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
