import { spawn } from 'node:child_process';

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolveFn, rejectFn) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
    child.on('exit', (code) => (code === 0 ? resolveFn() : rejectFn(new Error(`${cmd} exit ${code}`))));
  });
}

async function main() {
  await run('pnpm', ['run', 'build']);
  await run('electron-builder', ['--publish', 'never']);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
