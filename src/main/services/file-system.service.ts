import { readFile, writeFile } from 'node:fs/promises';

export const fileSystemService = {
  read: (path: string) => readFile(path, 'utf-8'),
  write: (path: string, data: string) => writeFile(path, data, 'utf-8'),
};
