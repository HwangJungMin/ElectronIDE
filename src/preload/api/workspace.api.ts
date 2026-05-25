// renderer로 노출되는 workspace API. Result<T> 반환.

import { invoke } from '../utils/ipc-wrapper';

export interface FileNode {
  path: string;
  name: string;
  isDirectory: boolean;
  children?: FileNode[];
}

interface Result<T> {
  ok: boolean;
  value?: T;
  reason?: 'cancelled' | 'not-found' | 'permission' | 'invalid' | 'unknown';
  error?: string;
}

export const workspaceApi = {
  openFolder: () => invoke<Result<string>>('workspace:open-folder'),
  readTree: (rootPath: string) => invoke<Result<FileNode>>('workspace:read-tree', rootPath),
};
