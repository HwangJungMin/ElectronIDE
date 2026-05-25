// 워크스페이스 파일 시스템 접근.
// renderer는 fs를 직접 호출할 수 없음 (contextIsolation + sandbox 보안).
// main 프로세스가 fs를 다루고 결과만 직렬화해서 IPC로 전달.
//
// 학습 포인트:
//   - 모든 외부 호출 (renderer 노출용) 메서드는 Result<T>를 반환.
//     도메인 실패(파일 없음, 권한)는 reason으로 분류, throw는 진짜 코드 버그용.
//   - readdir/stat은 비동기 → Promise.all로 병렬 처리하면 큰 트리도 빠름.
//   - IGNORE 목록으로 node_modules 같은 거대 디렉터리 스킵.
//   - 깊이/엔트리 수 제한으로 폭주 방지.

import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { type Result, ok, err, errFromException } from '../types/result';

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

// 내부 재귀용 — 부분적 실패는 null로 반환해 부모가 자식을 필터링.
// (트리 전체 실패가 아니라 일부 노드만 누락되는 게 UX 상 더 나음)
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
  // 트리 읽기. 루트 자체가 못 읽히면 명시적으로 실패 반환.
  async readTree(rootPath: string): Promise<Result<FileNode>> {
    const node = await readNode(rootPath, 0);
    if (!node) return err('not-found', `Cannot read root: ${rootPath}`);
    return ok(node);
  },

  async readFile(path: string): Promise<Result<string>> {
    try {
      const content = await readFile(path, 'utf-8');
      return ok(content);
    } catch (e) {
      return errFromException(e);
    }
  },

  async writeFile(path: string, content: string): Promise<Result<void>> {
    try {
      await writeFile(path, content, 'utf-8');
      return ok(undefined);
    } catch (e) {
      return errFromException(e);
    }
  },
};
