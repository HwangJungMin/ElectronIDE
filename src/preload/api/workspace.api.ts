// renderer에 노출되는 워크스페이스 API.
// IPC 채널을 직접 만지지 않고 이 함수를 호출 → channel 오타로 인한 실패 방지.

import { invoke } from '../utils/ipc-wrapper';

export interface FileNode {
  path: string;
  name: string;
  isDirectory: boolean;
  children?: FileNode[];
}

export const workspaceApi = {
  openFolder: () => invoke<string | null>('workspace:open-folder'),
  readTree: (rootPath: string) => invoke<FileNode | null>('workspace:read-tree', rootPath),
};
