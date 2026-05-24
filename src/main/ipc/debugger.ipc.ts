import { ipcMain } from 'electron';

export function registerDebuggerIpc(): void {
  ipcMain.handle('debugger:start', async () => null);
}
