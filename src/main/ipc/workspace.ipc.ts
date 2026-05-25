// IPC 핸들러 = renderer의 요청을 받는 진입점.
//
// 학습 포인트 — Result 패턴 적용 후:
//   - 모든 핸들러는 Result<T> 형태로 반환 (도메인 실패는 throw가 아니라 값).
//   - throw가 발생하는 건 진짜 코드 버그 — IPC reject로 전파됨.
//   - 사용자 취소(dialog 닫기)는 에러가 아니라 reason='cancelled'로 명시.

import { ipcMain, dialog, BrowserWindow } from 'electron';
import { workspaceService } from '../services/workspace.service';
import { IPC_CHANNELS } from '../constants/ipc.constants';
import { ok, err, type Result } from '../types/result';

export function registerWorkspaceIpc(): void {
  ipcMain.handle(IPC_CHANNELS.WORKSPACE_OPEN_FOLDER, async (e): Promise<Result<string>> => {
    const win = BrowserWindow.fromWebContents(e.sender);
    const result = await dialog.showOpenDialog(win ?? new BrowserWindow({ show: false }), {
      properties: ['openDirectory'],
      title: '폴더 선택',
    });
    if (result.canceled || result.filePaths.length === 0) {
      // 취소는 에러가 아님 — reason으로 명시해서 caller가 무시할지 알림 띄울지 결정.
      return err('cancelled', 'user cancelled folder dialog');
    }
    return ok(result.filePaths[0]);
  });

  ipcMain.handle(IPC_CHANNELS.WORKSPACE_READ_TREE, async (_e, rootPath: string) => {
    return workspaceService.readTree(rootPath);
  });
}
