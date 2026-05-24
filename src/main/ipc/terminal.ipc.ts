import { ipcMain } from 'electron';

export function registerTerminalIpc(): void {
  ipcMain.handle('terminal:spawn', async () => null);
}
