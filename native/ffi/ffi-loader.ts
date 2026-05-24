import { platform } from 'node:os';

export function getNativeLibraryPath(name: string): string {
  const p = platform();
  const dir = p === 'win32' ? 'windows' : p === 'darwin' ? 'macos' : 'linux';
  const ext = p === 'win32' ? '.dll' : p === 'darwin' ? '.dylib' : '.so';
  return `native/sdk/${dir}/${name}${ext}`;
}
