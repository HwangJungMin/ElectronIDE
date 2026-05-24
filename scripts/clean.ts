import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const targets = ['out', 'dist', 'release'];

async function main() {
  for (const target of targets) {
    const dir = resolve(process.cwd(), target);
    await rm(dir, { recursive: true, force: true });
    console.log(`Cleaned ${target}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
