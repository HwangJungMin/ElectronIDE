import { ipcMain, app } from 'electron';

export function registerSystemIpc(): void {
  ipcMain.handle('system:version', () => app.getVersion());
}
