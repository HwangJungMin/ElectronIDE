// IPC 핸들러 = renderer의 요청을 받는 진입점.
//
// ipcMain.handle(channel, fn):
//   - renderer는 ipcRenderer.invoke(channel, ...args)로 호출
//   - fn의 반환값(Promise OK)이 renderer로 직렬화돼서 전달
//   - 예외는 IPC를 거쳐 renderer의 Promise reject로 전파
//
// 보안 원칙:
//   - renderer는 신뢰할 수 없는 입력 — path를 받으면 검증 필요
//     (실무에선 workspace root 밖 접근 차단, 심볼릭 링크 방지 등)

import { ipcMain, dialog, BrowserWindow } from 'electron';
import { workspaceService } from '../services/workspace.service';
import { IPC_CHANNELS } from '../constants/ipc.constants';

export function registerWorkspaceIpc(): void {
  ipcMain.handle(IPC_CHANNELS.WORKSPACE_OPEN_FOLDER, async (e) => {
    // 다이얼로그를 호출한 창에 모달로 띄우면 UX가 자연스러움
    const win = BrowserWindow.fromWebContents(e.sender);
    const result = await dialog.showOpenDialog(win ?? new BrowserWindow({ show: false }), {
      properties: ['openDirectory'],
      title: '폴더 선택',
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  ipcMain.handle(IPC_CHANNELS.WORKSPACE_READ_TREE, async (_e, rootPath: string) => {
    return workspaceService.readTree(rootPath);
  });
}
