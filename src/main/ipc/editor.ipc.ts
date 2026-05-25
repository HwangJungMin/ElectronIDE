// editor 관련 IPC — 파일 내용 읽기/쓰기.
// 실제 fs 호출은 workspaceService에 위임 (file-system 책임 분리).

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../constants/ipc.constants';
import { workspaceService } from '../services/workspace.service';

export function registerEditorIpc(): void {
  ipcMain.handle(IPC_CHANNELS.EDITOR_READ_FILE, async (_e, path: string) => {
    return workspaceService.readFile(path);
  });

  ipcMain.handle(IPC_CHANNELS.EDITOR_WRITE_FILE, async (_e, path: string, content: string) => {
    return workspaceService.writeFile(path, content);
  });
}
