// 워크스페이스 파일 시스템 접근.
// renderer는 fs를 직접 호출할 수 없음 (contextIsolation + sandbox 보안).
// main 프로세스가 fs를 다루고 결과만 직렬화해서 IPC로 전달.
//
// 학습 포인트:
//   - readdir/stat은 비동기 → Promise.all로 병렬 처리하면 큰 트리도 빠름
//   - IGNORE 목록으로 node_modules 같은 거대 디렉터리 스킵
//   - 깊이/엔트리 수 제한으로 폭주 방지 (악성 경로 또는 거대 폴더 보호)
//   - 에러는 null로 처리 → 부분적 실패가 전체 실패가 되지 않게

import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';

export interface FileNode {
  path: string;
  name: string;
  isDirectory: boolean;
  children?: FileNode[];
}

const IGNORE = new Set([
  'node_modules',
  '.git',
  'dist',
  'out',
  'release',
  '.next',
  '.cache',
  '.vite',
  '.DS_Store',
  'Thumbs.db',
]);

const MAX_DEPTH = 6;
const MAX_ENTRIES_PER_DIR = 1000;

async function readNode(path: string, depth: number): Promise<FileNode | null> {
  try {
    const stats = await stat(path);
    const node: FileNode = {
      path,
      name: basename(path) || path,
      isDirectory: stats.isDirectory(),
    };

    if (node.isDirectory && depth < MAX_DEPTH) {
      const entries = await readdir(path);
      const filtered = entries
        .filter((name) => !IGNORE.has(name))
        .slice(0, MAX_ENTRIES_PER_DIR);

      const children = await Promise.all(
        filtered.map((name) => readNode(join(path, name), depth + 1)),
      );

      node.children = children
        .filter((c): c is FileNode => c !== null)
        .sort((a, b) => {
          // 디렉터리 먼저, 그 다음 알파벳 순
          if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
    }

    return node;
  } catch {
    return null;
  }
}

export const workspaceService = {
  readTree: (rootPath: string) => readNode(rootPath, 0),
  readFile: (path: string) => readFile(path, 'utf-8'),
  writeFile: (path: string, content: string) => writeFile(path, content, 'utf-8'),
};
