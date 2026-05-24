import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../constants/ipc.constants';

export function registerEditorIpc(): void {
  ipcMain.handle(IPC_CHANNELS.EDITOR_OPEN_FILE, async (_e, _path: string) => {
    return null;
  });
}

export function registerAllIpc(): void {
  registerEditorIpc();
}
