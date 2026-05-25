// 모든 IPC 핸들러 등록을 한 곳에 모은다.
// 새 IPC 모듈 추가 시 이 파일에만 import 한 줄 추가하면 됨.

import { registerEditorIpc } from './editor.ipc';
import { registerWorkspaceIpc } from './workspace.ipc';

export function registerAllIpc(): void {
  registerEditorIpc();
  registerWorkspaceIpc();
}
